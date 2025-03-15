'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { teamsAtom, projectsAtom } from "@/jotai";
import { User as UserType } from "@/jotai/types";
import { getUserById } from "@/api/user";
import { useAuth } from "@/lib/auth/auth-context";
import { useAtomValue } from "jotai";
import { 
  AtSign, 
  Calendar, 
  Edit2, 
  ExternalLink, 
  Github, 
  Globe, 
  Layers,
  MessageSquare, 
  MoreHorizontal, 
  Users 
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Lock, Bell, User } from "lucide-react";

export default function UserView() {
  const { userId } = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const teams = useAtomValue(teamsAtom);
  const projects = useAtomValue(projectsAtom);
  const t = useTranslations();
  
  // Get user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Call API to get user information
        const userData = await getUserById(userId as string);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("无法获取用户信息");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId, currentUser]);
  
  // Check if this is the user's own profile page
  const isOwnProfile = currentUser?.userId === userId;
  
  // Display loading state if loading
  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 rounded-full bg-muted animate-pulse mb-4"></div>
          <div className="h-8 w-48 bg-muted animate-pulse rounded-md mb-4"></div>
          <div className="h-4 w-72 bg-muted animate-pulse rounded-md"></div>
        </div>
      </div>
    );
  }
  
  // Display error message if user doesn't exist
  if (!user) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-3xl font-bold mb-4">{t('user.userNotExist')}</h1>
          <p className="text-muted-foreground mb-6">{t('user.userNotFound')}</p>
          <Button onClick={() => router.push('/')}>{t('user.backToHome')}</Button>
        </div>
      </div>
    );
  }
  
  // User activity data (mocked)
  const userActivities = [
    {
      id: 1,
      type: 'project_created',
      title: t('user.projectCreated'),
      projectName: 'Website Localization',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 2,
      type: 'team_joined',
      title: t('user.teamJoined'),
      teamName: 'Frontend Team',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: 3,
      type: 'translation_completed',
      title: t('user.translationCompleted'),
      projectName: 'Mobile App',
      count: 24,
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
  ];
  
  // Mocked user team data
  const userTeams = teams.filter((_, index) => index < 3); // For demonstration, show max 3 teams
  
  // Mocked user project data
  const userProjects = projects.filter((_, index) => index < 4); // For demonstration, show max 4 projects
  
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      {/* User info top card */}
      <Card className="mb-8 border-none shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <Avatar className="w-24 h-24 border-4 border-background">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mt-2">
                    <AtSign className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>{t('user.joinedAt', { date: new Date(user.createdAt || 0).toLocaleDateString() })}</span>
                  </div>
                </div>
                
                {isOwnProfile && (
                  <Button className="self-start" onClick={() => router.push('/settings/profile')}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    {t('user.editProfile')}
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {t('user.teamsCount', { count: userTeams.length })}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  {t('user.projectsCount', { count: userProjects.length })}
                </Badge>
                {isOwnProfile && (
                  <Badge variant="outline" className="flex items-center gap-1 cursor-pointer" onClick={() => router.push('/settings/integrations')}>
                    <Github className="h-3 w-3" />
                    {t('user.connectGitHub')}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Main content tabs */}
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">{t('user.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="teams">{t('user.tabs.teams')}</TabsTrigger>
          <TabsTrigger value="projects">{t('user.tabs.projects')}</TabsTrigger>
          {isOwnProfile && <TabsTrigger value="settings">{t('user.tabs.settings')}</TabsTrigger>}
        </TabsList>
        
        {/* Overview tab content */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Activity records */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('user.recentActivity')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userActivities.length > 0 ? (
                    userActivities.map(activity => (
                      <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0">
                        <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center flex-shrink-0">
                          {activity.type === 'project_created' && <Layers className="h-5 w-5 text-primary" />}
                          {activity.type === 'team_joined' && <Users className="h-5 w-5 text-primary" />}
                          {activity.type === 'translation_completed' && <Globe className="h-5 w-5 text-primary" />}
                        </div>
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.type === 'project_created' && t('user.projectName', { name: activity.projectName })}
                            {activity.type === 'team_joined' && t('user.teamName', { name: activity.teamName })}
                            {activity.type === 'translation_completed' && 
                              t('user.translationCount', { 
                                count: activity.count, 
                                project: activity.projectName 
                              })
                            }
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.date.toLocaleDateString()} {activity.date.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      {t('user.noActivities')}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              {/* Personal statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('user.statistics')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t('user.teamsJoined')}</span>
                    <span className="font-medium">{userTeams.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t('user.projectsJoined')}</span>
                    <span className="font-medium">{userProjects.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t('user.translationsCompleted')}</span>
                    <span className="font-medium">284</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t('user.activeDays')}</span>
                    <span className="font-medium">42</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Contact information */}
              {isOwnProfile && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('user.contactInfo')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <AtSign className="h-4 w-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <Button variant="outline" size="sm">
                        {t('user.addSocialAccount')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Teams tab content */}
        <TabsContent value="teams">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTeams.length > 0 ? (
              userTeams.map(team => (
                <Card key={team.id} className="cursor-pointer hover:shadow-md transition-shadow" 
                      onClick={() => router.push(`/teams/${team.id}`)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center justify-between">
                      {team.name}
                      <Button variant="ghost" size="icon" className="rounded-full" onClick={(e) => { 
                        e.stopPropagation();
                        // Handle more actions
                      }}>
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      {t('user.createdOn', { date: new Date(team.createdAt || 0).toLocaleDateString() })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {t('user.members', { count: team.memberships?.length || 0 })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">{t('user.noTeams')}</h3>
                <p className="text-muted-foreground mb-6">
                  {isOwnProfile ? t('user.noTeamsJoined') : t('user.userHasNoTeams')}
                </p>
                {isOwnProfile && (
                  <Button onClick={() => router.push('/teams/new')}>
                    {t('user.createNewTeam')}
                  </Button>
                )}
              </div>
            )}
            
            {isOwnProfile && userTeams.length > 0 && (
              <Card className="border-dashed flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                   onClick={() => router.push('/teams/new')}>
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">{t('user.createNewTeam')}</h3>
                <p className="text-sm text-muted-foreground text-center">
                  {t('user.createTeamForProject')}
                </p>
              </Card>
            )}
          </div>
        </TabsContent>
        
        {/* Projects tab content */}
        <TabsContent value="projects">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProjects.length > 0 ? (
              userProjects.map(project => (
                <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => router.push(`/projects/${project.id}`)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center justify-between">
                      {project.name}
                      <Button variant="ghost" size="icon" className="rounded-full" onClick={(e) => {
                        e.stopPropagation();
                        // Handle more actions
                      }}>
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {t('user.languages', { count: project.languages?.length || 1 })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {project.description || t('user.noProjectDescription')}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <Badge variant="secondary">{project.defaultLang || 'zh-CN'}</Badge>
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <Layers className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">{t('user.noProjects')}</h3>
                <p className="text-muted-foreground mb-6">
                  {isOwnProfile ? t('user.noProjectsJoined') : t('user.userHasNoProjects')}
                </p>
                {isOwnProfile && (
                  <Button onClick={() => router.push('/projects/new')}>
                    {t('user.createNewProject')}
                  </Button>
                )}
              </div>
            )}
            
            {isOwnProfile && userProjects.length > 0 && (
              <Card className="border-dashed flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                   onClick={() => router.push('/projects/new')}>
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">{t('user.createNewProject')}</h3>
                <p className="text-sm text-muted-foreground text-center">
                  {t('user.startNewTranslationProject')}
                </p>
              </Card>
            )}
          </div>
        </TabsContent>
        
        {/* Settings tab content - only visible to the user themselves */}
        {isOwnProfile && (
          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Profile settings */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push('/settings/profile')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {t('user.settings.profile')}
                  </CardTitle>
                  <CardDescription>
                    {t('user.settings.profileDesc')}
                  </CardDescription>
                </CardHeader>
              </Card>
              
              {/* Security settings */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push('/settings/security')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    {t('user.settings.security')}
                  </CardTitle>
                  <CardDescription>
                    {t('user.settings.securityDesc')}
                  </CardDescription>
                </CardHeader>
              </Card>
              
              {/* Integration settings */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push('/settings/integrations')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    {t('user.settings.integrations')}
                  </CardTitle>
                  <CardDescription>
                    {t('user.settings.integrationsDesc')}
                  </CardDescription>
                </CardHeader>
              </Card>
              
              {/* Notification settings */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push('/settings/notifications')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    {t('user.settings.notifications')}
                  </CardTitle>
                  <CardDescription>
                    {t('user.settings.notificationsDesc')}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
