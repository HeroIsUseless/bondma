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

export function ProjectView() {
    const [projects, setProjects] = useAtom(projectsAtom);

    return (
        <Tabs defaultValue="account" className="w-[400px]">
            <TabsList>
                <TabsTrigger value="account">项目</TabsTrigger>
                <TabsTrigger value="password">设置</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <h1>文案</h1>
                <div className="flex">
                    <Input />
                    <Button>搜索</Button>
                </div>
                <div className="flex">
                    {projects.map(project => <>
                        <div className="bg-red-500">
                            {project.name}
                        </div>
                    </>)}
                </div>
            </TabsContent>
            <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
    );
}
