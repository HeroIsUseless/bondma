'use client'
import { useMemo } from "react";
import { Project } from "@/jotai/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, FileText, Globe, Percent, TagIcon, User, Users } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProjectOverviewTabProps {
    project: Project | null;
}

export function ProjectOverviewTab({ project }: ProjectOverviewTabProps) {
    const t = useTranslations('project.overview');
    
    // Calculate project statistics
    const projectStats = useMemo(() => {
        if (!project) return {
            totalTokens: 0,
            languages: [],
            completionRate: 0,
            tags: [],
            lastUpdated: t('today'),
            teamMembers: 0
        };

        const tokens = project.tokens || [];
        const languages = project.languages || [];
        
        // Calculate translation progress
        let totalTranslations = 0;
        let completedTranslations = 0;
        
        tokens.forEach(token => {
            const expectedTranslations = languages.length;
            totalTranslations += expectedTranslations;
            completedTranslations += token.translations.length;
        });
        
        const completionRate = totalTranslations > 0 
            ? Math.round((completedTranslations / totalTranslations) * 100) 
            : 0;
            
        // Collect all tags
        const allTags = new Set<string>();
        tokens.forEach(token => {
            token.tags.forEach(tag => allTags.add(tag));
        });
        
        // Get team member count
        const teamMembers = project.memberIds?.length || 0;
        
        // Mock last updated time
        const lastUpdated = t('today');
        
        return {
            totalTokens: tokens.length,
            languages,
            completionRate,
            tags: Array.from(allTags),
            lastUpdated,
            teamMembers
        };
    }, [project, t]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{project?.name}</h1>
                    <p className="text-gray-600">{project?.description || t('noDescription')}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('documentCount')}</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{projectStats.totalTokens}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('documentCountDesc')}
                        </p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('supportedLanguages')}</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{projectStats.languages.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {projectStats.languages.join(', ')}
                        </p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('translationProgress')}</CardTitle>
                        <Percent className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{projectStats.completionRate}%</div>
                        <Progress className="mt-2" value={projectStats.completionRate} />
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('teamMembers')}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{projectStats.teamMembers}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('teamMembersDesc')}
                        </p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('recentActivity')}</CardTitle>
                        <CardDescription>{t('recentActivityDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center">
                            <div className="mr-4 rounded-full h-10 w-10 bg-blue-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600"/>
                            </div>
                            <div>
                                <p className="text-sm font-medium">{t('userAddedNewToken')}</p>
                                <p className="text-xs text-muted-foreground">{t('hourAgo', { count: 1 })}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="mr-4 rounded-full h-10 w-10 bg-green-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-green-600"/>
                            </div>
                            <div>
                                <p className="text-sm font-medium">{t('userCompletedTranslations', { count: 3 })}</p>
                                <p className="text-xs text-muted-foreground">{t('hourAgo', { count: 3 })}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="mr-4 rounded-full h-10 w-10 bg-purple-100 flex items-center justify-center">
                                <Users className="h-5 w-5 text-purple-600"/>
                            </div>
                            <div>
                                <p className="text-sm font-medium">{t('newMemberJoined')}</p>
                                <p className="text-xs text-muted-foreground">{t('dayAgo', { count: 1 })}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>{t('projectInfo')}</CardTitle>
                        <CardDescription>{t('projectInfoDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                                <span className="text-sm">{t('lastUpdated')}</span>
                            </div>
                            <span className="text-sm font-medium">{projectStats.lastUpdated}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <TagIcon className="h-4 w-4 text-muted-foreground mr-2" />
                                <span className="text-sm">{t('tagCount')}</span>
                            </div>
                            <span className="text-sm font-medium">{projectStats.tags.length}</span>
                        </div>
                        <div>
                            <div className="flex items-center mb-2">
                                <TagIcon className="h-4 w-4 text-muted-foreground mr-2" />
                                <span className="text-sm">{t('commonTags')}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {projectStats.tags.slice(0, 5).map((tag, index) => (
                                    <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-lg text-xs">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
