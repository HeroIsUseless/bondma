'use client'

import {
    createTeam,
    deleteTeam,
    fetchMyTeams,
    getTeamById,
    getTeamMembers,
    updateTeam
} from "@/api/team";
import { useToast } from "@/components/ui/use-toast";
import { nowTeamAtom, teamsAtom } from "@/jotai";
import { Team } from "@/jotai/types";
import { useAuth } from "@/lib/auth/auth-context";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Team operation hook
export const useHooks = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [newTeamName, setNewTeamName] = useState("");
    const [newTeamUrl, setNewTeamUrl] = useState("");
    const [teamDialogOpen, setTeamDialogOpen] = useState(false);
    const [teams, setTeams] = useAtom(teamsAtom);
    const [nowTeam, setNowTeam] = useAtom(nowTeamAtom);
    const [loading, setLoading] = useState(true);
    const [loadingTeamId, setLoadingTeamId] = useState<string | null>(null);
    
    // Load team list
    const loadTeams = async () => {
        try {
            setLoading(true);
            const teamsData = await fetchMyTeams();
            setTeams(teamsData);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };
    
    // Select team
    const handleSelectTeam = async (team: Team) => {
        try {
            setLoadingTeamId(team.id);
            const teamDetail = await getTeamById(team.id);
            setNowTeam(teamDetail);
            router.push(`/team/${team.id}`);
        } catch (error) {
            toast({
                title: "Failed to select team",
                description: error instanceof Error ? error.message : "Unable to load team details",
                variant: "destructive"
            });
        } finally {
            setLoadingTeamId(null);
        }
    };

    // Create team
    const handleCreateTeam = async () => {
        if (!user) {
            toast({
                title: "Error",
                description: "Not logged in, please login first",
                variant: "destructive"
            });
            return;
        }

        if (!newTeamName.trim()) {
            toast({
                title: "Error",
                description: "Team name cannot be empty",
                variant: "destructive"
            });
            return;
        }

        try {
            setLoading(true);
            const newTeam = await createTeam({name: newTeamName});
            
            setTeams([...teams, newTeam]);
            setNewTeamName("");
            setNewTeamUrl("");
            setTeamDialogOpen(false);
            setNowTeam(newTeam);
            
            toast({
                title: "Team created",
                description: `Team ${newTeam.name} created successfully`,
            });
            
            router.push(`/team/${newTeam.id}`);
        } catch (error) {
            toast({
                title: "Creation failed",
                description: error instanceof Error ? error.message : "Unable to create team",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    // Delete team
    const handleDeleteTeam = async (id: string) => {
        if (!confirm("Are you sure you want to delete this team? This action cannot be undone.")) {
            return;
        }
        
        try {
            setLoadingTeamId(id);
            await deleteTeam(id);
            
            const updatedTeams = teams.filter(team => team.id !== id);
            setTeams(updatedTeams);

            if (nowTeam && nowTeam.id === id) {
                setNowTeam(null);
            }

            toast({
                title: "Team deleted",
                description: "Team has been successfully deleted",
            });
        } catch (error) {
            toast({
                title: "Deletion failed",
                description: error instanceof Error ? error.message : "Unable to delete team",
                variant: "destructive"
            });
        } finally {
            setLoadingTeamId(null);
        }
    };

    // View team members
    const handleViewTeamMembers = async (teamId: string) => {
        try {
            setLoadingTeamId(teamId);
            await getTeamMembers(teamId);
            router.push(`/teams/${teamId}/members`);
        } catch (error) {
            toast({
                title: "Failed to get members",
                description: error instanceof Error ? error.message : "Unable to load team members",
                variant: "destructive"
            });
        } finally {
            setLoadingTeamId(null);
        }
    };

    return {
        teams,
        nowTeam,
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
        toast,
        router,
        loadTeams
    };
};
