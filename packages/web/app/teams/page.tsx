"use client";

import { LoadingView } from "@/components/views/loadingView";
import TeamsView from "@/components/views/teamsView";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TeamsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LoadingView />;
  }

  return <TeamsView />;
}
