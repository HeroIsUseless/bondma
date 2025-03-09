'use client'
import { useState, useEffect } from "react";
import { Token } from "@/jotai/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { useTranslations } from "next-intl";

// Language name mapping
const languageNames: Record<string, string> = {
    "zh-CN": "中文(简体)",
    "en-US": "英语(美国)",
    "ja-JP": "日语",
    "ko-KR": "韩语",
    "fr-FR": "法语",
    "de-DE": "德语",
    "es-ES": "西班牙语",
    "ru-RU": "俄语"
};

// Get language display name
function getLanguageDisplayName(langCode: string): string {
    return languageNames[langCode] || langCode;
}

interface TokenFormDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    isEditing: boolean;
    isLoading: boolean;
    formData: {
        key: string;
        tags: string;
        comment: string;
        translations: Record<string, string>;
    };
    languages?: string[];
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onTranslationChange: (lang: string, value: string) => void;
    onSubmit: () => void;
    onAddNew: () => void;
}

export function TokenFormDrawer({
    isOpen,
    onOpenChange,
    isEditing,
    isLoading,
    formData,
    languages = [],
    onInputChange,
    onTranslationChange,
    onSubmit,
    onAddNew
}: TokenFormDrawerProps) {
    const t = useTranslations('tokenForm');
    const projectsT = useTranslations('projects.languages');

    // Get localized language names
    const getLocalizedLanguageName = (langCode: string): string => {
        // Convert format from "zh-CN" to "zhCN" for i18n keys
        const formattedLang = langCode.replace(/-/g, '');
        return projectsT(formattedLang);
    };

    return (
        <Drawer open={isOpen} onOpenChange={onOpenChange}>
            <DrawerContent className="w-[400px] p-4 bg-white shadow-lg rounded-lg">
                <DrawerHeader>
                    <DrawerTitle className="text-lg font-semibold text-gray-900">
                        {isEditing ? t('editTitle') : t('addTitle')}
                    </DrawerTitle>
                    <DrawerDescription className="text-gray-600 text-sm">{t('description')}</DrawerDescription>
                </DrawerHeader>
                <div className="p-2 space-y-2 max-h-[60vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Key</label>
                        <Input
                            name="key"
                            value={formData.key}
                            onChange={onInputChange}
                            placeholder={t('keyPlaceholder')}
                            className="mt-1 border border-gray-300 rounded-lg p-1 text-sm"
                        />
                    </div>

                    {/* Dynamically generate input fields for each language */}
                    {languages.map((lang) => (
                        <div key={lang}>
                            <label className="block text-sm font-medium text-gray-700">
                                {getLocalizedLanguageName(lang)}
                            </label>
                            <Input
                                value={formData.translations[lang] || ''}
                                onChange={(e) => onTranslationChange(lang, e.target.value)}
                                placeholder={t('translationPlaceholder', {language: getLocalizedLanguageName(lang)})}
                                className="mt-1 border border-gray-300 rounded-lg p-1 text-sm"
                            />
                        </div>
                    ))}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('tags')}</label>
                        <Input
                            name="tags"
                            value={formData.tags}
                            onChange={onInputChange}
                            placeholder={t('tagsPlaceholder')}
                            className="mt-1 border border-gray-300 rounded-lg p-1 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('comment')}</label>
                        <Input
                            name="comment"
                            value={formData.comment}
                            onChange={onInputChange}
                            placeholder={t('commentPlaceholder')}
                            className="mt-1 border border-gray-300 rounded-lg p-1 text-sm"
                        />
                    </div>
                </div>
                <DrawerFooter className="flex justify-end space-x-2">
                    <Button
                        onClick={onSubmit}
                        disabled={isLoading}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-blue-600 text-sm"
                    >
                        {isLoading ? t('submitting') : isEditing ? t('update') : t('submit')}
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline" className="border border-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-100 text-sm">
                            {t('cancel')}
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
