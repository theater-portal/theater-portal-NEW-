import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Home() {
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/performances`)
      .then(res => {
        setPerformances(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Head>
        <title>Театр Мира — Live трансляции с 4DGS</title>
        <meta name="description" content="Смотрите лучшие спектакли мира в прямом эфире. Выбирайте ракурс самостоятельно." />
      </Head>

      <header className="border-b border-[#1a1a2e]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            🎭 <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Театр Мира</span>
          </Link>
          <div className="flex gap-3">
            <Link href="/auth/login" className="px-5 py-2 rounded-full border border-[#3a3a5a] hover:bg-[#1a1a2e] transition">
              Войти
            </Link>
            <Link href="/auth/register" className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 transition">
              Регистрация
            </Link>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          Театр <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">в любом ракурсе</span>
        </motion.h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">
          Выберите место в зале и смотрите лучшие спектакли мира в прямом эфире.
          На телефоне, ТВ или в браузере.
        </p>
        <Link 
          href="/performances" 
          className="px-10 py-4 bg-purple-600 hover:bg-purple-700 rounded-full text-lg font-semibold inline-block transition"
        >
          Смотреть сейчас →
        </Link>
      </section>

      <section className="container mx-auto px-4 py-16 grid md:grid-cols-3 gap-6">
        {[
          { icon: '🎬', title: 'Режиссёрский режим', desc: 'ИИ-режиссёр выбирает лучший ракурс, как в кинотеатре.' },
          { icon: '🔄', title: 'Свободный ракурс', desc: 'Вы сами выбираете точку обзора — двигайте камеру пальцем.' },
          { icon: '🌍', title: 'По всему миру', desc: 'Трансляции без задержек в любой точке планеты.' }
        ].map((f, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="bg-[#14141e] p-8 rounded-2xl border border-[#1a1a2e] text-center"
          >
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-500">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">📺 Скоро в эфире</h2>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {performances.length > 0 ? performances.map((p, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#14141e] rounded-2xl overflow-hidden border border-[#1a1a2e] hover:border-purple-500 transition cursor-pointer"
              >
                <div className="h-48 bg-gradient-to-br from-purple-900/30 to-pink-900/30 flex items-center justify-center text-6xl">
                  🎭
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold">{p.title || 'Спектакль'}</h3>
                  <p className="text-gray-500 text-sm">{p.theater_name || 'Театр'}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-purple-400 font-semibold">от ${p.price || 15}</span>
                    <Link 
                      href={`/watch/${p.id}`} 
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-sm transition"
                    >
                      Купить билет
                    </Link>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center text-gray-500 py-20">
                <p className="text-4xl mb-4">🎭</p>
                <p>Скоро здесь появятся первые спектакли</p>
                <p className="text-sm mt-2">Станьте первым театром-партнёром!</p>
              </div>
            )}
          </div>
        )}
      </section>

      <footer className="border-t border-[#1a1a2e] py-8 text-center text-gray-500 text-sm">
        <p>© 2026 Театр Мира. Все права защищены.</p>
      </footer>
    </div>
  );
}
