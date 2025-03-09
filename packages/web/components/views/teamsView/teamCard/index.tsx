'use client'

import { getTeamProjects } from "@/api/project";
import { updateTeam } from "@/api/team";
import { nowTeamAtom, teamsAtom } from "@/jotai";
import { Project, Team } from "@/jotai/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";

import { TeamHeader } from "./TeamHeader";
import { TeamStats } from "./TeamStats";
import { TeamProjectsList } from "./TeamProjectsList";
import { TeamActions } from "./TeamActions";
import { TeamProjectsDialog } from "./teamProjectsDialog";
import { NewProjectDialog } from "../newProjectDialog";
import { TeamMembersDialog } from "../teamMembersDialog";
import { EditTeamDialog } from "../EditTeamDialog";
import { Card } from "@/components/ui/card";
import { useTeamProjectsData } from "./useHooks";

export function TeamView(props: {
    team: Team;
    handleSelectTeam: (team: Team) => void;
    handleViewTeamMembers: (teamId: string) => void;
    handleDeleteTeam: (teamId: string) => void;
    loadingTeamId: string | null;
    router: AppRouterInstance;
}) {
    const { team, handleSelectTeam, handleDeleteTeam, loadingTeamId, router } = props;
    const [nowTeam] = useAtom(nowTeamAtom);
    const [teams, setTeams] = useAtom(teamsAtom);
    const t = useTranslations();
    
    // Use custom hook to get project data
    const { projects, setProjects, isLoading } = useTeamProjectsData(team.id);
    
    // Dialog states
    const [showProjectsDialog, setShowProjectsDialog] = useState(false);
    const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
    const [showMembersDialog, setShowMembersDialog] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [teamName, setTeamName] = useState(team.name);
    const [teamUrl, setTeamUrl] = useState(team.url || "");
    const [isUpdating, setIsUpdating] = useState(false);

    const handleNavigateToProject = (projectId: string) => {
        router.push(`/project/${projectId}`);
    };

    // Handle view team members
    const handleViewMembers = () => {
        setShowMembersDialog(true);
    };

    // Internal team update handler
    const handleUpdateTeam = async () => {
        if (!teamName.trim()) {
            return;
        }
        
        try {
            setIsUpdating(true);
            const updatedTeam = await updateTeam(team.id, { name: teamName, url: teamUrl });
            setTeams(teams.map(t => t.id === team.id ? updatedTeam : t));
            setEditDialogOpen(false);
        } catch (error) {
            console.error("Failed to update team:", error);
        } finally {
            setIsUpdating(false);
        }
    };
    
    // Open edit dialog
    const openEditDialog = () => {
        setTeamName(team.name);
        setTeamUrl(team.url || "");
        setEditDialogOpen(true);
    };

    return (
        <>
            <Card key={team.id} className={`${nowTeam?.id === team.id ? 'ring-2 ring-primary' : ''}`}>
                <TeamHeader 
                    name={team.name} 
                    url={team.url} 
                />
                
                <TeamStats 
                    memberCount={team.memberships?.length || 0}
                    projectCount={projects?.length || 0}
                />
                
                <TeamProjectsList 
                    projects={projects}
                    isLoading={isLoading}
                    onViewAllProjects={() => setShowProjectsDialog(true)}
                    onCreateProject={() => setShowNewProjectDialog(true)}
                    onNavigateToProject={handleNavigateToProject}
                />
                
                <TeamActions
                    team={team}
                    nowTeam={nowTeam}
                    loadingTeamId={loadingTeamId}
                    onSelectTeam={handleSelectTeam}
                    onViewMembers={handleViewMembers}
                    onEditTeam={openEditDialog}
                    onDeleteTeam={handleDeleteTeam}
                />
            </Card>

            {/* Dialog components */}
            <TeamProjectsDialog
                isOpen={showProjectsDialog}
                onOpenChange={setShowProjectsDialog}
                team={team}
                projects={projects}
                setProjects={setProjects}
                onNewProject={() => setShowNewProjectDialog(true)}
                onNavigateToProject={handleNavigateToProject}
            />

            <NewProjectDialog
                isOpen={showNewProjectDialog}
                onOpenChange={setShowNewProjectDialog}
                teamId={team.id}
                onProjectCreated={(newProject) => {
                    setProjects([...projects, newProject]);
                }}
            />

            <TeamMembersDialog
                isOpen={showMembersDialog}
                onOpenChange={setShowMembersDialog}
                team={team}
            />

            <EditTeamDialog
                isOpen={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                teamName={teamName}
                teamUrl={teamUrl}
                onTeamNameChange={setTeamName}
                onTeamUrlChange={setTeamUrl}
                onUpdateTeam={handleUpdateTeam}
                isLoading={isUpdating}
            />
        </>
    );
}
