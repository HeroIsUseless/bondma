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
import { useAtom } from "jotai";
import { projectsAtom } from "@/store/atoms";
import { HeaderView } from "@/components/views/headerVIew";
import { ProjectsView } from "@/components/views/projectsView";
import { ProjectView } from "@/components/views/projectView";

export default function Home() {
  return (
    <main className="flex w-full min-h-screen flex-col items-center">
      <HeaderView />
      <div className="flex w-full items-center">
        <ProjectsView />
        <ProjectView /> 
      </div>
    </main>
  );
}
