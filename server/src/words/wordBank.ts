// ========================================
// 本物の単語辞書(静的フォールバック用 & 基本単語バンク)
// ========================================
export type DictionaryEntry = { word: string; meaning: string };

const REAL_WORD_DICTIONARY: DictionaryEntry[] = [
  { word: 'かまける', meaning: '一つの物事に気を取られて他がおろそかになること' },
  { word: 'つまびらか', meaning: '細かい点まではっきりしている様子' },
  { word: 'ないがしろ', meaning: '大切なものを軽んじて、存在しないもののように扱うこと' },
  { word: 'よしなに', meaning: '相手の判断に任せて、よいように取り計らってほしいという意味' },
  { word: 'かこつける', meaning: '本当の理由ではない別のことを理由にすること' },
  { word: 'たまゆら', meaning: 'ほんの短い時間。しばしば、かすかな様' },
  { word: 'あくがれる', meaning: '心が自分を離れて漂う。うっとりと思いを奪われること' },
  { word: 'よもすがら', meaning: '夜の一晩中。夕方から明け方までずっと' },
  { word: 'ひねもす', meaning: '朝から夕方まで。終日・一日中' },
  { word: 'すこぶる', meaning: '程度がはなはだしい様。非常に・とても' },
  { word: 'おぼつかない', meaning: '状態があやふやで頼りない。はっきりしない様' },
  { word: 'つれづれ', meaning: 'やるべきことがなく手持ち無沙汰で退屈な様' },
  { word: 'うたたね', meaning: '本格的ではなく、うとうとと浅く眠ること' },
  { word: 'ゆかし', meaning: '心がひきつけられ、見てみたい・知りたいと強く思う様' },
  { word: 'あからさま', meaning: '隠すことなく露骨で明白な様' },
  { word: 'おもむろに', meaning: '落ち着いてゆっくりと行動を起こす様' },
  { word: 'うつつ', meaning: '現実の夢うつつの状態、あるいは夢中になること' },
  { word: 'こころもとない', meaning: '先行きが不安で心が落ち着かない様' },
  { word: 'すさまじ', meaning: '興が冷めておもしろくない。あるいは非常に物凄まじいこと' },
  { word: 'さぞかし', meaning: '相手の気持ちや状況を推し量る様。さぞ〜であろう' },
  { word: 'あまた', meaning: '数や量が数多く存在する様' },
  { word: 'あやかし', meaning: '不思議な現象や、怪しい妖怪・化け物のこと' },
  { word: 'うろたえる', meaning: '予想外のことに驚き、慌てて動揺すること' },
  { word: 'かたじけない', meaning: '身に余る恩恵を受けて申し訳なく、ありがたい気持ち' },
  { word: 'しおらしい', meaning: '控えめで慎ましく、可愛らしい様' },
  { word: 'つつがなく', meaning: '病気や災難などの障害がなく、無事に過ごすこと' },
  { word: 'つつましやか', meaning: '謙虚で出しゃばらず、控えめな態度である様' },
  { word: 'ひそやか', meaning: '音や気配を立てず、こっそりと静かな様' },
  { word: 'ほのめかす', meaning: 'それとなく言葉や態度に表して気づかせること' },
  { word: 'まどろむ', meaning: 'うとうとと浅く心地よく眠ること' },
  { word: 'むすぼれる', meaning: '心がふさぎ込んで晴れやかでない状態' },
  { word: 'めざとい', meaning: '見つけるのが早く、細かいことにもよく気づく様' },
  { word: 'ものうい', meaning: '体がだるく、何かをするのが億劫に感じられる様' },
  { word: 'やむごとなき', meaning: '尊く高貴である。捨ててはおけない重大なこと' },
  { word: 'ゆゆしい', meaning: '状況が重大で放置できない。恐ろしいこと' },
  { word: 'よしなし', meaning: 'つまらない。根拠がなく特別の理由もない様' },
  { word: 'よすが', meaning: '身を寄せる所や、心を頼りにする縁のこと' },
  { word: 'わびさび', meaning: '静寂で慎ましいの中に感じる趣や風情' },
  { word: 'わだかまる', meaning: '不満や疑念が心の中に残ってすっきりしない様' },
  { word: 'いざなう', meaning: '誘ってある場所や状態へ導くこと' },
  { word: 'うとむ', meaning: '心を許さず、嫌って遠ざけること' },
  { word: 'けなげ', meaning: '身心が弱くても一生懸命で、感心な様子' },
  { word: 'さやけし', meaning: '音や光が澄み切って清らかな様' },
  { word: 'たゆたう', meaning: 'ゆらゆらと揺れて定まらない様' },
  { word: 'ちぎり', meaning: '固い約束や、前世からの深い縁' },
  { word: 'みやび', meaning: '風流で都会的な上品さや優雅さ' },
  { word: 'むつまじい', meaning: '仲が良く、親しく温かい様子' },
  { word: 'やすらぎ', meaning: '心身が穏やかで落ち着いていること' },
  { word: 'かんながら', meaning: '神の御心のままに。自然の法則に従う様' },
  { word: 'うつろい', meaning: '季節や状態が少しずつ変化していく様' },
  { word: 'おぼろげ', meaning: '記憶や姿がぼんやりして不鮮明な様' },
  { word: 'かそけき', meaning: '音や光などがかすかでかすかな様' },
  { word: 'きはだつ', meaning: '他と比べて目立ってきわだつこと' },
  { word: 'けざやか', meaning: '鮮やかではっきりとしている様子' },
  { word: 'ささやか', meaning: '規模が小さく慎ましい様' },
  { word: 'しののめ', meaning: '東の空が少し明るくなる明け方のこと' },
  { word: 'たおやか', meaning: '姿や動作がしなやかで上品な様' },
  { word: 'つたなさ', meaning: '能力が低く下手で頼りないこと' },
  { word: 'なごり', meaning: '過ぎ去った後に残る気配や余韻' },
  { word: 'はかなし', meaning: '儚く脆い。あっけなく消えてしまう様' },
  { word: 'ひたむき', meaning: '一つの物事に一途に専念する様' },
  { word: 'ほの暗い', meaning: '薄暗く、わずかに光が差し込んでいる様子' },
  { word: 'まごころ', meaning: '他人のために尽くす偽りのない誠意' },
  { word: 'みやびやか', meaning: '優雅で上品な雰囲気に満ちている様' },
  { word: 'むねさわぎ', meaning: '胸がざわついて落ち着かない不安感' },
  { word: 'ゆかしさ', meaning: '心惹かれてもっと知りたくなる風情' },
  { word: 'よすがら', meaning: '一晩中。夜通しで過ごすこと' },
  { word: 'わびしい', meaning: '寂しく寂涼感があり切ない様子' },
  { word: 'あかつき', meaning: '夜が明ける直前の待ち望んだ時刻' },
  { word: 'うらうら', meaning: '日差しがのどかで穏やかな様子' },
  { word: 'おもむき', meaning: '味わい深い風情や趣向のこと' },
];


