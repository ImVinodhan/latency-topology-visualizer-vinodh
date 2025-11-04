'use client';
import dynamic from 'next/dynamic';

const Globe3D = dynamic(() => import('@/components/GlobeClient'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[90vh] text-gray-400">
      Loading 3D Globe...
    </div>
  ),
});

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-900 text-white">
      <Globe3D />
    </main>
  );
}
