import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight, Moon, Sun, ChevronDown } from 'lucide-react';

// Components & Types
import { Calendar } from './components/Calendar';
import { Stats } from './components/Stats';
import { SubscriptionForm } from './components/SubscriptionForm';
import { SubscriptionList } from './components/SubscriptionList';
import { Subscription, CountryCode } from './types';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { COUNTRIES } from './constants';

// Date Helpers
const addMonths = (date: Date, amount: number) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + amount);
  return d;
};
const subMonths = (date: Date, amount: number) => addMonths(date, -amount);

// Helper pour les drapeaux
const getFlagUrl = (code: CountryCode | string) => {
  const isoCode = code === 'UK' ? 'gb' : code.toLowerCase();
  return `https://flagcdn.com/w40/${isoCode}.png`;
};

const AppContent = () => {
  const { country, setCountry, config, dateLocale } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Initialisation paresseuse avec migration des données
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    try {
      // MIGRATION: Check old key first
      const oldData = localStorage.getItem('subcal_data');
      if (oldData) {
        console.log("Migrating data to Velora...");
        localStorage.setItem('velora_data', oldData);
        localStorage.removeItem('subcal_data');
        return JSON.parse(oldData);
      }

      const saved = localStorage.getItem('velora_data');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse subscriptions", e);
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [initialDay, setInitialDay] = useState<number | undefined>(undefined);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // MIGRATION: Check old theme
    const oldTheme = localStorage.getItem('subcal_theme') as 'light' | 'dark';
    if (oldTheme) {
        localStorage.setItem('velora_theme', oldTheme);
        localStorage.removeItem('subcal_theme');
        return oldTheme;
    }

    const savedTheme = localStorage.getItem('velora_theme') as 'light' | 'dark';
    if (savedTheme) return savedTheme;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  const [showCountryMenu, setShowCountryMenu] = useState(false);

  useEffect(() => {
    localStorage.setItem('velora_data', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('velora_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleAddSubscription = (data: Omit<Subscription, 'id'>) => {
    if (editingSub) {
      setSubscriptions(prev => prev.map(s => s.id === editingSub.id ? { ...data, id: editingSub.id } : s));
    } else {
      const newSub: Subscription = {
        ...data,
        id: crypto.randomUUID()
      };
      setSubscriptions(prev => [...prev, newSub]);
    }
    setEditingSub(null);
  };

  const handleMoveSubscription = (id: string, newDay: number) => {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, day: newDay } : s));
  };

  const handleDeleteSubscription = (id: string) => {
    if (window.confirm("Supprimer cet abonnement ?")) {
      setSubscriptions(prev => prev.filter(s => s.id !== id));
      return true;
    }
    return false;
  };

  const openEdit = (sub: Subscription) => {
    setEditingSub(sub);
    setInitialDay(undefined);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingSub(null);
    setInitialDay(undefined);
    setIsModalOpen(true);
  };

  const openAddFromCalendar = (day: number) => {
    setEditingSub(null);
    setInitialDay(day);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen pb-24 transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header Minimaliste */}
      <header className="pt-6 pb-2 sticky top-0 z-30 bg-zinc-50/80 dark:bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-black font-extrabold text-xl shadow-lg shadow-black/10 dark:shadow-white/10 group cursor-default">
                <span className="group-hover:scale-110 transition-transform duration-300">V.</span>
              </div>
              <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight hidden sm:block">Velora</h1>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 bg-white dark:bg-zinc-900 p-1.5 rounded-full shadow-sm border border-zinc-200 dark:border-zinc-800">
              {/* Country Selector */}
              <div className="relative">
                <button 
                  onClick={() => setShowCountryMenu(!showCountryMenu)}
                  className="flex items-center gap-2 pl-2 pr-2 py-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group"
                >
                  <img 
                    src={getFlagUrl(config.code)} 
                    alt={config.name}
                    className="w-5 h-5 object-cover rounded-full ring-2 ring-white dark:ring-zinc-800"
                  />
                  <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300 hidden sm:block">{config.code}</span>
                  <ChevronDown size={14} className="text-zinc-400" />
                </button>
                
                {showCountryMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowCountryMenu(false)} />
                    <div className="absolute right-0 top-full mt-4 w-64 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl shadow-zinc-400/20 dark:shadow-black/50 border border-zinc-100 dark:border-zinc-800 py-3 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-5 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-2">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Select Region</span>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto scroll-smooth custom-scrollbar px-2">
                        {COUNTRIES.map(c => (
                        <button
                            key={c.code}
                            onClick={() => {
                              setCountry(c.code);
                              setShowCountryMenu(false);
                            }}
                            className={`w-full text-left px-3 py-3 rounded-2xl flex items-center gap-3 transition-all ${country === c.code ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                        >
                            <img 
                                src={getFlagUrl(c.code)} 
                                alt={c.name}
                                className="w-8 h-8 object-cover rounded-full shadow-sm"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm font-bold truncate ${country === c.code ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`}>
                                        {c.name}
                                    </span>
                                </div>
                                <span className="text-xs text-zinc-400 font-medium">
                                    {c.currency} · {c.currencyCode}
                                </span>
                            </div>
                        </button>
                        ))}
                        </div>
                    </div>
                  </>
                )}
              </div>

              <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700"></div>

              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              <button 
                onClick={openAdd}
                className="bg-zinc-900 dark:bg-white hover:bg-black dark:hover:bg-zinc-200 text-white dark:text-zinc-900 w-9 h-9 sm:w-auto sm:px-4 sm:py-2 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-zinc-900/10 active:scale-95"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
             <h2 className="text-4xl font-extrabold text-zinc-900 dark:text-white capitalize tracking-tighter">
                {currentDate.toLocaleDateString(dateLocale, { month: 'long' })}
            </h2>
            <span className="text-zinc-400 dark:text-zinc-500 font-medium text-lg">
                {currentDate.toLocaleDateString(dateLocale, { year: 'numeric' })}
            </span>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-center bg-white dark:bg-zinc-900 rounded-full p-1.5 shadow-sm border border-zinc-200 dark:border-zinc-800">
            <button 
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-bold w-24 text-center text-zinc-900 dark:text-white">
                {currentDate.toLocaleDateString(dateLocale, { month: 'short' })}
            </span>
            <button 
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <Stats subscriptions={subscriptions} currentDate={currentDate} />

        <div className="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Calendar 
              currentDate={currentDate} 
              subscriptions={subscriptions}
              onEdit={openEdit}
              onAdd={openAddFromCalendar}
              onMoveSubscription={handleMoveSubscription}
            />
          </div>
          <div className="lg:col-span-1">
            <SubscriptionList 
              subscriptions={subscriptions} 
              onEdit={openEdit}
              onDelete={handleDeleteSubscription}
            />
          </div>
        </div>
      </main>

      <SubscriptionForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddSubscription}
        editData={editingSub}
        initialDay={initialDay}
        onDelete={handleDeleteSubscription}
      />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;