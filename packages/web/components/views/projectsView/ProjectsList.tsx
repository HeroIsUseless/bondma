import { Input } from "@/components/ui/input";
import { Project } from "@/jotai/types";
import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { NewProjectDialog } from "../teamsView/newProjectDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProjectsListProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  onCreateProject: (project: Project) => void;
  teamId?: string; // 添加teamId属性
}

export function ProjectsList({ projects, onProjectClick, onCreateProject, teamId }: ProjectsListProps) {
  const t = useTranslations("projects");
  const [searchText, setSearchText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredProjects = projects.filter(project => {
    const searchLower = searchText.toLowerCase();
    return project.name.toLowerCase().includes(searchLower) || 
           (project.description && project.description.toLowerCase().includes(searchLower));
  });

  return (
    <>
      <div className="flex mb-4">
        <Input 
          className="flex-grow mr-2" 
          placeholder={t("searchPlaceholder")}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          {t("newProject")}
        </Button>
        <NewProjectDialog 
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onProjectCreated={onCreateProject}
          teamId={teamId ?? ''}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, i) => (
            <ProjectCard 
              key={i} 
              project={project} 
              onClick={onProjectClick} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            {t("noMatchingProjects")}
          </div>
        )}
      </div>
    </>
  );
}
