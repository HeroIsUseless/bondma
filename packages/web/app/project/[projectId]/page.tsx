"use client";

import { useAuth } from "../../../lib/auth/auth-context";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { LoadingView } from "../../../components/views/loadingView";
import { nowProjectAtom, nowTeamAtom } from "@/jotai";
import { useAtom } from "jotai";
import NoPermissionView from "../../../components/views/noPermissionView";
import { checkTeamPermission, getTeamById } from "@/api/team";
import { ProjectView } from "@/components/views/projectView";
import { checkProjectPermission, getProject } from "@/api/project";
import { useTranslations } from "next-intl";

export default function ProjectPage() {
  const [nowTeam, setNowTeam] = useAtom(nowTeamAtom);
  const [nowProject, setNowProject] = useAtom(nowProjectAtom);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);
  const t = useTranslations();
  
  const projectId = (params.projectId as string) || "";

  const check = async () => {
    if (user && projectId) {
      try {
        // Get project details
        const project = await getProject(projectId);
        setNowProject(project);
        
        // Check if user has permission to access the project
        const hasAccess = await checkProjectPermission(projectId);
        setHasPermission(hasAccess);
      } catch (error) {
        console.error("Failed to check project permission:", error);
        setHasPermission(false);
      } finally {
        setIsCheckingPermission(false);
      }
    }
  };
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
    check();
  }, [user, isLoading, projectId, setNowProject]);
  
  if (isLoading || isCheckingPermission) {
    return <LoadingView />;
  }
  
  if (hasPermission === false) {
    return <NoPermissionView teamId={nowProject?.teamId || ""} />;
  }
  
  return <ProjectView />;
}
