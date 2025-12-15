import { Category, PresetService, CountryCode, CountryConfig } from './types';

// Helpers
// Utilisation de Simple Icons CDN pour des SVG de haute qualité
const getIcon = (slug: string, color: string) => `https://cdn.simpleicons.org/${slug}/${color.replace('#', '')}`;

export const COUNTRIES: CountryConfig[] = [
  { code: 'FR', name: 'France', flag: '🇫🇷', currency: '€', currencyCode: 'EUR' },
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: '$', currencyCode: 'USD' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', currency: '£', currencyCode: 'GBP' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', currency: '€', currencyCode: 'EUR' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', currency: '€', currencyCode: 'EUR' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', currency: '€', currencyCode: 'EUR' },
];

// Helper to create services easily
const createService = (
  id: string, 
  name: string, 
  domain: string | null, 
  color: string, 
  category: Category, 
  countries: CountryCode[] = ['GLOBAL'],
  price?: number,
  iconSlug?: string // Slug pour Simple Icons
): PresetService => {
  
  let logoUrl = '';
  // Priorité absolue au SVG officiel de Simple Icons si le slug est fourni
  if (iconSlug) {
    logoUrl = getIcon(iconSlug, color);
  } else if (domain) {
    // Si pas d'icone SVG connue, on laisse vide, le composant ServiceLogo utilisera le domaine pour chercher
    // On ne met PAS d'URL par défaut ici pour laisser la logique "smart" du composant faire le travail
    logoUrl = '';
  }

  return {
    id,
    name,
    color,
    category,
    defaultPrice: price,
    logo: logoUrl,
    countries,
    domain: domain || undefined
  };
};