/** 静的辞書から本物の単語を1つランダムに取得する */
export function pickStaticRealWord(): DictionaryEntry {
  const idx = Math.floor(Math.random() * REAL_WORD_DICTIONARY.length);
  return REAL_WORD_DICTIONARY[idx];
}

// ========================================
// AIによる動的単語生成(本物・偽物)
// ========================================

import Anthropic from '@anthropic-ai/sdk';

const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;

const FALLBACK_FAKE_WORDS = [
  'うつろぎ', 'かげろい', 'そよかす', 'ひなもり', 'まつろぶ',
  'ゆきそう', 'おもかぜ', 'しのぶ草', 'つらつら', 'あまがこい',
  'ささらご', 'たゆらい', 'ほのすず', 'むらさめ', 'かぜはか',
  'あけぼそ', 'いわかがみ', 'おりそめ', 'かざはなぎ', 'きりまとい',
  'こもれびす', 'しずりか', 'すずかぜ', 'そよあおい', 'たかねもそ',
  'つむぎうた', 'なごみそ', 'はまかぜぎ', 'ひめゆらぎ', 'ふゆもみじ',
  'まどろみ', 'みずかがみ', 'むらぐも', 'やままゆ', 'ゆめまどい',
  'よももぎ', 'あさもや', 'いざよいぎ', 'うすもみじ', 'おぼろづき',
  'かすみがけ', 'きよよぎ', 'さざなみ', 'しらたま', 'つゆくさぎ',
  'なみまとい', 'はるかぜ', 'ひすいぎ', 'ふかみどり', 'ほしあかり',
  'みずしずく', 'むらさきぎ', 'やえざくら', 'ゆきあかり', 'よざくら',
];

