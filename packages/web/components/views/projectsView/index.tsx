'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAtom } from "jotai";
import { nowProjectAtom, nowTeamAtom, projectsAtom, teamsAtom } from "@/jotai";
import { TeamSettingsView } from "./teamSettingsView";
import { ProjectsList } from "./ProjectsList";
import { Project } from "@/jotai/types";
import { useEffect } from "react";
import { getTeamProjects } from "@/api/project";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function ProjectsView() {
  const t = useTranslations("projects");
  const [projects, setProjects] = useAtom(projectsAtom);
  const [nowProject, setNowProject] = useAtom(nowProjectAtom);
  const [teams] = useAtom(teamsAtom);
  const [nowTeam, setNowTeam] = useAtom(nowTeamAtom);
  const router = useRouter();
  
  // 当当前团队变化时，获取该团队的所有项目
  useEffect(() => {
    if (nowTeam?.id) {
      // 加载当前团队的项目
      const loadTeamProjects = async () => {
        try {
          const teamProjects = await getTeamProjects(nowTeam.id);
          setProjects(teamProjects);
        } catch (error) {
          console.error("获取团队项目失败:", error);
        }
      };
      
      loadTeamProjects();
    } else {
      // 如果没有选择团队，清空项目列表
      setProjects([]);
    }
  }, [nowTeam, setProjects]);
  
  const handleProjectClick = (project: Project) => {
    setNowProject(project);
    // 跳转到项目详情页
    router.replace(`/project/${project.id}`);
  };

  const handleCreateProject = (project: Project) => {
    setProjects([...projects, project]);
  };

  return (
    <Tabs defaultValue="projects" className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg mt-6">
      <TabsList className="mb-4 grid grid-cols-2 gap-2">
        <TabsTrigger value="projects">{t("tabs.projects")}</TabsTrigger>
        <TabsTrigger value="setting">{t("tabs.settings")}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="projects">
        <ProjectsList 
          projects={projects}
          onProjectClick={handleProjectClick}
          onCreateProject={handleCreateProject}
          teamId={nowTeam?.id}
        />
      </TabsContent>
      
      <TabsContent value="setting">
        <TeamSettingsView />
      </TabsContent>
    </Tabs>
  );
}
