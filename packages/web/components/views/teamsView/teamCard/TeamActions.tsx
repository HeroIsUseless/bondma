import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Team } from "@/jotai/types";
import { Loader2, Settings, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";

interface TeamActionsProps {
    team: Team;
    nowTeam: Team | null;
    loadingTeamId: string | null;
    onSelectTeam: (team: Team) => void;
    onViewMembers: () => void;
    onEditTeam: () => void;
    onDeleteTeam: (teamId: string) => void;
}

export function TeamActions({
    team, 
    nowTeam,
    loadingTeamId,
    onSelectTeam,
    onViewMembers,
    onEditTeam
}: TeamActionsProps) {
    const t = useTranslations();
    
    return (
        <CardFooter className="flex-col items-stretch gap-2">
            <div className="flex justify-between w-full">
                <Button
                    variant={nowTeam?.id === team.id ? "secondary" : "outline"}
                    onClick={() => onSelectTeam(team)}
                    disabled={loadingTeamId === team.id}
                    className="flex-1 mr-2"
                >
                    {loadingTeamId === team.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : t('teams.card.enterTeam')}
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onViewMembers}
                    title={t('teams.card.viewMembers')}
                    className="mr-2"
                >
                    <UserPlus className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onEditTeam}
                    title={t('teams.card.editTeam')}
                    className="mr-2"
                >
                    <Settings className="h-4 w-4" />
                </Button>
            </div>
        </CardFooter>
    );
}
