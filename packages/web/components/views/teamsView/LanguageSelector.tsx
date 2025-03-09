import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface LanguageSelectorProps {
  selectedLanguages: string[];
  onChange: (languages: string[]) => void;
}

export function LanguageSelector({ selectedLanguages, onChange }: LanguageSelectorProps) {
  const t = useTranslations();
  const [customLanguage, setCustomLanguage] = useState("");

  const commonLanguages = [
    { id: "zh-CN", nameKey: "projects.languages.zhCN" },
    { id: "en-US", nameKey: "projects.languages.enUS" },
    { id: "ja-JP", nameKey: "projects.languages.jaJP" },
    { id: "ko-KR", nameKey: "projects.languages.koKR" },
    { id: "fr-FR", nameKey: "projects.languages.frFR" },
    { id: "de-DE", nameKey: "projects.languages.deDE" },
    { id: "es-ES", nameKey: "projects.languages.esES" },
    { id: "ru-RU", nameKey: "projects.languages.ruRU" },
  ];

  const handleLanguageChange = (language: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedLanguages, language]);
    } else {
      onChange(selectedLanguages.filter((lang) => lang !== language));
    }
  };

  const addCustomLanguage = () => {
    if (customLanguage && !selectedLanguages.includes(customLanguage)) {
      onChange([...selectedLanguages, customLanguage]);
      setCustomLanguage("");
    }
  };

  const removeLanguage = (language: string) => {
    onChange(selectedLanguages.filter((lang) => lang !== language));
  };

  const getLocalizedLanguageName = (langId: string) => {
    const lang = commonLanguages.find(lang => lang.id === langId);
    return lang ? t(lang.nameKey) : langId;
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1 mt-2">
        {selectedLanguages.map((lang) => (
          <Badge key={lang} variant="secondary" className="gap-1">
            {getLocalizedLanguageName(lang)}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => removeLanguage(lang)}
            />
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        {commonLanguages.map((lang) => (
          <div key={lang.id} className="flex items-center space-x-2">
            <Checkbox
              id={`lang-${lang.id}`}
              checked={selectedLanguages.includes(lang.id)}
              onCheckedChange={(checked) => 
                handleLanguageChange(lang.id, checked === true)
              }
            />
            <Label htmlFor={`lang-${lang.id}`} className="text-sm">
              {t(lang.nameKey)}
            </Label>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2 mt-2">
        <Input
          placeholder={t("projects.create.customLanguagePlaceholder")}
          value={customLanguage}
          onChange={(e) => setCustomLanguage(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCustomLanguage();
            }
          }}
        />
        <Button 
          type="button" 
          size="sm" 
          onClick={addCustomLanguage}
        >
          {t("common.add")}
        </Button>
      </div>
    </div>
  );
}
