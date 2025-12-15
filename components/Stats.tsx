import React, { useMemo } from 'react';
import { Subscription } from '../types';
import { Wallet, TrendingUp, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface StatsProps {
  subscriptions: Subscription[];
  currentDate: Date;
}

export const Stats: React.FC<StatsProps> = ({ subscriptions, currentDate }) => {
  const currentDay = currentDate.getDate();
  const { t, config, dateLocale } = useLanguage();

  const stats = useMemo(() => {
    let totalCost = 0;
    let paidThisMonth = 0;
    let remainingThisMonth = 0;
    let nextPayment: Subscription | null = null;
    let minDiff = 32;

    subscriptions.forEach(sub => {
      totalCost += sub.price;

      if (sub.day < currentDay) {
        paidThisMonth += sub.price;
      } else {
        remainingThisMonth += sub.price;
        const diff = sub.day - currentDay;
        if (diff >= 0 && diff < minDiff) {
          minDiff = diff;
          nextPayment = sub;
        }
      }
    });

    return { totalCost, paidThisMonth, remainingThisMonth, nextPayment };
  }, [subscriptions, currentDay]);

  const formatMoney = (num: number) => new Intl.NumberFormat(dateLocale, { style: 'currency', currency: config.currencyCode }).format(num);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {/* Total Card - THE BLACK CARD */}
      <motion.div variants={itemVariants} className="group relative overflow-hidden bg-zinc-900 dark:bg-zinc-900 rounded-[32px] p-8 shadow-2xl shadow-zinc-900/20 dark:shadow-black/50 text-white flex flex-col justify-between h-48 sm:h-auto">
        {/* Subtle Gradient Overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none"></div>

        <div className="relative z-10 flex justify-between items-start">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/5">
            <Wallet size={24} className="text-white" />
          </div>
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/5 text-[11px] font-bold uppercase tracking-widest backdrop-blur-md">
            {currentDate.toLocaleDateString(dateLocale, { month: 'short' })}
          </span>
        </div>
        
        <div className="relative z-10 mt-6">
          <p className="text-zinc-400 font-medium text-sm mb-1">{t('stats.total')}</p>
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-white">
            {formatMoney(stats.totalCost)}
          </span>
        </div>
      </motion.div>

      {/* Remaining Card - Clean White */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 shadow-soft dark:shadow-none border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-6">
             <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-2xl text-orange-600 dark:text-orange-400">
                <TrendingUp size={24} />
             </div>
             <div className="text-right">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t('stats.remaining')}</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{formatMoney(stats.remainingThisMonth)}</p>
             </div>
        </div>
        
        <div>
          <div className="flex justify-between text-xs font-medium text-zinc-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(stats.totalCost > 0 ? (stats.paidThisMonth / stats.totalCost) * 100 : 0)}%</span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-4 rounded-full overflow-hidden">
             <motion.div 
               className="bg-zinc-900 dark:bg-white h-full rounded-full" 
               initial={{ width: 0 }}
               animate={{ width: `${stats.totalCost > 0 ? (stats.paidThisMonth / stats.totalCost) * 100 : 0}%` }}
               transition={{ duration: 1, ease: "easeOut" }}
             />
          </div>
        </div>
      </motion.div>

      {/* Next Payment Card - Clean White */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 shadow-soft dark:shadow-none border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
         <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-indigo-600 dark:text-indigo-400">
                <CreditCard size={24} />
            </div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t('stats.next_payment')}</p>
         </div>

        <div className="mt-auto">
          {stats.nextPayment ? (
            <div className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
               {stats.nextPayment.logo ? (
                  <img src={stats.nextPayment.logo} alt="" className="w-10 h-10 rounded-xl object-contain bg-white p-1" />
               ) : (
                  <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold text-zinc-500 text-xs">
                     {stats.nextPayment.name.substring(0,2)}
                  </div>
               )}
               <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-zinc-900 dark:text-white truncate pr-2">{stats.nextPayment.name}</h4>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">{formatMoney(stats.nextPayment.price)}</span>
                  </div>
                  <p className="text-xs text-zinc-500 font-medium">
                    {t('stats.on')} {stats.nextPayment.day} {currentDate.toLocaleDateString(dateLocale, { month: 'long' })}
                  </p>
               </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-400 text-sm font-medium italic">
                {t('stats.no_payment')}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};