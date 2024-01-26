'use client';

import { useState } from 'react';

import { QrReader, QrViewFinder } from '@/app/components/QrReader';

export default function Home() {
  const [read, setRead] = useState(true);

  return (
    <main className="flex h-screen w-screen items-center justify-center bg-slate-200">
      <div className="aspect-square h-auto w-2/3 md:w-2/5">
        <QrReader read={read}>
          <QrViewFinder className="border-[1.5rem] md:border-[4rem] lg:border-[6rem]" />
        </QrReader>
      </div>
    </main>
  );
}
