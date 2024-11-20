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
import { nowProjectAtom, nowTeamAtom, projectsAtom, userAtom } from "@/store/atoms";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export function HeaderView() {
    const nowTeam = useAtomValue(nowTeamAtom);
    const nowProject = useAtomValue(nowProjectAtom);
    const user = useAtomValue(userAtom);
    return (
        <header className="flex w-full h-[64px] items-center justify-between bg-red-100">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">公司</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Slash />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/components">团队</BreadcrumbLink>
                    </BreadcrumbItem>
                    {nowProject && <>
                        <BreadcrumbSeparator>
                            <Slash />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1">
                                    项目1
                                    <ChevronDownIcon />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem>项目2</DropdownMenuItem>
                                    <DropdownMenuItem>项目3</DropdownMenuItem>
                                    <DropdownMenuItem>项目4</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem>
                    </>}
                </BreadcrumbList>
            </Breadcrumb>
            <div id="header-right" className="flex">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p>{user.name}</p>
            </div>
        </header>
    )
}
