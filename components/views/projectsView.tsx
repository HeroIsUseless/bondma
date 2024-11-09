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

export function ProjectsView() {
  const [projects, setProjects] = useAtom(projectsAtom);

  return (
    <Tabs defaultValue="projects" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="projects">项目</TabsTrigger>
        <TabsTrigger value="setting">设置</TabsTrigger>
      </TabsList>
      <TabsContent value="projects">
        <div className="flex">
          <Input />
          <Button>+添加</Button>
        </div>
        <div className="flex">
          {projects.map(project => <>
            <div className="bg-red-500 w-[300px] h-[120px] m-[10px]">
              {project.name}
            </div>
          </>)}
        </div>
      </TabsContent>
      <TabsContent value="setting">setting</TabsContent>
    </Tabs>);
}
