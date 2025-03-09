"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { Check, Globe } from "lucide-react";
import { LANGUAGE_COOKIE_KEY, getUserLanguage, setUserLanguage } from "@/lib/cookies";

// 支持的语言列表
const languages = [
  { locale: "zh-CN", label: "中文" },
  { locale: "en-US", label: "English" },
];

export function LanguageSelector() {
  const t = useTranslations();
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState("");
  
  // 获取当前语言
  useEffect(() => {
    setCurrentLanguage(getUserLanguage());
  }, []);

  // 切换语言
  const handleLanguageChange = (locale: string) => {
    setUserLanguage(locale);
    setCurrentLanguage(locale);
    // 重新加载页面以应用新语言
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2 h-9">
          <Globe className="h-4 w-4" />
          <span>{t('language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.locale}
            onClick={() => handleLanguageChange(lang.locale)}
          >
            <span>{lang.label}</span>
            {currentLanguage === lang.locale && (
              <Check className="ml-2 h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
