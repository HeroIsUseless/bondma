'use client'

import { createProject } from "@/api/project";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Project } from "@/jotai/types";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { LanguageSelector } from "@/components/views/teamsView/LanguageSelector";
import { useTranslations } from "next-intl";

interface NewProjectDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    teamId: string;
    onProjectCreated: (project: Project) => void;
}

export function NewProjectDialog({
    isOpen,
    onOpenChange,
    teamId,
    onProjectCreated
}: NewProjectDialogProps) {
    const t = useTranslations();
    const [newProjectName, setNewProjectName] = useState("");
    const [newProjectDescription, setNewProjectDescription] = useState("");
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["zh-CN"]);
    const [isCreatingProject, setIsCreatingProject] = useState(false);
    const { toast } = useToast();

    const handleCreateProject = async () => {
        if (!newProjectName) {
            toast({
                title: t('projects.errors.nameRequired'),
                variant: "destructive",
            });
            return;
        }

        if (selectedLanguages.length === 0) {
            toast({
                title: t('projects.errors.languageRequired'),
                variant: "destructive",
            });
            return;
        }

        setIsCreatingProject(true);

        try {
            const newProject = await createProject({
                name: newProjectName,
                description: newProjectDescription,
                teamId: teamId,
                languages: selectedLanguages,
            });

            onProjectCreated(newProject);
            onOpenChange(false);
            setNewProjectName("");
            setNewProjectDescription("");
            setSelectedLanguages(["zh-CN"]);
            toast({
                title: t('projects.createSuccess'),
                variant: "default",
            });
        } catch (error) {
            console.error(t('projects.errors.createFailed'), error);
            toast({
                title: t('projects.createFailed'),
                variant: "destructive",
            });
        }

        setIsCreatingProject(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('projects.create.title')}</DialogTitle>
                    <DialogDescription>{t('projects.create.description')}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="project-name">{t('projects.create.name')}</Label>
                        <Input
                            id="project-name"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder={t('projects.create.namePlaceholder')}
                        />
                    </div>
                    <div>
                        <Label htmlFor="project-description">{t('projects.create.description')}</Label>
                        <Textarea
                            id="project-description"
                            value={newProjectDescription}
                            onChange={(e) => setNewProjectDescription(e.target.value)}
                            placeholder={t('projects.create.descriptionPlaceholder')}
                        />
                    </div>
                    <div>
                        <Label>{t('projects.create.languages')}</Label>
                        <LanguageSelector
                          selectedLanguages={selectedLanguages}
                          onChange={setSelectedLanguages}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>{t('common.cancel')}</Button>
                    <Button onClick={handleCreateProject} disabled={isCreatingProject}>
                        {isCreatingProject ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : t('projects.create.createButton')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
