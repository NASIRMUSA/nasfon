import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import type { PromoSettings } from '../types';

interface CountdownTimerProps {
  promoSettings: PromoSettings;
}

export default function CountdownTimer({ promoSettings }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const endDateTimeStr = `${promoSettings.end_date}T${promoSettings.end_time || '23:59:59'}`;
      const difference = +new Date(endDateTimeStr) - +new Date();
      
      let timeLeftData = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true
      };

      if (difference > 0) {
        timeLeftData = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          isExpired: false
        };
      }

      setTimeLeft(timeLeftData);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [promoSettings]);

  if (timeLeft.isExpired || !promoSettings.is_active) return null;

  return (
    <div className="bg-[#003b8e] text-white py-3 px-4 rounded-2xl shadow-lg flex items-center justify-between animate-pulse mb-6 border border-white/20">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full">
          <Clock size={20} className="text-white" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{promoSettings.event_name || 'Limited Offer'}</p>
          <p className="text-sm font-bold">Ends in:</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <TimeUnit value={timeLeft.days} label="d" />
        <TimeUnit value={timeLeft.hours} label="h" />
        <TimeUnit value={timeLeft.minutes} label="m" />
        <TimeUnit value={timeLeft.seconds} label="s" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[32px]">
      <span className="text-lg font-black leading-none">{value.toString().padStart(2, '0')}</span>
      <span className="text-[9px] uppercase font-bold opacity-60 leading-none mt-1">{label}</span>
    </div>
  );
}
