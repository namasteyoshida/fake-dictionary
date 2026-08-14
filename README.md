# Fake Dictionary(嘘つき辞書)

## APIキーの設定(任意)

偽単語をAIで生成するために、Anthropic APIキーを使います。未設定でも動作します(フォールバックの静的な偽単語リストが使われます)。

```bash
cp server/.env.example server/.env
# server/.env を開いて ANTHROPIC_API_KEY=sk-ant-... を設定
```

## セットアップ(VS Code Dev Containers)

VS Code拡張機能「Dev Containers」を入れた状態で、コマンドパレット(Cmd+Shift+P / Ctrl+Shift+P)から `Dev Containers: Reopen in Container` を実行してください。自動でコンテナがビルドされ、`pnpm install` まで実行されます。

コンテナが開いたら、VS Code内のターミナルを2つ開いて以下を実行してください。

```bash
# ターミナル1
pnpm --filter fake-dictionary-server dev

# ターミナル2
pnpm --filter fake-dictionary-client dev
```

VS Codeが自動でポート(3001, 5173)を検知し、通知またはPORTSタブから http://localhost:5173 をブラウザで開けます。

## セットアップ(Docker Compose)

ホストPCにNode.jsやpnpmを入れたくない場合は、Docker Desktopだけで動かせます。

```bash
# プロジェクトルートで
docker compose up --build
```

- サーバー: http://localhost:3001
- クライアント: http://localhost:5173

コード修正はホスト側のエディタで行ってOKです(volumesでコンテナに反映され、vite/tsxのホットリロードが効きます)。
止めるときは `Ctrl + C`、コンテナを削除したい場合は `docker compose down` です。

## セットアップ(pnpmを直接使う場合)

このプロジェクトは pnpm workspace として構成されています。ルートで一度 `pnpm install` すれば client/server 両方の依存パッケージがまとめてインストールされます。

```bash
# プロジェクトルートで一度だけ
pnpm install

# サーバー起動(1つ目のターミナル)
pnpm --filter fake-dictionary-server dev   # http://localhost:3001

# クライアント起動(2つ目のターミナル)
pnpm --filter fake-dictionary-client dev   # http://localhost:5173
```

## 現在の実装状況

### 完成している部分
- 型定義(サーバー/クライアント共有の通信契約)
- 部屋管理(作成・参加・自動マッチング・自動生成roomIdによるURL共有)
- ゲームルールの計算ロジック(得点計算 `gameEngine.calcScore`、出題者交代 `nextShower`)
- 全8画面のルーティングとJotai状態管理の骨格
- MeaningInputPageのバリデーション付きフォーム(React Hook Form)
- **ターン進行ロジック一式**(`server/src/socket/handlers.ts`)
  - 意味入力の反映と両者揃った時点でのバトル開始
  - カード提示 → 回答者への通知(word/meaningのみ、isRealは隠す)
  - 採点(`gameEngine.calcScore`) → 両者への結果配信 → 一定時間後に次ターンへ自動進行
  - ゲーム終了判定・勝敗判定(同点は引き分け)
  - 再戦(`game:restart`)、対戦相手切断時の通知(`opponent:disconnected`)
- **AIによる偽単語生成**(`server/src/words/wordBank.ts` の `generateFakeWords`)
  - Anthropic API(`claude-haiku-4-5-20251001`)を呼び出し、実在しない単語をJSON配列で生成
  - APIキー未設定時・呼び出し失敗時は静的なフォールバックリストに自動で切り替わる(対戦が止まらないようにするため)

### 未実装(TODOコメントあり)
1. **見た目のデザイン**
   `index.css` は最低限のスタイルのみです。本格的な見た目は `frontend-design` スキルの方針に沿って別途仕上げる想定です。

2. **本物単語辞書の拡充**
   `REAL_WORD_DICTIONARY` は5件のサンプルのみです。実運用には数十〜数百件が必要です。

3. **切断時のより丁寧なUX**
   現状は`window.alert`でタイトルに戻すのみです。再接続猶予やトースト表示などは未対応です。

## 設計上の注意点(要件定義書からの変更点)

- 当初の要件定義書には通信技術の指定がありませんでしたが、実際の別端末間オンライン対戦のため、サーバーに **Node.js + Socket.io** を追加しています。
- `handAtom` は「自分の手札のみ」を保持する設計に変更しました(相手の手札はチート防止のためサーバーから送られてきません)。
- 得点atomは `player1ScoreAtom` / `player2ScoreAtom` という固定的な命名に変更しました(出題者はターンごとに交代するため、`player`/`opponent`という相対的な命名だと得点の帰属を誤る可能性があるためです)。
