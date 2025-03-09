
import { getTeamProjects } from "@/api/project";
import { Project } from "@/jotai/types";
import { useEffect, useState } from "react";

export function useTeamProjectsData(teamId: string) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadTeamProjects = async () => {
        try {
            const projectsData = await getTeamProjects(teamId);
            setProjects(projectsData);
        } catch (error) {
            console.error(`join team ${teamId}  project failed:`, error);
            setProjects([]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadTeamProjects();
    }, [teamId]);

    return {
        projects,
        setProjects,
        isLoading,
        refreshProjects: loadTeamProjects
    };
}