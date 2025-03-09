'use client'

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { LanguageSelector } from "@/components/ui/language-selector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Book, Code, Github, Globe2, Layers, Lock, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function WelcomeView() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const t = useTranslations();
    
    // 添加对下一个section的引用
    const featuresRef = useRef<HTMLElement>(null);
    
    // 检查用户是否已登录
    useEffect(() => {
        // 这里可以实际检查用户登录状态，例如从localStorage或cookie中获取token
        // 或者调用API检查session有效性
        const checkLoginStatus = () => {
            // 示例: 检查localStorage中是否有token
            const token = localStorage.getItem('userToken');
            setIsLoggedIn(!!token);
        };
        
        checkLoginStatus();
    }, []);
    
    // 处理开始使用按钮点击
    const handleGetStarted = () => {
        if (isLoggedIn) {
            router.push('/teams');
        } else {
            router.push('/login');
        }
    };

    // 处理教程按钮点击
    const handleTutorial = () => {
        router.push('/tutorial');
    };

    // 使用i18n获取功能列表
    const features = [
        {
            icon: <Globe2 className="h-8 w-8 text-primary" />,
            title: t('features.items.0.title'),
            description: t('features.items.0.description')
        },
        {
            icon: <Users className="h-8 w-8 text-primary" />,
            title: t('features.items.1.title'),
            description: t('features.items.1.description')
        },
        {
            icon: <Layers className="h-8 w-8 text-primary" />,
            title: t('features.items.2.title'),
            description: t('features.items.2.description')
        },
        {
            icon: <Code className="h-8 w-8 text-primary" />,
            title: t('features.items.3.title'),
            description: t('features.items.3.description')
        },
        {
            icon: <Lock className="h-8 w-8 text-primary" />,
            title: t('features.items.4.title'),
            description: t('features.items.4.description')
        },
        {
            icon: <Github className="h-8 w-8 text-primary" />,
            title: t('features.items.5.title'),
            description: t('features.items.5.description')
        }
    ];

    // 工作流程数据从i18n获取 - 修改获取嵌套翻译的方式
    const workflows = [
        {
            title: t('workflow.steps.import.title'),
            description: t('workflow.steps.import.description'),
            steps: [
                t('workflow.steps.import.steps.0'),
                t('workflow.steps.import.steps.1'),
                t('workflow.steps.import.steps.2')
            ]
        },
        {
            title: t('workflow.steps.translate.title'),
            description: t('workflow.steps.translate.description'),
            steps: [
                t('workflow.steps.translate.steps.0'),
                t('workflow.steps.translate.steps.1'),
                t('workflow.steps.translate.steps.2'),
                t('workflow.steps.translate.steps.3')
            ]
        },
        {
            title: t('workflow.steps.export.title'),
            description: t('workflow.steps.export.description'),
            steps: [
                t('workflow.steps.export.steps.0'),
                t('workflow.steps.export.steps.1'),
                t('workflow.steps.export.steps.2')
            ]
        }
    ];

    return (
        <div className="container mx-auto py-10 px-4 md:px-6">

            {/* 英雄部分 */}
            <section className="flex flex-col md:flex-row items-center justify-between gap-8 py-10 md:py-16">
                <div className="flex-1 space-y-6">
                    <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                        {t('welcome.tagline')}
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl" >
                            {t.rich('welcome.title', {
                                span: (chunks) => <span>{chunks}</span>
                            })}
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        {t('welcome.description')}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button size="lg" onClick={handleGetStarted}>
                            {t('welcome.getStarted')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="lg" onClick={handleTutorial}>
                            {t('welcome.learnMore')}
                        </Button>
                    </div>
                </div>
                <div className="flex-1 relative">
                    <div className="relative h-[350px] w-full overflow-hidden rounded-lg shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-background"></div>
                        <Image 
                            src="/fanyi.webp" 
                            alt="Bondma 界面预览"
                            sizes="(min-width: 768px) 50vw, 100vw"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </section>

            {/* 特点部分 */}
            <section ref={featuresRef} className="py-16 bg-muted/30 rounded-2xl my-16 px-6" id="features">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">{t('features.title')}</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t('features.description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-none shadow-md hover:shadow-xl transition-all">
                            <CardHeader>
                                <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-4">
                                    {feature.icon}
                                </div>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* 工作流程部分 */}
            <section className="py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">{t('workflow.title')}</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t('workflow.description')}
                    </p>
                </div>

                <Tabs defaultValue="import" className="max-w-3xl mx-auto">
                    <TabsList className="grid grid-cols-3 mb-8">
                        <TabsTrigger value="import">{t('workflow.tabs.import')}</TabsTrigger>
                        <TabsTrigger value="translate">{t('workflow.tabs.translate')}</TabsTrigger>
                        <TabsTrigger value="export">{t('workflow.tabs.export')}</TabsTrigger>
                    </TabsList>
                    {workflows.map((workflow, i) => (
                        <TabsContent key={i} value={["import", "translate", "export"][i]}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">{workflow.title}</CardTitle>
                                    <CardDescription>
                                        {workflow.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-4">
                                        {workflow.steps.map((step, j) => (
                                            <li key={j} className="flex items-start">
                                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs mr-3">
                                                    {j+1}
                                                </span>
                                                <span className="text-lg">{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={handleTutorial} variant="outline" className="w-full">
                                        {t('workflow.viewDocs')}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            </section>

            {/* 案例研究部分 */}
            <section className="py-16 bg-muted/30 rounded-2xl my-16 px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">{t('cases.title')}</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t('cases.description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="overflow-hidden">
                        <div className="h-48 bg-gradient-to-r from-primary to-purple-600"></div>
                        <CardHeader>
                            <CardTitle>{t('cases.case1.title')}</CardTitle>
                            <CardDescription>{t('cases.case1.subtitle')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {t('cases.case1.quote')}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="link" className="px-0">
                                {t('cases.case1.readMore')}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="overflow-hidden">
                        <div className="h-48 bg-gradient-to-r from-amber-500 to-red-500"></div>
                        <CardHeader>
                            <CardTitle>{t('cases.case2.title')}</CardTitle>
                            <CardDescription>{t('cases.case2.subtitle')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {t('cases.case2.quote')}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="link" className="px-0">
                                {t('cases.case2.readMore')}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </section>

            {/* 号召行动 */}
            <section className="py-20 text-center">
                <h2 className="text-3xl font-bold mb-6">{t('cta.title')}</h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    {t('cta.description')}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Button size="lg" className="px-8" onClick={handleGetStarted}>
                        {t('cta.register')}
                    </Button>
                    <Button onClick={handleTutorial} variant="outline" size="lg" className="px-8">
                        {t('cta.demo')}
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                    {t('cta.note')}
                </p>
            </section>
        </div>
    );
}
