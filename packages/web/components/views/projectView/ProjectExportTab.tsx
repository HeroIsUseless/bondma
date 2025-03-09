'use client'
import { useState } from "react";
import { Project } from "@/jotai/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, FileJson, FileText, Table as TableIcon, Download, Settings2 } from "lucide-react";
import { exportProjectTokens } from "@/api/project";
import { useTranslations } from "next-intl";

interface ProjectExportTabProps {
    project: Project | null;
}

export function ProjectExportTab({ project }: ProjectExportTabProps) {
    const t = useTranslations('project.export');
    
    // File format selection
    const [fileFormat, setFileFormat] = useState<string>("json");
    // Export scope
    const [exportScope, setExportScope] = useState<string>("all");
    // Export status
    const [exportStatus, setExportStatus] = useState<'idle' | 'success'>('idle');
    // Advanced settings
    const [showEmptyTranslations, setShowEmptyTranslations] = useState<boolean>(true);
    const [prettify, setPrettify] = useState<boolean>(true);
    const [includeMetadata, setIncludeMetadata] = useState<boolean>(false);
    // Language selection
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

    // Project languages mock
    const projectLanguages = ['zh-CN', 'en-US', 'ja-JP', 'ko-KR', 'fr-FR', 'de-DE', 'es-ES'];

    // Handle language selection
    const toggleLanguage = (language: string) => {
        if (selectedLanguages.includes(language)) {
            setSelectedLanguages(selectedLanguages.filter(lang => lang !== language));
        } else {
            setSelectedLanguages([...selectedLanguages, language]);
        }
    };

    // Handle download
    const handleExport = async () => {
        if (!project?.id) return;
        
        setExportStatus('idle');
        
        try {
            // Call API to export file
            const response = await exportProjectTokens(project.id, {
                format: fileFormat as 'json' | 'csv' | 'xml' | 'yaml',
                scope: exportScope as 'all' | 'completed' | 'incomplete' | 'custom',
                languages: selectedLanguages.length ? selectedLanguages : undefined,
                showEmptyTranslations,
                prettify,
                includeMetadata
            });
            
            // Create download link
            const url = window.URL.createObjectURL(new Blob([response as string | ArrayBuffer]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${project.name || 'translations'}.zip`); // Change to .zip extension
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Update status to success
            setExportStatus('success');
            
            // Reset status
            setTimeout(() => {
                setExportStatus('idle');
            }, 3000);
        } catch (error) {
            console.error("Export failed:", error);
            // Error handling logic can be added here
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-2">{t('title')}</h1>
                <p className="text-gray-600">{t('description', { projectName: project?.name })}</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>{t('settings')}</CardTitle>
                    <CardDescription>{t('settingsDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="format" className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="format" className="flex items-center gap-2">
                                <FileJson className="h-4 w-4" />
                                {t('fileFormat')}
                            </TabsTrigger>
                            <TabsTrigger value="content" className="flex items-center gap-2">
                                <Settings2 className="h-4 w-4" />
                                {t('contentSettings')}
                            </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="format" className="space-y-6">
                            {/* File format selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">{t('formatLabel')}</label>
                                <RadioGroup 
                                    value={fileFormat} 
                                    onValueChange={setFileFormat}
                                    className="grid grid-cols-2 gap-4 pt-2"
                                >
                                    <div className="flex flex-col items-center space-y-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                                        <FileJson className="h-8 w-8 text-blue-500" />
                                        <RadioGroupItem value="json" id="json" className="sr-only" />
                                        <Label htmlFor="json" className="font-medium">{t('jsonFormat')}</Label>
                                        <span className="text-xs text-gray-500">{t('jsonDesc')}</span>
                                    </div>
                                    
                                    <div className="flex flex-col items-center space-y-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                                        <TableIcon className="h-8 w-8 text-green-500" />
                                        <RadioGroupItem value="csv" id="csv" className="sr-only" />
                                        <Label htmlFor="csv" className="font-medium">{t('csvFormat')}</Label>
                                        <span className="text-xs text-gray-500">{t('csvDesc')}</span>
                                    </div>
                                    
                                    <div className="flex flex-col items-center space-y-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                                        <FileText className="h-8 w-8 text-orange-500" />
                                        <RadioGroupItem value="xml" id="xml" className="sr-only" />
                                        <Label htmlFor="xml" className="font-medium">{t('xmlFormat')}</Label>
                                        <span className="text-xs text-gray-500">{t('xmlDesc')}</span>
                                    </div>
                                    
                                    <div className="flex flex-col items-center space-y-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                                        <FileText className="h-8 w-8 text-purple-500" />
                                        <RadioGroupItem value="yaml" id="yaml" className="sr-only" />
                                        <Label htmlFor="yaml" className="font-medium">{t('yamlFormat')}</Label>
                                        <span className="text-xs text-gray-500">{t('yamlDesc')}</span>
                                    </div>
                                </RadioGroup>
                            </div>
                            
                            {/* Export scope selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">{t('exportScope')}</label>
                                <Select value={exportScope} onValueChange={setExportScope}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select export scope" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t('scopeAll')}</SelectItem>
                                        <SelectItem value="completed">{t('scopeCompleted')}</SelectItem>
                                        <SelectItem value="incomplete">{t('scopeIncomplete')}</SelectItem>
                                        <SelectItem value="custom">{t('scopeCustom')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="content" className="space-y-6">
                            {/* Language selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">{t('exportLanguages')}</label>
                                <div className="flex flex-wrap gap-2">
                                    {projectLanguages.map(lang => (
                                        <Button
                                            key={lang}
                                            variant={selectedLanguages.includes(lang) ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => toggleLanguage(lang)}
                                        >
                                            {lang}
                                        </Button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {selectedLanguages.length 
                                        ? t('languagesSelected', { count: selectedLanguages.length }) 
                                        : t('noLanguageSelected')}
                                </p>
                            </div>
                            
                            {/* Advanced settings */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">{t('advancedOptions')}</label>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="empty-translations" className="font-medium">{t('includeEmpty')}</Label>
                                            <p className="text-xs text-gray-500">{t('includeEmptyDesc')}</p>
                                        </div>
                                        <Switch 
                                            id="empty-translations" 
                                            checked={showEmptyTranslations}
                                            onCheckedChange={setShowEmptyTranslations}
                                        />
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="prettify" className="font-medium">{t('prettify')}</Label>
                                            <p className="text-xs text-gray-500">{t('prettifyDesc')}</p>
                                        </div>
                                        <Switch 
                                            id="prettify" 
                                            checked={prettify}
                                            onCheckedChange={setPrettify}
                                        />
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="metadata" className="font-medium">{t('metadata')}</Label>
                                            <p className="text-xs text-gray-500">{t('metadataDesc')}</p>
                                        </div>
                                        <Switch 
                                            id="metadata" 
                                            checked={includeMetadata}
                                            onCheckedChange={setIncludeMetadata}
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                    
                    {/* Export button */}
                    <div className="flex justify-end mt-8">
                        <Button 
                            onClick={handleExport}
                            className="flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            {t('downloadButton')}
                        </Button>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        {t('fileNote')}
                    </p>
                    
                    {/* Success notification */}
                    {exportStatus === 'success' && (
                        <Alert variant="default" className="bg-green-50 border-green-200 mt-4">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <AlertTitle>{t('exportSuccess')}</AlertTitle>
                            <AlertDescription>{t('exportSuccessDesc')}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
