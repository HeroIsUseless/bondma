'use client'
import React from "react";
import { Token } from "@/jotai/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";

// Common languages list
const commonLanguages = [
    { id: "zh-CN", name: "Chinese (Simplified)" },
    { id: "en-US", name: "English (US)" },
    { id: "ja-JP", name: "Japanese" },
    { id: "ko-KR", name: "Korean" },
    { id: "fr-FR", name: "French" },
    { id: "de-DE", name: "German" },
    { id: "es-ES", name: "Spanish" },
    { id: "ru-RU", name: "Russian" },
];

// Language name mapping
const languageNames: Record<string, string> = {
    "zh-CN": "Chinese (Simplified)",
    "en-US": "English (US)",
    "ja-JP": "Japanese",
    "ko-KR": "Korean",
    "fr-FR": "French",
    "de-DE": "German",
    "es-ES": "Spanish",
    "ru-RU": "Russian"
};

// Get language display name
function getLanguageDisplayName(langCode: string): string {
    return languageNames[langCode] || langCode;
}

interface TokenTableProps {
    tokens: Token[];
    languages: string[];
    sortKey: string;
    sortOrder: 'asc' | 'desc';
    onEdit: (token: Token) => void;
    onDelete: (tokenId: string) => void;
    onSortChange: (key: string) => void;
}

export function TokenTable({
    tokens,
    languages,
    sortKey,
    sortOrder,
    onEdit,
    onDelete,
    onSortChange
}: TokenTableProps) {
    const t = useTranslations('tokenTable');
    const projectsT = useTranslations('projects.languages');

    // Get localized language names
    const getLocalizedLanguageName = (langCode: string): string => {
        // Convert format from "zh-CN" to "zhCN" for i18n keys
        const formattedLang = langCode.replace(/-/g, '');
        return projectsT(formattedLang);
    };
    
    // Get translation text for a specific language
    const getTranslationText = (token: Token, lang: string): string => {
        if (!token.translations) return '';
        return (token.translations as unknown as Record<string, string>)[lang] || '';
    };

    return (
        <div className="overflow-x-auto">
            <Table className="w-full border border-gray-200 rounded-lg text-sm">
                <TableHeader className="bg-gray-100">
                    <TableRow>
                        <TableHead onClick={() => onSortChange('key')} className="cursor-pointer p-2 whitespace-nowrap">
                            key {sortKey === 'key' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </TableHead>

                        {/* Dynamically generate language headers */}
                        {languages?.map((lang) => (
                            <TableHead
                                key={lang}
                                onClick={() => onSortChange(`lang_${lang}`)}
                                className="cursor-pointer p-2 whitespace-nowrap"
                            >
                                {getLocalizedLanguageName(lang)}{' '}
                                {sortKey === `lang_${lang}` && (sortOrder === 'asc' ? '↑' : '↓')}
                            </TableHead>
                        ))}

                        <TableHead className="p-2 whitespace-nowrap">{t('tags')}</TableHead>
                        <TableHead className="p-2 whitespace-nowrap">{t('actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tokens.length > 0 ? (
                        tokens.map((token, i) => (
                            <TableRow key={i} className="hover:bg-gray-50">
                                <TableCell className="font-medium p-2 whitespace-nowrap">{token.key}</TableCell>

                                {/* Dynamically generate translations for each row */}
                                {languages?.map((lang) => (
                                    <TableCell key={lang} className="p-2">
                                        {getTranslationText(token, lang)}
                                    </TableCell>
                                ))}

                                <TableCell className="p-2">
                                    <div className="flex flex-wrap gap-1">
                                        {token.tags.map((tag, j) => (
                                            <span
                                                key={j}
                                                className="bg-gray-100 text-xs px-2 py-0.5 rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="p-2 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(token)}
                                            className="p-1"
                                        >
                                            <Pencil size={16} />
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="sm" className="p-1 text-red-500">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>{t('deleteConfirmTitle')}</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {t('deleteConfirmDescription')}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => onDelete(token.id)}
                                                        className="bg-red-500 text-white hover:bg-red-600"
                                                    >
                                                        {t('delete')}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={languages ? languages.length + 3 : 5} className="text-center py-4">
                                {t('noData')}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
