'use client'

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useHooks } from "./useHooks";
import { CreateTeamDialog } from "./CreateTeamDialog";
import { EmptyTeamsView } from "./EmptyTeamsView";
import { TeamView } from "./teamCard/index";
import { LoadingTeamsView } from "./LoadingTeamsView";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function TeamsView() {
    const {
        teams,
        newTeamName,
        newTeamUrl,
        teamDialogOpen,
        loading,
        loadingTeamId,
        setNewTeamName,
        setNewTeamUrl,
        setTeamDialogOpen,
        handleSelectTeam,
        handleCreateTeam,
        handleDeleteTeam,
        handleViewTeamMembers,
        router,
        loadTeams,
        toast
    } = useHooks();
    const t = useTranslations();

    useEffect(() => {
        loadTeams().catch(error => {
            toast({
                title: t("teams.loadFailed"),
                description: error instanceof Error ? error.message : t("teams.loadFailedDescription"),
                variant: "destructive"
            });
        });
    }, []);
    
    return (
        <div className="container mx-auto py-10 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t("teams.title")}</h2>
                <Button onClick={() => setTeamDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t("teams.createTeam")}
                </Button>
            </div>

            {loading && <LoadingTeamsView />}

            {!loading && !teams.length && (
                <EmptyTeamsView onCreateTeamClick={() => setTeamDialogOpen(true)} />
            )}

            {!loading && !!teams.length && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map((team) => (
                        <TeamView
                            key={team.id}
                            team={team}
                            handleSelectTeam={handleSelectTeam}
                            handleDeleteTeam={handleDeleteTeam}
                            handleViewTeamMembers={handleViewTeamMembers}
                            loadingTeamId={loadingTeamId}
                            router={router}
                        />
                    ))}
                </div>
            )}

            <CreateTeamDialog
                isOpen={teamDialogOpen}
                onOpenChange={setTeamDialogOpen}
                newTeamName={newTeamName}
                newTeamUrl={newTeamUrl}
                onNewTeamNameChange={setNewTeamName}
                onNewTeamUrlChange={setNewTeamUrl}
                onCreateTeam={handleCreateTeam}
                isLoading={loading}
            />
        </div>
    );
}