// Huge list of services with verified domains/slugs
const servicesList: PresetService[] = [
  // --- GLOBAL / ENTERTAINMENT ---
  createService('netflix', 'Netflix', 'netflix.com', '#E50914', Category.ENTERTAINMENT, ['GLOBAL'], 13.49, 'netflix'),
  createService('spotify', 'Spotify', 'spotify.com', '#1DB954', Category.ENTERTAINMENT, ['GLOBAL'], 10.99, 'spotify'),
  createService('disney', 'Disney+', 'disneyplus.com', '#113CCF', Category.ENTERTAINMENT, ['GLOBAL'], 8.99, 'disneyplus'),
  createService('prime', 'Amazon Prime', 'amazon.com', '#00A8E1', Category.ENTERTAINMENT, ['GLOBAL'], 6.99, 'amazon'),
  createService('youtube', 'YouTube Premium', 'youtube.com', '#FF0000', Category.ENTERTAINMENT, ['GLOBAL'], 12.99, 'youtube'),
  createService('applemusic', 'Apple Music', 'apple.com', '#FA243C', Category.ENTERTAINMENT, ['GLOBAL'], 10.99, 'apple'),
  createService('twitch', 'Twitch', 'twitch.tv', '#9146FF', Category.ENTERTAINMENT, ['GLOBAL'], 4.99, 'twitch'),
  createService('audible', 'Audible', 'audible.com', '#F8991C', Category.ENTERTAINMENT, ['GLOBAL'], 9.95, 'audible'),
  createService('crunchyroll', 'Crunchyroll', 'crunchyroll.com', '#F47521', Category.ENTERTAINMENT, ['GLOBAL'], 4.99, 'crunchyroll'),
  createService('soundcloud', 'SoundCloud', 'soundcloud.com', '#FF5500', Category.ENTERTAINMENT, ['GLOBAL'], 9.99, 'soundcloud'),
  createService('deezer', 'Deezer', 'deezer.com', '#A238FF', Category.ENTERTAINMENT, ['GLOBAL'], 11.99, 'deezer'),

  // --- GLOBAL / TECH & PRO ---
  createService('chatgpt', 'ChatGPT Plus', 'openai.com', '#10A37F', Category.WORK, ['GLOBAL'], 22.00, 'openai'),
  createService('googleone', 'Google One', 'google.com', '#4285F4', Category.WORK, ['GLOBAL'], 1.99, 'google'),
  createService('icloud', 'iCloud+', 'icloud.com', '#007AFF', Category.WORK, ['GLOBAL'], 0.99, 'icloud'),
  createService('adobe', 'Adobe CC', 'adobe.com', '#FF0000', Category.WORK, ['GLOBAL'], 24.99, 'adobe'),
  createService('dropbox', 'Dropbox', 'dropbox.com', '#0061FF', Category.WORK, ['GLOBAL'], 11.99, 'dropbox'),
  createService('office365', 'Microsoft 365', 'office.com', '#EA3E23', Category.WORK, ['GLOBAL'], 7.00, 'microsoft365'),
  createService('linkedin', 'LinkedIn Premium', 'linkedin.com', '#0A66C2', Category.WORK, ['GLOBAL'], 34.99, 'linkedin'),
  createService('github', 'GitHub Copilot', 'github.com', '#181717', Category.WORK, ['GLOBAL'], 10.00, 'github'),
  createService('midjourney', 'Midjourney', 'midjourney.com', '#FFFFFF', Category.WORK, ['GLOBAL'], 10.00, 'midjourney'),
  createService('notion', 'Notion', 'notion.so', '#000000', Category.WORK, ['GLOBAL'], 8.00, 'notion'),
  createService('slack', 'Slack', 'slack.com', '#4A154B', Category.WORK, ['GLOBAL'], 6.00, 'slack'),
  createService('zoom', 'Zoom', 'zoom.us', '#2D8CFF', Category.WORK, ['GLOBAL'], 14.99, 'zoom'),
  createService('canva', 'Canva', 'canva.com', '#00C4CC', Category.WORK, ['GLOBAL'], 11.99, 'canva'),
  createService('capcut', 'CapCut', 'capcut.com', '#000000', Category.WORK, ['GLOBAL'], 9.99, 'capcut'),

  // --- GLOBAL / HEALTH ---
  createService('strava', 'Strava', 'strava.com', '#FC4C02', Category.HEALTH, ['GLOBAL'], 9.99, 'strava'),

  // --- FRANCE ---
  createService('canal', 'Canal+', 'canalplus.com', '#000000', Category.ENTERTAINMENT, ['FR'], 22.99, 'canalplus'),
  createService('edf', 'EDF', 'edf.fr', '#005C94', Category.UTILITIES, ['FR'], 80.00, 'edf'),
  createService('free', 'Free', 'free.fr', '#BF002D', Category.UTILITIES, ['FR'], 19.99, 'free'),
  createService('orange', 'Orange', 'orange.fr', '#FF7900', Category.UTILITIES, ['FR'], 39.99, 'orange'),
  createService('navigo', 'Navigo', 'iledefrance-mobilites.fr', '#14929A', Category.TRANSPORT, ['FR'], 86.40), // Pas de slug
  createService('sncf', 'SNCF Max', 'sncf-connect.com', '#882F86', Category.TRANSPORT, ['FR'], 79.00, 'sncf'),
  createService('bouygues', 'Bouygues', 'bouyguestelecom.fr', '#009FD9', Category.UTILITIES, ['FR'], 32.99, 'bouyguestelecom'),
  createService('sfr', 'SFR', 'sfr.fr', '#E2001A', Category.UTILITIES, ['FR'], 34.99, 'sfr'),
  createService('total', 'TotalEnergies', 'totalenergies.fr', '#ED0000', Category.UTILITIES, ['FR'], 70.00, 'totalenergies'),
  createService('basicfit', 'Basic-Fit', 'basic-fit.com', '#FF4E00', Category.HEALTH, ['FR', 'ES', 'DE'], 19.99), // Pas de slug simple
  createService('alan', 'Alan', 'alan.com', '#D4E2CD', Category.HEALTH, ['FR'], 50.00),
  createService('doctolib', 'Doctolib', 'doctolib.fr', '#0596DE', Category.HEALTH, ['FR', 'DE', 'IT'], 0, 'doctolib'),
  createService('lemnonde', 'Le Monde', 'lemonde.fr', '#000000', Category.WORK, ['FR'], 9.99, 'lemonde'),
  createService('mediapart', 'Mediapart', 'mediapart.fr', '#D21419', Category.WORK, ['FR'], 11.00),

  // --- USA ---
  createService('hulu', 'Hulu', 'hulu.com', '#1CE783', Category.ENTERTAINMENT, ['US'], 7.99, 'hulu'),
  createService('hbo', 'Max (HBO)', 'max.com', '#002BE7', Category.ENTERTAINMENT, ['US', 'ES'], 9.99, 'hbo'),
  createService('peacock', 'Peacock', 'peacocktv.com', '#000000', Category.ENTERTAINMENT, ['US'], 5.99, 'peacock'),
  createService('verizon', 'Verizon', 'verizon.com', '#CD040B', Category.UTILITIES, ['US'], 70.00, 'verizon'),
  createService('att', 'AT&T', 'att.com', '#00A8E0', Category.UTILITIES, ['US'], 65.00, 'att'),
  createService('tmobile', 'T-Mobile', 't-mobile.com', '#EA0A8E', Category.UTILITIES, ['US', 'DE'], 60.00, 'tmobile'),
  createService('comcast', 'Xfinity', 'xfinity.com', '#782F89', Category.UTILITIES, ['US'], 80.00, 'xfinity'),
  createService('planetfitness', 'Planet Fitness', 'planetfitness.com', '#7C2887', Category.HEALTH, ['US'], 10.00),
  createService('wallstreetjournal', 'WSJ', 'wsj.com', '#000000', Category.WORK, ['US', 'UK', 'GLOBAL'], 20.00),
  createService('nytimes', 'NY Times', 'nytimes.com', '#000000', Category.WORK, ['US', 'GLOBAL'], 15.00, 'newyorktimes'),
  createService('costco', 'Costco', 'costco.com', '#0060A9', Category.FOOD, ['US'], 5.00, 'costco'),

  // --- UK ---
  createService('sky', 'Sky TV', 'sky.com', '#E25624', Category.ENTERTAINMENT, ['UK'], 26.00, 'sky'),
  createService('bbc', 'TV Licence', 'tvlicensing.co.uk', '#000000', Category.UTILITIES, ['UK'], 13.25, 'bbc'),
  createService('bt', 'BT Broadband', 'bt.com', '#5514B4', Category.UTILITIES, ['UK'], 30.99, 'bt'),
  createService('ee', 'EE', 'ee.co.uk', '#007B85', Category.UTILITIES, ['UK'], 25.00, 'ee'),
  createService('vodafone', 'Vodafone', 'vodafone.co.uk', '#E60000', Category.UTILITIES, ['UK', 'DE', 'ES', 'IT'], 22.00, 'vodafone'),
  createService('britishgas', 'British Gas', 'britishgas.co.uk', '#0099FF', Category.UTILITIES, ['UK'], 100.00, 'britishgas'),
  createService('tesco', 'Tesco Clubcard', 'tesco.com', '#00539F', Category.FOOD, ['UK'], 7.99, 'tesco'),
  createService('pret', 'Pret Subscription', 'pret.co.uk', '#890C2C', Category.FOOD, ['UK'], 30.00, 'pretamanger'),
  createService('sainsburys', 'Sainsburys', 'sainsburys.co.uk', '#F06C00', Category.FOOD, ['UK'], 5.00),

  // --- GERMANY (DE) ---
  createService('telekom', 'Telekom', 'telekom.de', '#E20074', Category.UTILITIES, ['DE'], 39.95, 'deutschetelekom'),
  createService('o2', 'O2', 'o2online.de', '#0019A5', Category.UTILITIES, ['DE', 'UK'], 29.99, 'o2'),
  createService('sky_de', 'Sky DE', 'sky.de', '#E25624', Category.ENTERTAINMENT, ['DE'], 25.00, 'sky'),
  createService('ard', 'Rundfunkbeitrag', 'rundfunkbeitrag.de', '#004772', Category.UTILITIES, ['DE'], 18.36, 'ard'),
  createService('db', 'Deutsche Bahn 25', 'bahn.de', '#F00000', Category.TRANSPORT, ['DE'], 5.00, 'deutschebahn'),
  createService('mcfit', 'McFit', 'mcfit.com', '#FFCC00', Category.HEALTH, ['DE', 'IT', 'ES'], 24.90),
  createService('rtl', 'RTL+', 'rtl.de', '#0065AF', Category.ENTERTAINMENT, ['DE'], 6.99, 'rtl'),

  // --- SPAIN (ES) ---
  createService('movistar', 'Movistar', 'movistar.es', '#003668', Category.UTILITIES, ['ES'], 50.00, 'movistar'),
  createService('renfe', 'Renfe', 'renfe.com', '#682860', Category.TRANSPORT, ['ES'], 30.00, 'renfe'),
  createService('iberdrola', 'Iberdrola', 'iberdrola.es', '#369335', Category.UTILITIES, ['ES'], 60.00, 'iberdrola'),
  createService('filmin', 'Filmin', 'filmin.es', '#1B9C5F', Category.ENTERTAINMENT, ['ES'], 7.99),
  createService('glovo', 'Glovo Prime', 'glovoapp.com', '#FFC244', Category.FOOD, ['ES', 'IT'], 5.99, 'glovo'),

  // --- ITALY (IT) ---
  createService('tim', 'TIM', 'tim.it', '#004287', Category.UTILITIES, ['IT'], 29.90),
  createService('enel', 'Enel Energia', 'enel.it', '#E20078', Category.UTILITIES, ['IT'], 70.00),
  createService('dazn', 'DAZN', 'dazn.com', '#F5EB11', Category.ENTERTAINMENT, ['IT', 'DE', 'ES'], 29.99, 'dazn'),
  createService('mediaset', 'Mediaset Infinity', 'mediasetinfinity.mediaset.it', '#005CA9', Category.ENTERTAINMENT, ['IT'], 7.99),
  createService('sky_it', 'Sky Italia', 'sky.it', '#E25624', Category.ENTERTAINMENT, ['IT'], 24.90, 'sky'),
];

// Convert list to record for easier lookup if needed, but for search array is better
export const PRESET_SERVICES = servicesList;

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.ENTERTAINMENT]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  [Category.UTILITIES]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  [Category.WORK]: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  [Category.HEALTH]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  [Category.TRANSPORT]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  [Category.FOOD]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  [Category.OTHER]: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};