/**
 * AIを呼び出して「実在する趣のある日本語単語とその正しい意味」を取得する。
 * API未設定やエラー時は静的辞書からランダムで選ぶ。
 */
export async function pickRealWord(excludeWords: string[] = []): Promise<DictionaryEntry> {
  if (!anthropic) {
    console.warn('ANTHROPIC_API_KEY未設定のため、静的辞書から本物単語を取得します');
    return getFilteredStaticRealWord(excludeWords);
  }

  try {
    const prompt = [
      '日本語の古語・大和言葉・難解語・風情のある表現の中から、実在する単語1つとその正しい意味を考えてください。',
      'ルール:',
      '- 一般的すぎる現代単語(りんご、学校など)は避け、いかにも国語辞典の奥深くに載っていそうな趣のある言葉にする',
      excludeWords.length > 0 ? `- 以下の単語とは重複させないこと: ${excludeWords.join('、')}` : '',
      '出力形式: 説明文なしで以下のJSON形式のみで出力してください。',
      '{"word": "単語(ひらがなまたは漢字表記)", "meaning": "簡潔で分かりやすい辞書風の意味説明"}',
    ]
      .filter(Boolean)
      .join('\n');

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') throw new Error('テキスト応答が得られませんでした');

    const match = textBlock.text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('JSONが見つかりませんでした');

    const parsed = JSON.parse(match[0]) as Partial<DictionaryEntry>;
    if (typeof parsed.word === 'string' && typeof parsed.meaning === 'string' && parsed.word && parsed.meaning) {
      return { word: parsed.word.trim(), meaning: parsed.meaning.trim() };
    }
    throw new Error('期待された { word, meaning } 形式ではありません');
  } catch (err) {
    console.error('pickRealWord with AI failed, falling back to static dictionary:', err);
    return getFilteredStaticRealWord(excludeWords);
  }
}

function getFilteredStaticRealWord(excludeWords: string[]): DictionaryEntry {
  const candidates = REAL_WORD_DICTIONARY.filter((e) => !excludeWords.includes(e.word));
  if (candidates.length === 0) return pickStaticRealWord();
  const idx = Math.floor(Math.random() * candidates.length);
  return candidates[idx];
}

function buildFakePrompt(count: number, excludeWords: string[]): string {
  return [
    `日本語の古語・雅語・大和言葉のように聞こえるが、実在しない単語を${count}個考えてください。`,
    'ルール:',
    '- ひらがな3〜6文字程度で、いかにも辞書に載っていそうな響きにする',
    '- 実在する単語(現代語・古語問わず)は絶対に使わない',
    excludeWords.length > 0 ? `- 特に以下の単語とは重複させない: ${excludeWords.join('、')}` : '',
    '',
    `出力は説明文なしで、単語だけのJSON配列にしてください。例: ["ういろぎ","かたそめ"]`,
  ]
    .filter(Boolean)
    .join('\n');
}

function parseWordArray(text: string): string[] {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('JSON配列が見つかりませんでした');
  const parsed: unknown = JSON.parse(match[0]);
  if (!Array.isArray(parsed) || !parsed.every((w) => typeof w === 'string')) {
    throw new Error('期待した形式(文字列の配列)ではありません');
  }
  return parsed;
}

/**
 * AI APIを呼び出して「本物っぽいが実在しない日本語の単語」をn個生成する。
 */
export async function generateFakeWords(count: number, excludeWords: string[] = []): Promise<string[]> {
  if (!anthropic) {
    console.warn('ANTHROPIC_API_KEY未設定のため、フォールバックの偽単語リストを使用します');
    return getFilteredFallbackFakeWords(count, excludeWords);
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{ role: 'user', content: buildFakePrompt(count, excludeWords) }],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') throw new Error('テキスト応答が得られませんでした');

    const words = parseWordArray(textBlock.text);
    if (words.length < count) throw new Error(`要求数(${count})に対して生成数が不足しています`);

    return words.slice(0, count);
  } catch (err) {
    console.error('generateFakeWords failed, falling back to static list:', err);
    return getFilteredFallbackFakeWords(count, excludeWords);
  }
}

function getFilteredFallbackFakeWords(count: number, excludeWords: string[]): string[] {
  const available = FALLBACK_FAKE_WORDS.filter((w) => !excludeWords.includes(w));
  const pool = available.length >= count ? available : FALLBACK_FAKE_WORDS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}


