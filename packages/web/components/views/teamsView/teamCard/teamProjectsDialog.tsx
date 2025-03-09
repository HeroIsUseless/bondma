'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Project, Team } from "@/jotai/types";
import { ArrowDown, ArrowUp, ArrowUpDown, Calendar, FileText, Folder, Globe, Plus, Search } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface TeamProjectsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    team: Team;
    projects: Project[];
    setProjects: (projects: Project[]) => void;
    onNewProject: () => void;
    onNavigateToProject: (projectId: string) => void;
}

export function TeamProjectsDialog({
    isOpen,
    onOpenChange,
    team,
    projects,
    setProjects,
    onNewProject,
    onNavigateToProject
}: TeamProjectsDialogProps) {
    const t = useTranslations();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<"name" | "updatedAt" | "languages">("updatedAt");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    // 排序和过滤项目
    const filteredAndSortedProjects = projects
        .filter(project => 
            searchTerm === "" || 
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => {
            if (sortField === "name") {
                return sortDirection === "asc" 
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else if (sortField === "languages") {
                const aLength = a.languages?.length || 0;
                const bLength = b.languages?.length || 0;
                return sortDirection === "asc" ? aLength - bLength : bLength - aLength;
            } else {
                const aTime = new Date(a.updatedAt || a.createdAt || '').getTime();
                const bTime = new Date(b.updatedAt || b.createdAt || '').getTime();
                return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
            }
        });
        
    const toggleSort = (field: "name" | "updatedAt" | "languages") => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("desc");
        }
    };
    
    const getSortIcon = (field: "name" | "updatedAt" | "languages") => {
        if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1" />;
        return sortDirection === "asc" ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />;
    };
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString || Date.now());
        return new Intl.DateTimeFormat('zh-CN', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>
                        <span className="flex items-center">
                            <Folder className="h-5 w-5 mr-2 text-primary" />
                            {t('teams.card.listTitle', { teamName: team.name })}
                        </span>
                    </DialogTitle>
                    <DialogDescription>
                        {t('teams.card.projectsTotal', { count: projects.length })}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-4">
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t('teams.card.searchProjects')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 w-full sm:w-[250px]"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full justify-end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onNewProject}
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            {t('teams.card.newProject')}
                        </Button>
                    </div>
                </div>

                <div className="border rounded-md">
                    <div className="grid grid-cols-12 gap-2 p-3 bg-muted/50 text-sm font-medium">
                        <div 
                            className="col-span-5 cursor-pointer flex items-center"
                            onClick={() => toggleSort("name")}
                        >
                            {t('teams.card.projectName')} {getSortIcon("name")}
                        </div>
                        <div className="col-span-3 hidden md:block">{t('teams.card.description')}</div>
                        <div 
                            className="col-span-2 cursor-pointer flex items-center"
                            onClick={() => toggleSort("languages")}
                        >
                            {t('teams.card.languages')} {getSortIcon("languages")}
                        </div>
                        <div 
                            className="col-span-2 cursor-pointer flex items-center justify-end"
                            onClick={() => toggleSort("updatedAt")}
                        >
                            {t('teams.card.updatedTime')} {getSortIcon("updatedAt")}
                        </div>
                    </div>

                    <Separator />
                    
                    <ScrollArea className="h-[300px]">
                        {filteredAndSortedProjects.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                {searchTerm ? t('teams.card.noMatchingProjects') : t('teams.card.noProjects')}
                            </div>
                        ) : (
                            filteredAndSortedProjects.map((project, index) => (
                                <div key={project.id}>
                                    <div 
                                        className="grid grid-cols-12 gap-2 p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                                        onClick={() => onNavigateToProject(project.id)}
                                    >
                                        <div className="col-span-5 font-medium flex items-center">
                                            <FileText className="h-4 w-4 mr-2 text-primary" />
                                            <div className="truncate">{project.name}</div>
                                        </div>
                                        <div className="col-span-3 hidden md:block text-muted-foreground truncate">
                                            {project.description || t('teams.card.noDescription')}
                                        </div>
                                        <div className="col-span-2">
                                            {project.languages && project.languages.length > 0 ? (
                                                <div className="flex items-center">
                                                    <Globe className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                                    <Badge variant="outline">
                                                        {t('teams.card.languagesCount', { count: project.languages.length })}
                                                    </Badge>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">{t('teams.card.noLanguage')}</span>
                                            )}
                                        </div>
                                        <div className="col-span-2 text-sm text-muted-foreground text-right">
                                            <div className="flex items-center justify-end">
                                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                                {formatDate(String(project.updatedAt || project.createdAt || ''))}
                                            </div>
                                        </div>
                                    </div>
                                    {index < filteredAndSortedProjects.length - 1 && <Separator />}
                                </div>
                            ))
                        )}
                    </ScrollArea>
                </div>

                <DialogFooter>
                    <div className="text-xs text-muted-foreground mr-auto">
                        {searchTerm 
                            ? t('teams.card.showingResults', { count: filteredAndSortedProjects.length, total: projects.length }) 
                            : t('teams.card.totalProjects', { count: projects.length })
                        }
                    </div>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>{t('teams.card.close')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
