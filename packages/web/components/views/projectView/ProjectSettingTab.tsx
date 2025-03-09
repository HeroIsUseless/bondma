'use client'
import { useState } from "react";
import { Project } from "@/jotai/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Trash, Save, AlertTriangle, Settings, User2, Globe, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProjectSettingTabProps {
    project: Project | null;
}

export function ProjectSettingTab({ project }: ProjectSettingTabProps) {
    const t = useTranslations();
    
    // Project basic information state
    const [projectName, setProjectName] = useState<string>(project?.name || "");
    const [projectDescription, setProjectDescription] = useState<string>(project?.description || "");
    const [projectUrl, setProjectUrl] = useState<string>(project?.url || "");
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
    
    // Project language management
    const [availableLanguages, setAvailableLanguages] = useState<string[]>([
        "zh-CN", "en-US", "ja-JP", "ko-KR", "fr-FR", "de-DE", "es-ES"
    ]);
    const [projectLanguages, setProjectLanguages] = useState<string[]>(
        project?.languages || ["zh-CN", "en-US"]
    );
    const [newLanguage, setNewLanguage] = useState<string>("");
    
    // Project advanced settings
    const [autoTranslate, setAutoTranslate] = useState<boolean>(false);
    const [enableVersioning, setEnableVersioning] = useState<boolean>(true);
    const [enableComments, setEnableComments] = useState<boolean>(true);
    const [publicProject, setPublicProject] = useState<boolean>(false);
    
    // Add language
    const handleAddLanguage = () => {
        if (newLanguage && !projectLanguages.includes(newLanguage)) {
            setProjectLanguages([...projectLanguages, newLanguage]);
            setNewLanguage("");
        }
    };
    
    // Remove language
    const handleRemoveLanguage = (language: string) => {
        setProjectLanguages(projectLanguages.filter(lang => lang !== language));
    };
    
    // Save project settings
    const handleSaveSettings = () => {
        // Set save status to loading
        setSaveStatus("idle");
        
        // Simulate API request
        setTimeout(() => {
            try {
                // In a real application, this would be the logic to save to the backend
                console.log("Saving project settings:", {
                    id: project?.id,
                    name: projectName,
                    description: projectDescription,
                    url: projectUrl,
                    languages: projectLanguages,
                    settings: {
                        autoTranslate,
                        enableVersioning,
                        enableComments,
                        publicProject
                    }
                });
                
                // Set save success
                setSaveStatus("success");
                
                // Reset status after 3 seconds
                setTimeout(() => setSaveStatus("idle"), 3000);
            } catch (error) {
                // Save failed
                setSaveStatus("error");
            }
        }, 1000);
    };
    
    // Delete project
    const handleDeleteProject = () => {
        // In a real application, this would call an API to delete the project
        console.log("Deleting project:", project?.id);
        // Could add navigation logic to project list here
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-2">{t('project.tabs.setting')}</h1>
                <p className="text-gray-600">{t('project.settings.description', { projectName: project?.name })}</p>
            </div>
            
            <Tabs defaultValue="basic" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="basic" className="flex gap-2 items-center">
                        <FileText className="h-4 w-4" />
                        {t('project.settings.tabs.basic')}
                    </TabsTrigger>
                    <TabsTrigger value="languages" className="flex gap-2 items-center">
                        <Globe className="h-4 w-4" />
                        {t('project.settings.tabs.languages')}
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="flex gap-2 items-center">
                        <Settings className="h-4 w-4" />
                        {t('project.settings.tabs.advanced')}
                    </TabsTrigger>
                    <TabsTrigger value="danger" className="flex gap-2 items-center text-red-500">
                        <AlertTriangle className="h-4 w-4" />
                        {t('project.settings.tabs.danger')}
                    </TabsTrigger>
                </TabsList>
                
                {/* Basic information settings */}
                <TabsContent value="basic">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('project.settings.basic.title')}</CardTitle>
                            <CardDescription>{t('project.settings.basic.description')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="projectName">{t('project.settings.basic.name')}</Label>
                                <Input 
                                    id="projectName" 
                                    value={projectName} 
                                    onChange={(e) => setProjectName(e.target.value)}
                                    placeholder={t('project.settings.basic.namePlaceholder')}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="projectDescription">{t('project.settings.basic.description')}</Label>
                                <Textarea 
                                    id="projectDescription" 
                                    value={projectDescription} 
                                    onChange={(e) => setProjectDescription(e.target.value)}
                                    placeholder={t('project.settings.basic.descriptionPlaceholder')}
                                    rows={4}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="projectUrl">{t('project.settings.basic.url')}</Label>
                                <Input 
                                    id="projectUrl" 
                                    value={projectUrl} 
                                    onChange={(e) => setProjectUrl(e.target.value)}
                                    placeholder={t('project.settings.basic.urlPlaceholder')}
                                />
                                <p className="text-sm text-gray-500">{t('project.settings.basic.urlHelpText')}</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <p className="text-sm text-gray-500">
                                {saveStatus === "success" && t('project.settings.saveSuccess')}
                                {saveStatus === "error" && t('project.settings.saveError')}
                            </p>
                            <Button 
                                onClick={handleSaveSettings}
                                className="flex items-center gap-2"
                            >
                                <Save className="h-4 w-4" />
                                {t('project.settings.saveButton')}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                
                {/* Language management */}
                <TabsContent value="languages">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('project.settings.languages.title')}</CardTitle>
                            <CardDescription>{t('project.settings.languages.description')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>{t('project.settings.languages.current')}</Label>
                                <div className="flex flex-wrap gap-2">
                                    {projectLanguages.map(lang => (
                                        <Badge key={lang} variant="outline" className="flex items-center gap-1 py-1.5">
                                            {lang}
                                            <button 
                                                onClick={() => handleRemoveLanguage(lang)}
                                                className="ml-1 text-gray-500 hover:text-red-500"
                                            >
                                                <Trash className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                {projectLanguages.length === 0 && (
                                    <p className="text-sm text-gray-500">{t('project.settings.languages.noLanguages')}</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label>{t('project.settings.languages.add')}</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        value={newLanguage}
                                        onChange={(e) => setNewLanguage(e.target.value)}
                                        placeholder={t('project.settings.languages.addPlaceholder')}
                                        className="flex-1"
                                    />
                                    <Button 
                                        onClick={handleAddLanguage}
                                        className="flex items-center gap-1"
                                    >
                                        <Plus className="h-4 w-4" />
                                        {t('common.add')}
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label>{t('project.settings.languages.common')}</Label>
                                <div className="flex flex-wrap gap-2">
                                    {availableLanguages.map(lang => (
                                        <Badge 
                                            key={lang} 
                                            variant={projectLanguages.includes(lang) ? "default" : "outline"}
                                            className="cursor-pointer"
                                            onClick={() => {
                                                if (projectLanguages.includes(lang)) {
                                                    handleRemoveLanguage(lang);
                                                } else {
                                                    setProjectLanguages([...projectLanguages, lang]);
                                                }
                                            }}
                                        >
                                            {lang}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <p className="text-sm text-gray-500">
                                {saveStatus === "success" && t('project.settings.languages.saveSuccess')}
                                {saveStatus === "error" && t('project.settings.saveError')}
                            </p>
                            <Button 
                                onClick={handleSaveSettings} 
                                className="flex items-center gap-2"
                            >
                                <Save className="h-4 w-4" />
                                {t('project.settings.languages.saveButton')}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                
                {/* Advanced settings */}
                <TabsContent value="advanced">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('project.settings.advanced.title')}</CardTitle>
                            <CardDescription>{t('project.settings.advanced.description')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="autoTranslate" className="font-medium">{t('project.settings.advanced.autoTranslate.title')}</Label>
                                    <p className="text-sm text-gray-500">{t('project.settings.advanced.autoTranslate.description')}</p>
                                </div>
                                <Switch 
                                    id="autoTranslate" 
                                    checked={autoTranslate}
                                    onCheckedChange={setAutoTranslate}
                                />
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="enableVersioning" className="font-medium">{t('project.settings.advanced.versioning.title')}</Label>
                                    <p className="text-sm text-gray-500">{t('project.settings.advanced.versioning.description')}</p>
                                </div>
                                <Switch 
                                    id="enableVersioning" 
                                    checked={enableVersioning}
                                    onCheckedChange={setEnableVersioning}
                                />
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="enableComments" className="font-medium">{t('project.settings.advanced.comments.title')}</Label>
                                    <p className="text-sm text-gray-500">{t('project.settings.advanced.comments.description')}</p>
                                </div>
                                <Switch 
                                    id="enableComments" 
                                    checked={enableComments}
                                    onCheckedChange={setEnableComments}
                                />
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="publicProject" className="font-medium">{t('project.settings.advanced.public.title')}</Label>
                                    <p className="text-sm text-gray-500">{t('project.settings.advanced.public.description')}</p>
                                </div>
                                <Switch 
                                    id="publicProject" 
                                    checked={publicProject}
                                    onCheckedChange={setPublicProject}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <p className="text-sm text-gray-500">
                                {saveStatus === "success" && t('project.settings.advanced.saveSuccess')}
                                {saveStatus === "error" && t('project.settings.saveError')}
                            </p>
                            <Button 
                                onClick={handleSaveSettings}
                                className="flex items-center gap-2"
                            >
                                <Save className="h-4 w-4" />
                                {t('project.settings.advanced.saveButton')}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                
                {/* Danger zone */}
                <TabsContent value="danger">
                    <Card className="border-red-200">
                        <CardHeader className="text-red-500">
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                {t('project.settings.danger.title')}
                            </CardTitle>
                            <CardDescription className="text-red-400">
                                {t('project.settings.danger.description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    {t('project.settings.danger.warning')}
                                </AlertDescription>
                            </Alert>
                            
                            <div className="p-4 border border-red-200 rounded-md">
                                <h3 className="text-lg font-medium text-red-500 mb-2">{t('project.settings.danger.deleteProject')}</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    {t('project.settings.danger.deleteDescription', { projectName: project?.name })}
                                </p>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="flex items-center gap-2">
                                            <Trash className="h-4 w-4" />
                                            {t('project.settings.danger.deleteButton')}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>{t('project.settings.danger.confirmDeleteTitle')}</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                {t('project.settings.danger.confirmDeleteDescription', { projectName: project?.name })}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                            <AlertDialogAction 
                                                onClick={handleDeleteProject}
                                                className="bg-red-500 hover:bg-red-600"
                                            >
                                                {t('project.settings.danger.confirmDeleteButton')}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
