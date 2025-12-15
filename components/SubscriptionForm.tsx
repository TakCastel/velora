import React, { useState, useEffect, useMemo } from 'react';
import { Subscription, Category, PresetService } from '../types';
import { PRESET_SERVICES } from '../constants';
import { X, Check, Search, ChevronDown, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { ServiceLogo } from './ServiceLogo';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sub: Omit<Subscription, 'id'>) => void;
  editData?: Subscription | null;
  initialDay?: number;
  onDelete?: (id: string) => void;
}

export const SubscriptionForm: React.FC<Props> = ({ isOpen, onClose, onSave, editData, initialDay, onDelete }) => {
  const { t, country, config, getCategoryLabel } = useLanguage();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [day, setDay] = useState('1');
  const [category, setCategory] = useState<Category>(Category.OTHER);
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [domain, setDomain] = useState<string | undefined>(undefined);
  const [color, setColor] = useState('#64748b');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showPresets, setShowPresets] = useState(true);

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setName(editData.name);
        setPrice(editData.price.toString());
        setDay(editData.day.toString());
        setCategory(editData.category);
        setLogo(editData.logo);
        setDomain(editData.domain);
        setColor(editData.color);
        setShowPresets(false);
      } else {
        resetForm();
        if (initialDay) setDay(initialDay.toString());
      }
    }
  }, [isOpen, editData, initialDay]);

  const resetForm = () => {
    setName('');
    setPrice('');
    setDay(new Date().getDate().toString());
    setCategory(Category.OTHER);
    setLogo(undefined);
    setDomain(undefined);
    setColor('#64748b');
    setSearchTerm('');
    setShowPresets(true);
  };

  const handleSelectPreset = (preset: PresetService) => {
    setName(preset.name);
    if (preset.defaultPrice) setPrice(preset.defaultPrice.toString());
    setCategory(preset.category);
    setColor(preset.color);
    setLogo(preset.logo);
    setDomain(preset.domain);
    setShowPresets(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);

    const normalizedName = newName.toLowerCase().trim();
    const matchedPreset = PRESET_SERVICES.find(p => 
      normalizedName.includes(p.name.toLowerCase()) || 
      (normalizedName.length > 3 && p.name.toLowerCase().includes(normalizedName))
    );

    if (matchedPreset) {
      setLogo(matchedPreset.logo);
      setColor(matchedPreset.color);
      setCategory(matchedPreset.category);
      setDomain(matchedPreset.domain);
    } else {
      setLogo(undefined);
      setDomain(undefined); 
      if (newName.includes('.') && !newName.includes(' ')) {
        setDomain(newName);
      }
      if (color === '#64748b') setColor('#64748b'); 
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !day) return;

    onSave({
      name,
      price: parseFloat(price.replace(',', '.')),
      day: parseInt(day),
      category,
      color,
      logo,
      domain
    });
    onClose();
  };

  const handleDelete = () => {
    if (editData && onDelete) {
       const deleted = onDelete(editData.id);
       if (deleted) onClose();
    }
  };

  const groupedPresets = useMemo(() => {
    const filtered = PRESET_SERVICES.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = s.countries.includes('GLOBAL') || s.countries.includes(country);
      if (searchTerm) return matchesSearch;
      return matchesCountry;
    });

    const groups: Record<string, PresetService[]> = {};
    Object.values(Category).forEach(cat => { groups[cat] = []; });

    filtered.forEach(service => {
        if (!groups[service.category]) groups[service.category] = [];
        groups[service.category].push(service);
    });

    return groups;
  }, [searchTerm, country]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-zinc-900/60 backdrop-blur-sm"
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-zinc-950 rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] pointer-events-auto border border-zinc-200 dark:border-zinc-800"
            >
              <div className="p-6 pb-2 flex justify-between items-center bg-white dark:bg-zinc-950 z-40">
                <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  {editData ? t('form.edit_title') : t('form.add_title')}
                </h2>
                <button onClick={onClose} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                    <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto px-6 pb-6 scroll-smooth custom-scrollbar relative">
                {showPresets && !editData ? (
                  <div className="space-y-6 pt-4">
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder={`${t('form.search_placeholder')}...`}
                        className="w-full pl-12 pr-4 py-4 bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl focus:ring-0 focus:bg-zinc-200 dark:focus:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 font-semibold transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                      />
                      <Search className="absolute left-4 top-4 text-zinc-400" size={20} />
                    </div>

                    <div className="space-y-8">
                       <button
                          onClick={() => {
                              setName(searchTerm);
                              setShowPresets(false);
                          }}
                          className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-zinc-500 dark:text-zinc-400 text-sm font-bold"
                        >
                          <span>{t('form.not_in_list')}</span>
                          <span className="text-indigo-600 dark:text-indigo-400">{t('form.create_manual')}</span>
                        </button>

                      {Object.entries(groupedPresets).map(([catName, services]: [string, PresetService[]]) => {
                          if (services.length === 0) return null;
                          return (
                              <div key={catName}>
                                  <h3 className="sticky top-0 bg-white dark:bg-zinc-950 py-2 mb-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest z-30">
                                      {getCategoryLabel(catName as Category)}
                                  </h3>
                                  <div className="grid grid-cols-3 gap-3">
                                      {services.map((service, idx) => (
                                          <motion.button
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.02 }}
                                            key={service.id}
                                            onClick={() => handleSelectPreset(service)}
                                            className="flex flex-col items-center p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 hover:bg-white dark:hover:bg-black border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-none transition-all group text-center h-32 justify-center"
                                          >
                                            <div className="w-12 h-12 mb-3 rounded-xl overflow-hidden bg-white shadow-sm p-2 group-hover:scale-110 transition-transform">
                                              <ServiceLogo 
                                                name={service.name} 
                                                logo={service.logo}
                                                domain={service.domain}
                                                color={service.color}
                                                className="w-full h-full object-contain"
                                              />
                                            </div>
                                            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 line-clamp-1 w-full">{service.name}</span>
                                            {service.defaultPrice && (
                                              <span className="text-[10px] text-zinc-400 font-bold mt-1">
                                                {service.defaultPrice}{config.currency}
                                              </span>
                                            )}
                                          </motion.button>
                                      ))}
                                  </div>
                              </div>
                          );
                      })}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSave} className="space-y-6 pt-4">
                    
                    <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-3xl">
                       <div className="w-16 h-16 rounded-2xl bg-white shadow-sm p-3 flex-shrink-0">
                           <ServiceLogo 
                                name={name} 
                                logo={logo} 
                                domain={domain}
                                color={color}
                                className="w-full h-full object-contain"
                           />
                       </div>
                       <div className="flex-1 overflow-hidden">
                           <h3 className="font-extrabold text-xl text-zinc-900 dark:text-white truncate">{name || 'Nouveau service'}</h3>
                           {!editData && (
                              <button 
                                  type="button" 
                                  onClick={() => setShowPresets(true)} 
                                  className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 mt-1"
                              >
                                  <Search size={12} />
                                  {t('form.change_service')}
                              </button>
                           )}
                       </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">{t('form.name_label')}</label>
                        <input
                            type="text"
                            required
                            className="w-full px-5 py-4 bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl focus:ring-0 focus:bg-zinc-200 dark:focus:bg-zinc-800 text-zinc-900 dark:text-white font-bold transition-all"
                            value={name}
                            onChange={handleNameChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">{t('form.price_label')}</label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.01"
                                required
                                placeholder="0.00"
                                className="w-full pl-5 pr-8 py-4 bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl focus:ring-0 focus:bg-zinc-200 dark:focus:bg-zinc-800 text-zinc-900 dark:text-white font-mono font-bold text-lg transition-all"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            <span className="absolute right-5 top-5 text-zinc-400 font-bold">{config.currency}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">{t('form.day_label')}</label>
                        <input
                          type="number"
                          min="1"
                          max="31"
                          required
                          className="w-full px-5 py-4 bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl focus:ring-0 focus:bg-zinc-200 dark:focus:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-lg transition-all"
                          value={day}
                          onChange={(e) => setDay(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">{t('form.category_label')}</label>
                      <div className="relative">
                        <select
                            className="w-full px-5 py-4 bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl focus:ring-0 focus:bg-zinc-200 dark:focus:bg-zinc-800 text-zinc-900 dark:text-white font-bold appearance-none cursor-pointer transition-all"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as Category)}
                        >
                            {Object.values(Category).map((cat) => (
                            <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-5 top-5 text-zinc-400 pointer-events-none" size={18} />
                      </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                      {editData && onDelete && (
                        <button 
                          type="button"
                          onClick={handleDelete}
                          className="px-5 py-4 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 rounded-2xl font-bold transition-all active:scale-95"
                        >
                          <Trash2 size={24} />
                        </button>
                      )}
                      <button 
                        type="submit"
                        className="flex-1 py-4 bg-zinc-900 dark:bg-white hover:bg-black dark:hover:bg-zinc-200 text-white dark:text-black rounded-2xl font-extrabold text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-zinc-900/20 active:scale-[0.98]"
                      >
                        <Check size={20} strokeWidth={3} />
                        {editData ? t('form.save') : t('form.add')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};