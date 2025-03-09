'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle, Coffee, FileText, Info, Users } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { useTranslations } from "next-intl";

export default function TutorialPage() {
    // Get translation function
    const t = useTranslations('tutorial');
    const [currentSection, setCurrentSection] = useState("getting-started");
    const sectionRefs = useRef<{[key: string]: HTMLElement | null}>({});

    // Tutorial data structure using i18n
    const tutorialSections = [
        {
            id: "getting-started",
            title: t('sections.gettingStarted.title'),
            icon: <CheckCircle className="h-5 w-5 text-primary mr-2" />,
            content: [
                {
                    title: t('sections.gettingStarted.overview.title'),
                    description: t('sections.gettingStarted.overview.description'),
                    image: "/tutorial/overview.jpg",
                    steps: [
                        t('sections.gettingStarted.overview.steps.0'),
                        t('sections.gettingStarted.overview.steps.1'),
                        t('sections.gettingStarted.overview.steps.2'),
                        t('sections.gettingStarted.overview.steps.3')
                    ],
                },
                {
                    title: t('sections.gettingStarted.quickstart.title'),
                    description: t('sections.gettingStarted.quickstart.description'),
                    image: "/tutorial/quickstart.jpg",
                    steps: [
                        t('sections.gettingStarted.quickstart.steps.0'),
                        t('sections.gettingStarted.quickstart.steps.1'),
                        t('sections.gettingStarted.quickstart.steps.2'),
                        t('sections.gettingStarted.quickstart.steps.3')
                    ],
                }
            ]
        },
        {
            id: "team-management",
            title: t('sections.teamManagement.title'),
            icon: <Users className="h-5 w-5 text-primary mr-2" />,
            content: [
                {
                    title: t('sections.teamManagement.create.title'),
                    description: t('sections.teamManagement.create.description'),
                    image: "/tutorial/teams.jpg",
                    steps: [
                        t('sections.teamManagement.create.steps.0'),
                        t('sections.teamManagement.create.steps.1'),
                        t('sections.teamManagement.create.steps.2'),
                        t('sections.teamManagement.create.steps.3')
                    ],
                },
                {
                    title: t('sections.teamManagement.collaboration.title'),
                    description: t('sections.teamManagement.collaboration.description'),
                    image: "/tutorial/collaboration.jpg",
                    steps: [
                        t('sections.teamManagement.collaboration.steps.0'),
                        t('sections.teamManagement.collaboration.steps.1'),
                        t('sections.teamManagement.collaboration.steps.2'),
                        t('sections.teamManagement.collaboration.steps.3')
                    ],
                }
            ]
        },
        {
            id: "projects",
            title: t('sections.projects.title'),
            icon: <FileText className="h-5 w-5 text-primary mr-2" />,
            content: [
                {
                    title: t('sections.projects.setup.title'),
                    description: t('sections.projects.setup.description'),
                    image: "/tutorial/project-setup.jpg",
                    steps: [
                        t('sections.projects.setup.steps.0'),
                        t('sections.projects.setup.steps.1'),
                        t('sections.projects.setup.steps.2'),
                        t('sections.projects.setup.steps.3')
                    ],
                },
                {
                    title: t('sections.projects.importExport.title'),
                    description: t('sections.projects.importExport.description'),
                    image: "/tutorial/import-export.jpg",
                    steps: [
                        t('sections.projects.importExport.steps.0'),
                        t('sections.projects.importExport.steps.1'),
                        t('sections.projects.importExport.steps.2'),
                        t('sections.projects.importExport.steps.3')
                    ],
                }
            ]
        },
        {
            id: "translation",
            title: t('sections.translation.title'),
            icon: <Coffee className="h-5 w-5 text-primary mr-2" />,
            content: [
                {
                    title: t('sections.translation.interface.title'),
                    description: t('sections.translation.interface.description'),
                    image: "/tutorial/translation-editor.jpg",
                    steps: [
                        t('sections.translation.interface.steps.0'),
                        t('sections.translation.interface.steps.1'),
                        t('sections.translation.interface.steps.2'),
                        t('sections.translation.interface.steps.3')
                    ],
                },
                {
                    title: t('sections.translation.quality.title'),
                    description: t('sections.translation.quality.description'),
                    image: "/tutorial/quality.jpg",
                    steps: [
                        t('sections.translation.quality.steps.0'),
                        t('sections.translation.quality.steps.1'),
                        t('sections.translation.quality.steps.2'),
                        t('sections.translation.quality.steps.3')
                    ],
                }
            ]
        },
        {
            id: "advanced",
            title: t('sections.advanced.title'),
            icon: <Info className="h-5 w-5 text-primary mr-2" />,
            content: [
                {
                    title: t('sections.advanced.api.title'),
                    description: t('sections.advanced.api.description'),
                    image: "/tutorial/api.jpg",
                    steps: [
                        t('sections.advanced.api.steps.0'),
                        t('sections.advanced.api.steps.1'),
                        t('sections.advanced.api.steps.2'),
                        t('sections.advanced.api.steps.3')
                    ],
                },
                {
                    title: t('sections.advanced.customize.title'),
                    description: t('sections.advanced.customize.description'),
                    image: "/tutorial/customize.jpg",
                    steps: [
                        t('sections.advanced.customize.steps.0'),
                        t('sections.advanced.customize.steps.1'),
                        t('sections.advanced.customize.steps.2'),
                        t('sections.advanced.customize.steps.3')
                    ],
                }
            ]
        }
    ];

    // Function to handle smooth scrolling to sections
    const scrollToSection = (sectionId: string) => {
        setCurrentSection(sectionId);
        sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="container mx-auto py-10 px-4 md:px-6">
            {/* Page header */}
            <div className="mb-10 pb-8 border-b">
                <div className="flex justify-between items-center mb-6">
                    <Link href="/">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            {t('backToHome')}
                        </Button>
                    </Link>
                </div>
                <h1 className="text-4xl font-bold mb-4">{t('pageTitle')}</h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    {t('pageDescription')}
                </p>
            </div>

            {/* Navigation and content area */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar navigation */}
                <div className="lg:w-1/4">
                    <div className="sticky top-20">
                        <nav className="space-y-1">
                            {tutorialSections.map((section) => (
                                <Button
                                    key={section.id}
                                    variant={currentSection === section.id ? "secondary" : "ghost"}
                                    className="w-full justify-start mb-1"
                                    onClick={() => scrollToSection(section.id)}
                                >
                                    {section.icon}
                                    {section.title}
                                </Button>
                            ))}
                        </nav>
                        
                        <Card className="mt-8">
                            <CardHeader className="pb-3">
                                <CardTitle>{t('needHelp')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-2">
                                    {t('helpDescription')}
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Link href="/contact" className="w-full">
                                    <Button variant="outline" className="w-full">
                                        {t('contactSupport')}
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>
                </div>

                {/* Main content area */}
                <div className="lg:w-3/4 space-y-16">
                    {tutorialSections.map((section) => (
                        <section 
                            key={section.id} 
                            id={section.id}
                            ref={el => { sectionRefs.current[section.id] = el }}
                            className="scroll-mt-20"
                        >
                            <h2 className="text-3xl font-bold flex items-center mb-6">
                                {section.icon}
                                {section.title}
                            </h2>
                            
                            <div className="space-y-10">
                                {section.content.map((item, idx) => (
                                    <div key={idx} className="bg-muted/30 rounded-xl p-6">
                                        <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                                        <p className="text-muted-foreground mb-6">{item.description}</p>
                                        
                                        {/* Image section */}
                                        <div className="relative h-[250px] md:h-[400px] w-full mb-6 bg-muted rounded-lg overflow-hidden">
                                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                                {t('imageExample')}: {item.title}
                                            </div>
                                            {/* Use real tutorial screenshots when deployed, currently using placeholders */}
                                            {/* <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-contain"
                                            /> */}
                                        </div>
                                        
                                        {/* Steps list */}
                                        <h4 className="font-medium mb-4">{t('steps')}:</h4>
                                        <ol className="space-y-3">
                                            {item.steps.map((step, stepIdx) => (
                                                <li key={stepIdx} className="flex items-start">
                                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs mr-3 mt-0.5">
                                                        {stepIdx + 1}
                                                    </span>
                                                    <span>{step}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}

                    {/* Footer navigation */}
                    <div className="flex justify-between pt-8 border-t">
                        <Link href="/">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t('backToHome')}
                            </Button>
                        </Link>
                        <Link href="/teams">
                            <Button>
                                {t('gotoConsole')}
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
