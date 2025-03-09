import { Project } from "@/jotai/types";
import { useTranslations } from "next-intl";

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const t = useTranslations("projects");
  
  return (
    <div 
      onClick={() => onClick(project)} 
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
    >
      <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
      <div className="text-gray-600 mb-1">
        {project.languages?.join('，') || t("noLanguages")}
      </div>
      <div className="text-gray-600 mb-2">
        {t("tokensCount", { count: project.tokens?.length || 0 })}
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500" 
          style={{ width: `${(project.tokens?.length || 0) > 100 ? 100 : (project.tokens?.length || 0)}%` }}
        ></div>
      </div>
    </div>
  );
}
