import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function Watch() {
  const router = useRouter();
  const { id } = router.query;
  const containerRef = useRef(null);
  const [mode, setMode] = useState('director');
  const [hasTicket, setHasTicket] = useState(true); // Временно: позже заменим на проверку билета
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !id) return;

    // Загрузка Gracia 4DGS плеера
    const script = document.createElement('script');
    script.src = 'https://cdn.gracia.ai/web-sdk/latest/gracia-sdk.js';
    script.onload = () => {
      if (window.GraciaPlayer) {
        const player = new window.GraciaPlayer({
          container: containerRef.current,
          scene: mode === 'free' 
            ? `https://api.theater.com/4dgs/${id}` 
            : 'https://cdn.gracia.ai/scenes/theater_director.gs',
          width: '100%',
          height: '100%',
          controls: true,
          autoplay: true,
        });
        player.load();
        setLoading(false);
      }
    };
    document.body.appendChild(script);

    return () => {
      if (window.GraciaPlayer) {
        // Очистка плеера при размонтировании
      }
    };
  }, [id, mode]);

  if (!id) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!hasTicket) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center">
        <div className="text-6xl mb-6">🎫</div>
        <h1 className="text-3xl font-bold mb-4">Требуется билет</h1>
        <p className="text-gray-400 mb-8">Купите билет, чтобы смотреть эту трансляцию</p>
        <button 
          onClick={() => router.push(`/tickets/buy/${id}`)}
          className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-full text-lg font-semibold transition"
        >
          Купить билет — $15
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Head>
        <title>Просмотр трансляции — Театр Мира</title>
      </Head>

      {/* Навигация */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center border-b border-[#1a1a2e]">
        <Link href="/" className="text-xl font-bold">
          🎭 <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Театр Мира</span>
        </Link>
        <div className="flex gap-4 text-sm text-gray-400">
          <span>🎫 Билет активен</span>
          <span className="text-purple-400">✦ 4DGS доступен</span>
        </div>
      </div>

      {/* Плеер */}
      <div className="relative bg-black">
        <div ref={containerRef} className="w-full h-[70vh] bg-[#0a0a0f]" />
        
        {/* Управление режимами */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 bg-[#1a1a2e] p-2 rounded-full shadow-2xl">
          <button
            onClick={() => setMode('director')}
            className={`px-6 py-3 rounded-full font-semibold transition ${
              mode === 'director' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🎬 Режиссёрский
          </button>
          <button
            onClick={() => setMode('free')}
            className={`px-6 py-3 rounded-full font-semibold transition ${
              mode === 'free' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🔄 Свободный ракурс
          </button>
        </div>
      </div>

      {/* Информация о спектакле */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Спектакль</h1>
        <p className="text-gray-400">Театр</p>
        <div className="mt-4 flex gap-4 text-sm text-gray-500">
          <span>⏱ 2ч 30м</span>
          <span>🌍 Трансляция по всему миру</span>
          <span className="text-purple-400">✦ 4DGS доступен</span>
        </div>
      </div>
    </div>
  );
}
