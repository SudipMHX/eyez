"use client";

import { useEffect, useState } from "react";

export default function ComingSoon() {
  const calculateTimeLeft = () => {
    const difference = +new Date("2025-12-31T23:59:59") - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4 text-center'>
      <h1 className='text-4xl md:text-6xl font-bold mb-4'>Coming Soon</h1>
      <p className='mb-8 text-lg md:text-xl text-gray-400'>
        We&apos;re working hard to finish the development of this site.
      </p>

      <div className='flex space-x-4 text-2xl md:text-4xl font-mono'>
        <TimeBox label='Days' value={timeLeft.days} />
        <TimeBox label='Hours' value={timeLeft.hours} />
        <TimeBox label='Minutes' value={timeLeft.minutes} />
        <TimeBox label='Seconds' value={timeLeft.seconds} />
      </div>

      <p className='mt-10 text-sm text-gray-500'>Stay tuned. Launching soon!</p>
    </div>
  );
}

function TimeBox({ label, value }) {
  return (
    <div className='flex flex-col items-center'>
      <div className='bg-white text-black rounded-lg px-4 py-2 min-w-[70px]'>
        {value !== undefined ? String(value).padStart(2, "0") : "00"}
      </div>
      <span className='mt-2 text-sm text-gray-400'>{label}</span>
    </div>
  );
}
