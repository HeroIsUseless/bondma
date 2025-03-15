'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAtom } from "jotai";
import { nowProjectAtom } from "@/jotai";
import { ProjectOverviewTab } from "@/components/views/projectView/ProjectOverviewTab";
import { ProjectTokensTab } from "@/components/views/projectView/ProjectTokensTab";
import { ProjectImportTab } from "@/components/views/projectView/ProjectImportTab";
import { ProjectExportTab } from "@/components/views/projectView/ProjectExportTab";
import { ProjectSettingTab } from "@/components/views/projectView/ProjectSettingTab";
import { useTranslations } from "next-intl";

export function ProjectView() {
    const [nowProject] = useAtom(nowProjectAtom);
    const t = useTranslations();
    
    return (
        <Tabs defaultValue="overview" className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg mt-6">
            <TabsList className="mb-4 grid grid-cols-5 gap-2">
                <TabsTrigger value="overview" className="px-2 py-1 text-gray-700 hover:text-blue-500 text-sm">{t('project.tabs.overview')}</TabsTrigger>
                <TabsTrigger value="tokens" className="px-2 py-1 text-gray-700 hover:text-blue-500 text-sm">{t('project.tabs.tokens')}</TabsTrigger>
                <TabsTrigger value="import" className="px-2 py-1 text-gray-700 hover:text-blue-500 text-sm">{t('project.tabs.import')}</TabsTrigger>
                <TabsTrigger value="export" className="px-2 py-1 text-gray-700 hover:text-blue-500 text-sm">{t('project.tabs.export')}</TabsTrigger>
                <TabsTrigger value="setting" className="px-2 py-1 text-gray-700 hover:text-blue-500 text-sm">{t('project.tabs.setting')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
                <ProjectOverviewTab project={nowProject} />
            </TabsContent>

            <TabsContent value="tokens">
                <ProjectTokensTab project={nowProject} />
            </TabsContent>
            
            <TabsContent value="import">
                <ProjectImportTab project={nowProject} />
            </TabsContent>
            
            <TabsContent value="export">
                <ProjectExportTab project={nowProject} />
            </TabsContent>
            
            <TabsContent value="setting">
                <ProjectSettingTab project={nowProject} />
            </TabsContent>
        </Tabs>
    );
}
