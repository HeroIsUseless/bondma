'use client'
import { useCallback, useState } from "react";
import { Project } from "@/jotai/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, CheckCircle2, AlertCircle, FileJson, FileText, Table as TableIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDropzone } from "react-dropzone";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { importProjectTokens } from "@/api/project";
import { useTranslations } from "next-intl";

interface ProjectImportTabProps {
    project: Project | null;
}

export function ProjectImportTab({ project }: ProjectImportTabProps) {
    const t = useTranslations();
    const [importOption, setImportOption] = useState<'append' | 'replace'>('append');
    const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
    const [importMessage, setImportMessage] = useState<string>('');
    const [importedFiles, setImportedFiles] = useState<File[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');
    const [stats, setStats] = useState<{ added: number; updated: number; unchanged: number; total: number } | null>(null);
    
    // Handle file drop for upload
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setImportedFiles(acceptedFiles);
        setImportStatus('idle');
        setStats(null);
    }, []);
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/json': ['.json'],
            'text/csv': ['.csv'],
            'application/xml': ['.xml'],
            'text/yaml': ['.yaml', '.yml'],
        },
        multiple: false
    });
    
    // Get file format
    const getFileFormat = (filename: string): 'json' | 'csv' | 'xml' | 'yaml' => {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext === 'json') return 'json';
        if (ext === 'csv') return 'csv';
        if (ext === 'xml') return 'xml';
        if (ext === 'yaml' || ext === 'yml') return 'yaml';
        return 'json'; // Default
    };
    
    // Handle file import
    const handleImport = async () => {
        if (importedFiles.length === 0) {
            setImportStatus('error');
            setImportMessage(t('project.import.selectFileFirst'));
            return;
        }
        
        if (!selectedLanguage) {
            setImportStatus('error');
            setImportMessage(t('project.import.selectLanguageFirst'));
            return;
        }
        
        // Set loading state
        setImportStatus('loading');
        setImportMessage(t('project.import.status.processing'));
        
        try {
            const file = importedFiles[0];
            const format = getFileFormat(file.name);
            
            // Read file content
            const content = await readFileContent(file);
            
            // Call API to import data
            const result = await importProjectTokens(project?.id || '', {
                language: selectedLanguage,
                content,
                format,
                mode: importOption
            });
            
            // Set success state and statistics
            setImportStatus('success');
            setImportMessage(result.message || t('project.import.status.success'));
            setStats(result.stats);
        } catch (error: any) {
            setImportStatus('error');
            setImportMessage(error.message || t('project.import.status.error'));
        }
    };
    
    // Read file content
    const readFileContent = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = (e) => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    };
    
    // Reset import state
    const resetImport = () => {
        setImportedFiles([]);
        setImportStatus('idle');
        setImportMessage('');
        setStats(null);
    };
    
    // Get file icon
    const getFileIcon = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext === 'json') return <FileJson className="h-12 w-12 text-blue-500" />;
        if (ext === 'csv') return <TableIcon className="h-12 w-12 text-green-500" />;
        if (ext === 'xml') return <FileText className="h-12 w-12 text-orange-500" />;
        if (ext === 'yaml' || ext === 'yml') return <FileText className="h-12 w-12 text-purple-500" />;
        return <FileText className="h-12 w-12 text-gray-500" />;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-2">{t('project.import.title')}</h1>
                <p className="text-gray-600">
                    {t('project.import.description', { projectName: project?.name })}
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>{t('project.import.fileImport')}</CardTitle>
                    <CardDescription>{t('project.import.fileImportDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Import method selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('project.import.importMethod')}</label>
                            <RadioGroup 
                                defaultValue="append" 
                                value={importOption}
                                onValueChange={(value) => setImportOption(value as 'append' | 'replace')}
                                className="flex space-x-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="append" id="append" />
                                    <label htmlFor="append" className="text-sm">{t('project.import.appendMode')}</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="replace" id="replace" />
                                    <label htmlFor="replace" className="text-sm">{t('project.import.replaceMode')}</label>
                                </div>
                            </RadioGroup>
                        </div>
                        
                        {/* Target language selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('project.import.targetLanguage')}</label>
                            <Select
                                value={selectedLanguage}
                                onValueChange={setSelectedLanguage}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t('project.import.selectTargetLanguage')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {project?.languages?.map(lang => (
                                        <SelectItem key={lang} value={lang}>
                                            {lang}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {/* Drag and drop area */}
                        <div 
                            {...getRootProps()} 
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
                                ${importStatus === 'loading' ? 'opacity-50 pointer-events-none' : ''}
                            `}
                        >
                            <input {...getInputProps()} />
                            {importedFiles.length > 0 ? (
                                <div className="space-y-2">
                                    <div className="flex justify-center">
                                        {getFileIcon(importedFiles[0].name)}
                                    </div>
                                    <p className="font-medium">{importedFiles[0].name}</p>
                                    <p className="text-sm text-gray-500">
                                        {(importedFiles[0].size / 1024).toFixed(2)} KB
                                    </p>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            resetImport();
                                        }}
                                    >
                                        {t('project.import.dragDropArea.chooseAnotherFile')}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-center">
                                        <Upload className="h-12 w-12 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {isDragActive 
                                                ? t('project.import.dragDropArea.dragActive') 
                                                : t('project.import.dragDropArea.instructions')}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {t('project.import.dragDropArea.supportedFormats')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Import notes */}
                        <div className="bg-gray-50 p-4 rounded-md text-sm">
                            <p className="font-medium mb-2">{t('project.import.importNotes.title')}</p>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                <li>{t('project.import.importNotes.jsonNote')}</li>
                                <li>{t('project.import.importNotes.csvNote')}</li>
                                <li>{t('project.import.importNotes.formatNote')}</li>
                            </ul>
                        </div>
                        
                        {/* Import button */}
                        <div className="flex justify-end">
                            <Button 
                                onClick={handleImport}
                                disabled={importedFiles.length === 0 || !selectedLanguage || importStatus === 'loading'}
                                className="flex items-center gap-2"
                            >
                                {importStatus === 'loading' 
                                    ? t('project.import.importing') 
                                    : t('project.import.importButton')}
                            </Button>
                        </div>
                    
                        {/* Import status message */}
                        {importStatus === 'success' && (
                            <Alert variant="default" className="bg-green-50 border-green-200">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <AlertTitle>{t('project.import.status.success')}</AlertTitle>
                                <AlertDescription>
                                    {importMessage}
                                    {stats && (
                                        <div className="mt-2 text-sm">
                                            <p>{t('project.import.stats.total', { total: stats.total })}</p>
                                            <p>{t('project.import.stats.added', { count: stats.added })}</p>
                                            <p>{t('project.import.stats.updated', { count: stats.updated })}</p>
                                            <p>{t('project.import.stats.unchanged', { count: stats.unchanged })}</p>
                                        </div>
                                    )}
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        {importStatus === 'error' && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>{t('project.import.status.error')}</AlertTitle>
                                <AlertDescription>{importMessage}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
