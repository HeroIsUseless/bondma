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
import { nowProjectAtom, projectsAtom } from "@/store/atoms";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export function ProjectView() {
    const [nowProject, setNowProject] = useAtom(nowProjectAtom);

    return (
        <Tabs defaultValue="account" className="w-[400px]">
            <TabsList>
                <TabsTrigger value="account">项目</TabsTrigger>
                <TabsTrigger value="password">设置</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <div className="justify-content-between flex items-center">
                    <h1 className="mr-auto">文案</h1>
                    <Button className="ml-auto">添加</Button>
                </div>

                <div className="flex">
                    <Input />
                    <Button>搜索kk</Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>*</TableHead>
                            <TableHead className="w-[100px]">key</TableHead>
                            <TableHead>Chinese</TableHead>
                            <TableHead>English</TableHead>
                            <TableHead className="text-right">*</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {nowProject?.tokens.map(token => {
                            return <>
                                <TableRow>
                                    <TableCell className="font-medium">{token.key}</TableCell>
                                    {token.translations.map(translation => {
                                        return <TableCell>
                                            {translation.text}
                                        </TableCell>
                                    })}
                                    <TableCell className="text-right">$250.00</TableCell>
                                </TableRow>
                            </>
                        })}
                    </TableBody>
                </Table>

                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>

            </TabsContent>
            <TabsContent value="password">Change</TabsContent>
        </Tabs>
    );
}
