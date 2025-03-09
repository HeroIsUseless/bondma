"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TeamPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to teams page
    router.replace("/teams");
  }, []);

  return null;
}
