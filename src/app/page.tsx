'use client';

import { useState } from 'react';

import { QrReader, QrViewFinder } from '@/app/components/QrReader';
import { Result } from '@zxing/library';

export default function Home() {
  const [read, setRead] = useState(true);
  const [result, setResult] = useState<Result | undefined>()
  const [error, setError] = useState<string | undefined>()

  function onRead(res: Result) {
    setResult(res)
  }

  function onReadError(err: string) {
    setError(err)
  }

  return (
    <main className="flex h-screen w-screen items-center justify-center bg-slate-200">
      <section className='flex flex-col items-center gap-y-3'>
        <div className="aspect-square h-auto w-2/3 md:w-2/5 mb-2">
          <QrReader onRead={onRead} onReadError={onReadError} read={read}>
            <QrViewFinder className="border-[1.5rem] md:border-[4rem] lg:border-[6rem]" />
          </QrReader>
        </div>

        <p className='text-slate-950 font-medium text-xl'>Result: {result?.getText()}</p>

        <p className='text-slate-950 font-medium text-xl'>Error: {error}</p>
      </section>
    </main>
  );
}
