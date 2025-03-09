"use client";

import { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getUserLanguage } from "@/lib/cookies";
import enUS from "@/i18n/en-US.json";
import zhCN from "@/i18n/zh-CN.json";

// 消息映射
const messages: Record<string, any> = {
  "en-US": enUS,
  "zh-CN": zhCN,
};

export function I18nClientProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<string>("zh-CN");
  
  useEffect(() => {
    // 从 Cookie 中获取语言设置
    const userLang = getUserLanguage();
    setLocale(userLang);
    
    // 当 cookie 变化时重新加载页面
    const handleStorageChange = () => {
      const newLang = getUserLanguage();
      if (newLang !== locale) {
        window.location.reload();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale]}>
      {children}
    </NextIntlClientProvider>
  );
}
