export const LANGUAGE_COOKIE_KEY = 'bondma_language';
export const DEFAULT_LANGUAGE = 'zh-CN';

export const setCookie = (name: string, value: string, days?: number) => {
  if (typeof document === 'undefined') return;
  
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value}${expires}; path=/`;
};

export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  
  return null;
};

export const deleteCookie = (name: string) => {
  setCookie(name, '', -1);
};

export const getUserLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const cookieLang = getCookie(LANGUAGE_COOKIE_KEY);
    if (cookieLang) return cookieLang;
    
    const browserLang = navigator.language;
    if (browserLang.startsWith('zh')) return 'zh-CN';
    if (browserLang.startsWith('en')) return 'en-US';
  }
  
  return DEFAULT_LANGUAGE;
};

export const setUserLanguage = (lang: string) => {
  setCookie(LANGUAGE_COOKIE_KEY, lang, 365);
};
