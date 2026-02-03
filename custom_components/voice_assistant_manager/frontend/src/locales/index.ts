/**
 * Localization system for Voice Manager
 */
import { en } from './en';
import { it } from './it';

const translations: Record<string, Record<string, string>> = { en, it };

export type TranslateFunction = (key: string) => string;

/**
 * Create a translator function for the given language
 */
export function createTranslator(language: string | undefined): TranslateFunction {
  const lang = language?.substring(0, 2) || 'en';
  const dict = translations[lang] || translations.en;
  
  return (key: string): string => {
    return dict[key] || translations.en[key] || key;
  };
}

export { en, it };
