'use client'
import Image from "next/image";
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDownIcon, Slash } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Project } from "@/store/types";
import { useAtom, useAtomValue } from "jotai";
import { nowProjectAtom, nowTeamAtom, projectsAtom } from "@/store/atoms";
import { HeaderView } from "@/components/views/headerView";
import { ProjectsView } from "@/components/views/projectsView";
import { ProjectView } from "@/components/views/projectView";

export default function Home() {
  const nowTeam = useAtomValue(nowTeamAtom);
  const nowProject = useAtomValue(nowProjectAtom);
  return (
    <main className="flex w-full min-h-screen flex-col items-center">
      <HeaderView />
      <div className="flex w-full items-center">
        {(!nowProject?.id) && <ProjectsView />}
        {(!!nowProject?.id) && <ProjectView />}
      </div>
    </main>
  );
}
