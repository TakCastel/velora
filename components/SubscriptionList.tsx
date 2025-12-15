import React from 'react';
import { Subscription } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { Trash2, Edit2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { ServiceLogo } from './ServiceLogo';

interface Props {
  subscriptions: Subscription[];
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
}

export const SubscriptionList: React.FC<Props> = ({ subscriptions, onEdit, onDelete }) => {
  const { t, config, getCategoryLabel, dateLocale } = useLanguage();
  
  const sortedSubs = [...subscriptions].sort((a, b) => a.day - b.day);
  const formatMoney = (num: number) => new Intl.NumberFormat(dateLocale, { style: 'currency', currency: config.currencyCode }).format(num);

  return (
    <div className="sticky top-24">
      <div className="flex justify-between items-baseline mb-6 px-2">
          <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">{t('list.title')}</h3>
          <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-500">{subscriptions.length}</span>
      </div>
      
      <div className="bg-white dark:bg-zinc-900 rounded-[32px] shadow-soft dark:shadow-none border border-zinc-100 dark:border-zinc-800 overflow-hidden">
        {sortedSubs.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-full mx-auto mb-4 flex items-center justify-center text-zinc-300">
                <Edit2 size={24} />
            </div>
            <p className="text-zinc-900 dark:text-white font-bold mb-1">{t('list.empty_title')}</p>
            <p className="text-zinc-500 text-sm">{t('list.empty_desc')}</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
            <AnimatePresence>
              {sortedSubs.map((sub, i) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={sub.id} 
                  className="group flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-black transition-colors cursor-pointer" 
                  onClick={() => onEdit(sub)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white shadow-sm border border-zinc-100 dark:border-zinc-800 p-2 flex-shrink-0">
                        <ServiceLogo 
                          name={sub.name} 
                          logo={sub.logo} 
                          domain={sub.domain}
                          color={sub.color} 
                          className="w-full h-full object-contain"
                        />
                    </div>
                    
                    <div className="min-w-0">
                      <h4 className="font-bold text-zinc-900 dark:text-white text-sm truncate">{sub.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-medium text-zinc-400">{t('list.on')} {sub.day}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${CATEGORY_COLORS[sub.category] || 'bg-zinc-100 text-zinc-500'}`}>
                          {getCategoryLabel(sub.category)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-zinc-900 dark:text-white text-sm">
                      {formatMoney(sub.price)}
                    </span>
                    <ChevronRight size={16} className="text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};