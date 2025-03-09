'use client'
import { useMemo, useState, useEffect } from "react";
import { Project, Token } from "@/jotai/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    createToken, 
    updateToken, 
    deleteToken 
} from "@/api/project";
import { useToast } from "@/components/ui/use-toast";
import { TokenFormDrawer } from "./TokenFormDrawer";
import { TokenTable } from "./TokenTable";
import { TokenPagination } from "./TokenPagination";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProjectTokensTabProps {
    project: Project | null;
}

export function ProjectTokensTab({ project }: ProjectTokensTabProps) {
    const t = useTranslations('projectTokens');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortKey, setSortKey] = useState<string>('key');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tokens, setTokens] = useState<Token[]>([]);
    const { toast } = useToast();
    
    const [formData, setFormData] = useState<{
        key: string;
        tags: string;
        comment: string;
        translations: Record<string, string>;
    }>({
        key: '',
        tags: '',
        comment: '',
        translations: {}
    });
    
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentTokenId, setCurrentTokenId] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

    // Initialize tokens data
    useEffect(() => {
        if (project?.tokens) {
            setTokens(project.tokens);
        }
    }, [project]);

    // Initialize translation fields in form data
    useEffect(() => {
        if (project?.languages) {
            const initialTranslations: Record<string, string> = {};
            project.languages.forEach(lang => {
                initialTranslations[lang] = '';
            });
            
            setFormData(prev => ({
                ...prev,
                translations: initialTranslations
            }));
        }
    }, [project?.languages]);

    const allTags = useMemo(() => {
        let tags: string[] = [];
        tokens?.forEach(token => {
            tags = [...tags, ...token.tags];
        });
        return Array.from(new Set(tags));
    }, [tokens]);

    // Form input handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Translation field handlers
    const handleTranslationChange = (lang: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            translations: {
                ...prev.translations,
                [lang]: value
            }
        }));
    };

    // Get translation text for a specific language
    const getTranslationText = (token: Token, lang: string): string => {
        if (!token.translations) return '';
        return (token.translations as unknown as Record<string, string>)[lang] || '';
    };

    // Submit form
    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            
            if (!project?.id) {
                toast({
                  title: t("errors.projectIdMissing"),
                  variant: "destructive"
                });
                return;
            }
            
            // Process tags, split string into array
            const tagArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [];
            
            if (isEditing && currentTokenId) {
                // Update token and its translations
                const updatedToken = await updateToken(currentTokenId, {
                    key: formData.key,
                    tags: tagArray,
                    comment: formData.comment,
                    translations: formData.translations, // Pass translations object directly
                });
                
                // Update local state
                setTokens(prev => 
                    prev.map(token => 
                        token.id === currentTokenId ? updatedToken : token
                    )
                );
                
                toast({
                    title: t("success.tokenUpdated"),
                });
            } else {
                // Create new token with translations
                const newToken = await createToken(project.id, {
                    key: formData.key,
                    tags: tagArray,
                    comment: formData.comment,
                    translations: formData.translations, // Pass translations object directly
                });
                
                setTokens(prev => [...prev, newToken]);
                toast({
                    title: t("success.tokenCreated"),
                });
            }
            
            // Reset form
            resetForm();
            setIsDrawerOpen(false);
        } catch (error) {
            console.error('Error submitting form:', error);
            toast({
              title: isEditing ? t("errors.updateFailed") : t("errors.createFailed"),
              variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    // Edit token
    const handleEditToken = (token: Token) => {
        setIsEditing(true);
        setCurrentTokenId(token.id);
        
        // Initialize translations object
        const translations: Record<string, string> = {};
        
        // For each language supported by the project, set an empty string or existing translation
        if (project?.languages) {
            project.languages.forEach(lang => {
                // Get translation for each language from token.translations JSON
                translations[lang] = getTranslationText(token, lang);
            });
        }
        
        setFormData({
            key: token.key,
            tags: token.tags.join(', '),
            comment: token.comment || '',
            translations
        });
        
        setIsDrawerOpen(true);
    };
    
    // Delete token
    const handleDeleteToken = async (tokenId: string) => {
        try {
            setIsLoading(true);
            await deleteToken(tokenId);
            
            // Update local data
            setTokens(prev => prev.filter(token => token.id !== tokenId));
            toast({
              title: t("success.tokenDeleted"),
            });
        } catch (error) {
            console.error('Error deleting token:', error);
            toast({
              title: t("errors.deleteFailed"),
              variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    // Reset form
    const resetForm = () => {
        const initialTranslations: Record<string, string> = {};
        if (project?.languages) {
            project.languages.forEach(lang => {
                initialTranslations[lang] = '';
            });
        }
        
        setFormData({
            key: '',
            tags: '',
            comment: '',
            translations: initialTranslations
        });
        
        setIsEditing(false);
        setCurrentTokenId(null);
    };
    
    // Reset form when opening add drawer
    const handleOpenAddDrawer = () => {
        resetForm();
        setIsDrawerOpen(true);
    };

    const handleTagChange = (tag: string) => {
        setSelectedTag(tag);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSortChange = (key: string) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const filteredTokens = useMemo(() => {
        let filteredTokens = tokens || [];
        if (selectedTag) {
            filteredTokens = filteredTokens.filter(token => token.tags.includes(selectedTag));
        }
        if (searchTerm) {
            filteredTokens = filteredTokens.filter(token => {
                // Search in key
                if (token.key.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return true;
                }
                
                // Search in translation content
                const translations = token.translations as unknown as Record<string, string>;
                return Object.values(translations).some(text => 
                    text && text.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
        }
        filteredTokens = filteredTokens.sort((a, b) => {
            if (sortOrder === 'asc') {
                if (sortKey === 'key') return a.key > b.key ? 1 : -1;
                // Sort by language
                if (sortKey.startsWith('lang_')) {
                    const lang = sortKey.replace('lang_', '');
                    const textA = getTranslationText(a, lang);
                    const textB = getTranslationText(b, lang);
                    return textA > textB ? 1 : -1;
                }
                return 0;
            } else {
                if (sortKey === 'key') return a.key < b.key ? 1 : -1;
                if (sortKey.startsWith('lang_')) {
                    const lang = sortKey.replace('lang_', '');
                    const textA = getTranslationText(a, lang);
                    const textB = getTranslationText(b, lang);
                    return textA < textB ? 1 : -1;
                }
                return 0;
            }
        });
        return filteredTokens;
    }, [tokens, selectedTag, searchTerm, sortKey, sortOrder]);

    // Pagination logic
    const totalPages = Math.ceil(filteredTokens.length / itemsPerPage);
    const paginatedTokens = filteredTokens.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>
                <TokenFormDrawer
                    isOpen={isDrawerOpen}
                    onOpenChange={(open) => setIsDrawerOpen(open)}
                    isEditing={isEditing}
                    isLoading={isLoading}
                    formData={formData}
                    languages={project?.languages}
                    onInputChange={handleInputChange}
                    onTranslationChange={handleTranslationChange}
                    onSubmit={handleSubmit}
                    onAddNew={handleOpenAddDrawer}
                />
                <Button 
                    onClick={handleOpenAddDrawer}
                    className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 active:transform active:scale-95 transition-all duration-150 text-sm mt-2 md:mt-0 flex items-center gap-1"
                >
                    <Plus size={16} />
                    {t("addToken")}
                </Button>
            </div>

            <div className="flex flex-col md:flex-row mb-4 space-y-2 md:space-y-0 md:space-x-2">
                <Input 
                    value={searchTerm} 
                    onChange={handleSearchChange} 
                    placeholder={t("searchPlaceholder")} 
                    className="flex-grow md:w-3/4 border border-gray-300 rounded-lg p-1 text-sm" 
                />
                <Select value={selectedTag || ''} onValueChange={handleTagChange}>
                    <SelectTrigger className="border border-gray-300 rounded-lg p-1 text-sm md:w-1/4">
                        <SelectValue placeholder={t("selectTag")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="bondma-all">{t("allTags")}</SelectItem>
                        {allTags.map((tag, index) => (
                            <SelectItem key={index} value={tag}>
                                {tag}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <TokenTable 
                tokens={paginatedTokens} 
                languages={project?.languages ?? []}
                sortKey={sortKey} 
                sortOrder={sortOrder} 
                onEdit={handleEditToken}
                onDelete={handleDeleteToken}
                onSortChange={handleSortChange}
            />

            <TokenPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
