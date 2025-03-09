'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { nowProjectAtom, nowTeamAtom, projectsAtom, teamsAtom } from "@/jotai";
import { Team } from "@/jotai/types";
import { useAuth } from "@/lib/auth/auth-context";
import { useAtom, useAtomValue } from "jotai";
import { ChevronDown, ChevronRight, Github, Globe, Home, LogOut, Settings, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { locales } from "@/i18n/config";
import { getUserLanguage, setUserLanguage } from "@/lib/cookies";
import { useTranslations } from "next-intl";

export function HeaderView() {
    const [projects, setProjects] = useAtom(projectsAtom);
    const [teams, setTeams] = useAtom(teamsAtom);
    const [nowTeam, setNowTeam] = useAtom(nowTeamAtom);
    const [nowProject, setNowProject] = useAtom(nowProjectAtom);
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations();

    const onNowTeamClick = () => {
        setNowProject(null);
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const handleLogin = () => {
        router.push('/login');
    };

    const handleRegister = () => {
        router.push('/register');
    };

    const handleTeamSelect = (team: Team) => {
        // Implement team selection logic
    };

    const onHomeBtnClick = () => {
        setNowTeam(null);
        setNowProject(null);
        router.push('/');
    }

    // Handle language switching
    const handleLanguageChange = (locale: string) => {
        setUserLanguage(locale);
        // Trigger storage event for other components to detect language changes
        window.dispatchEvent(new Event('storage'));
        // No need to navigate through paths, use cookies to complete language switching
    };

    // Get current language
    const getCurrentLocale = () => {
        return getUserLanguage();
    };

    const currentLocale = getCurrentLocale();
    
    return (
        <header className="sticky top-0 z-50 w-full h-[64px] border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between">
            <div className="container flex h-14 items-center">
                <div className="flex items-center space-x-2 text-sm">
                    <Button onClick={onHomeBtnClick} variant="link" className="flex items-center gap-1 p-0 font-normal">
                        <Home className="h-4 w-4" />
                        <span className="font-medium">{t('header.title')}</span>
                    </Button>

                    {!!user && !!nowTeam && (
                        <>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />

                            <DropdownMenu>
                                <Button onClick={onNowTeamClick} variant="link" className="flex items-center gap-1 p-0 font-normal">
                                    {nowTeam?.name}
                                </Button>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-1 p-0 font-normal">
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    {teams.map((team) => (
                                        <DropdownMenuItem
                                            key={team.id}
                                            onClick={() => handleTeamSelect(team)}
                                        >
                                            {team.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}

                    {!!user && !!nowProject && (
                        <>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />

                            <DropdownMenu>
                                <Button variant="link" className="flex items-center gap-1 p-0 font-normal">
                                    {nowProject?.name}
                                </Button>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-1 p-0 font-normal">
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    {projects.map((project) => (
                                        <DropdownMenuItem key={project.id}>
                                            {project.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}
                </div>
            </div>

            <div id="header-right" className="flex items-center mr-8 gap-2">
                {/* GitHub repository link */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full"
                    asChild
                >
                    <Link href="https://github.com/HeroIsUseless/bondma" target="_blank" rel="noopener noreferrer">
                        <Github className="h-[1.2rem] w-[1.2rem]" />
                        <span className="sr-only">{t('header.githubRepo')}</span>
                    </Link>
                </Button>
                
                {/* Language switcher dropdown menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Globe className="h-[1.2rem] w-[1.2rem]" />
                            <span className="sr-only">{t('header.switchLanguage')}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                            onClick={() => handleLanguageChange('zh-CN')}
                            className={currentLocale === 'zh-CN' ? 'bg-muted' : ''}
                        >
                            {t('header.languages.chinese')}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => handleLanguageChange('en-US')}
                            className={currentLocale === 'en-US' ? 'bg-muted' : ''}
                        >
                            {t('header.languages.english')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {isLoading ? (
                    // Loading state
                    <div className="px-4">
                        <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                    </div>
                ) : user ? (
                    // Logged in state: display user avatar and dropdown menu
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 p-1 font-normal">
                                <Avatar>
                                    <AvatarImage src={"https://github.com/shadcn.png"} />
                                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <span>{user?.name || t('header.user')}</span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/user/${user.userId}`)} className="cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                <span>{t('header.profile')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>{t('header.logout')}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    // Not logged in state: display login and register buttons
                    <>
                        <Button variant="ghost" onClick={handleLogin}>
                            <User className="mr-2 h-4 w-4" />
                            {t('header.login')}
                        </Button>
                        <Button onClick={handleRegister}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            {t('header.register')}
                        </Button>
                    </>
                )}
            </div>
        </header>
    )
}
