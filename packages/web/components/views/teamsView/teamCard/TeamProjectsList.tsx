import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Project } from "@/jotai/types";
import { Book, FileText, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface TeamProjectsListProps {
    projects: Project[];
    isLoading: boolean;
    onViewAllProjects: () => void;
    onCreateProject: () => void;
    onNavigateToProject: (projectId: string) => void;
}

export function TeamProjectsList({
    projects,
    isLoading,
    onViewAllProjects,
    onCreateProject,
    onNavigateToProject
}: TeamProjectsListProps) {
    const t = useTranslations();
    
    return (
        <CardContent>
            <div className="mt-2">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">{t('teams.card.projectList')}</h4>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={onViewAllProjects}
                    >
                        {t('teams.card.viewAll')}
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-3">
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                ) : projects && projects.length > 0 ? (
                    <ScrollArea className="h-[100px]">
                        <div className="space-y-2">
                            {projects.slice(0, 5).map(project => (
                                <TooltipProvider key={project.id}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div
                                                onClick={() => onNavigateToProject(project.id)}
                                                className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
                                            >
                                                <div className="flex items-center overflow-hidden">
                                                    <FileText className="h-3 w-3 mr-2 flex-shrink-0 text-muted-foreground" />
                                                    <span className="text-sm truncate">{project.name}</span>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs ml-2 px-1 h-5 whitespace-nowrap"
                                                >
                                                    {t('teams.card.languagesCount', { count: project.languages?.length || 0 })}
                                                </Badge>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{project.description || t('teams.card.noDescription')}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}

                            {projects.length > 5 && (
                                <div className="text-center pt-2 pb-1">
                                    <span className="text-xs text-muted-foreground">
                                        {t('teams.card.moreProjects', { count: projects.length - 5 })}
                                    </span>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-muted-foreground text-sm bg-muted/20 rounded-md">
                        <Book className="h-4 w-4 mb-1 opacity-50" />
                        <span>{t('teams.card.noProjects')}</span>
                        <Button
                            variant="link"
                            size="sm"
                            className="h-8 mt-1 text-xs"
                            onClick={onCreateProject}
                        >
                            {t('teams.card.createFirstProject')}
                        </Button>
                    </div>
                )}
            </div>
        </CardContent>
    );
}
