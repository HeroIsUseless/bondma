import { CardContent } from "@/components/ui/card";
import { Folder, Users } from "lucide-react";
import { useTranslations } from "next-intl";

interface TeamStatsProps {
    memberCount: number;
    projectCount: number;
}

export function TeamStats({ memberCount, projectCount }: TeamStatsProps) {
    const t = useTranslations();
    
    return (
        <CardContent>
            <div className="flex items-center justify-between mb-3 pb-2 border-b">
                <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-3 w-3 inline mr-1" />
                    {t('teams.card.membersCount', { count: memberCount })}
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                    <Folder className="h-3 w-3 inline mr-1" />
                    {t('teams.card.projectsCount', { count: projectCount })}
                </div>
            </div>
        </CardContent>
    );
}
