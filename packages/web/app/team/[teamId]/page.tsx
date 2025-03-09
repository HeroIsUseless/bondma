"use client";

import { useAuth } from "../../../lib/auth/auth-context";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { LoadingView } from "../../../components/views/loadingView";
import { nowProjectAtom, nowTeamAtom } from "@/jotai";
import { useAtom } from "jotai";
import { ProjectsView } from "../../../components/views/projectsView";
import NoPermissionView from "../../../components/views/noPermissionView";
import { checkTeamPermission, getTeamById } from "@/api/team";
import { useTranslations } from "next-intl";

export default function TeamDetailPage() {
  const [nowTeam, setNowTeam] = useAtom(nowTeamAtom);
  const [nowProject, setNowProject] = useAtom(nowProjectAtom);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);
  const t = useTranslations();
  
  const teamId = (params.teamId as string) || "";

  const check = async () => {
    try {
        const response = await checkTeamPermission(teamId);
        if (response) {
          // Get current team based on teamId
          const team = await getTeamById(teamId);
          setNowTeam(team);
          setHasPermission(true);
        } else {
          setHasPermission(false);
        }
    } catch (error) {
        console.error("Permission check failed:", error);
        setHasPermission(false);
      } finally {
        setIsCheckingPermission(false);
      }
  }
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
    check();
  }, [user, isLoading, teamId, setNowTeam]);
  
  if (isLoading || isCheckingPermission) {
    return <LoadingView />;
  }
  
  if (hasPermission === false) {
    return <NoPermissionView teamId={teamId} />;
  }
  
  return <ProjectsView />;
}
