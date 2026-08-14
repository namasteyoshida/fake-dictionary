import { useForm } from 'react-hook-form';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { PageLayout } from '../../components/common/PageLayout';
import { Button } from '../../components/common/Button';
import { Timer } from '../../components/common/Timer';
import { socket } from '../../socket/socket';
import { handAtom } from '../../store/game';
import type { SubmitMeaningsPayload } from '../../types/game';

type FormValues = {
  meanings: { cardId: number; meaning: string }[];
};

export function MeaningInputPage() {
  const hand = useAtomValue(handAtom);
  const fakeCards = hand.filter((c) => !c.isReal);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, getValues, formState } = useForm<FormValues>({
    defaultValues: {
      meanings: fakeCards.map((c) => ({ cardId: c.id, meaning: '' })),
    },
  });

  function onSubmit(values: FormValues) {
    const meaningsWithFallback = values.meanings.map((m) => ({
      cardId: m.cardId,
      meaning: m.meaning.trim() || '世にも珍しい古くからの言い伝えや習慣のこと',
    }));
    const payload: SubmitMeaningsPayload = { meanings: meaningsWithFallback };
    socket.emit('meaning:submit', payload);
    setSubmitted(true);
  }

  function handleTimeUp() {
    if (!submitted) {
      onSubmit(getValues());
    }
  }

  if (submitted) {
    return (
      <PageLayout title="意味入力">
        <p>相手の入力が完了するのを待っています…</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="偽物カードの意味を入力してください">
      <Timer seconds={180} onTimeUp={handleTimeUp} />

      <p>本物のカード1枚には辞書の意味が最初から入っています。偽物カード3枚には、相手を騙せそうな意味を考えて入力してください。</p>

      <form className="meaning-input__form" onSubmit={handleSubmit(onSubmit)}>
        {fakeCards.map((card, idx) => (
          <div key={card.id} className="meaning-input__row">
            <label htmlFor={`meaning-${card.id}`}>{card.word}</label>
            <input
              id={`meaning-${card.id}`}
              {...register(`meanings.${idx}.meaning`, {
                required: '意味を入力してください',
                maxLength: { value: 50, message: '50文字以内で入力してください' },
              })}
            />
            {formState.errors.meanings?.[idx]?.meaning && (
              <p className="meaning-input__error">{formState.errors.meanings[idx]?.meaning?.message}</p>
            )}
          </div>
        ))}

        <Button type="submit">入力完了</Button>
      </form>
    </PageLayout>
  );
}

