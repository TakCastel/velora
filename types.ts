export interface Subscription {
  id: string;
  name: string;
  price: number;
  day: number; // 1-31
  category: Category;
  color: string;
  logo?: string;
  domain?: string; // Pour récupérer le logo officiel via clearbit/google
  description?: string;
  currency?: string;
}

export enum Category {
  ENTERTAINMENT = 'Divertissement',
  UTILITIES = 'Factures',
  WORK = 'Pro & Tech',
  HEALTH = 'Santé',
  TRANSPORT = 'Transport',
  FOOD = 'Alimentation',
  OTHER = 'Autre'
}

export type CountryCode = 'FR' | 'US' | 'UK' | 'DE' | 'ES' | 'IT' | 'GLOBAL';

export interface PresetService {
  id: string;
  name: string;
  color: string;
  category: Category;
  defaultPrice?: number;
  logo: string;
  countries: CountryCode[]; // Available in these countries
  domain?: string;
}

export interface CountryConfig {
  code: CountryCode;
  name: string;
  flag: string;
  currency: string; // Symbol (e.g. €)
  currencyCode: string; // ISO 4217 Code (e.g. EUR)
}