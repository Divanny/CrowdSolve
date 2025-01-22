import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from '@/components/ui/accordion';

const HelpCenter = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    const faqs = [
        {
            question: t('faq_section.faqs.0.question'),
            answer:
                t('faq_section.faqs.0.answer'),
        },
        {
            question: t('faq_section.faqs.1.question'),
            answer:
                t('faq_section.faqs.1.answer'),
        },
        {
            question: t('faq_section.faqs.2.question'),
            answer:
                t('faq_section.faqs.2.answer'),
        },
        {
            question: t('faq_section.faqs.3.question'),
            answer:
                t('faq_section.faqs.3.answer'),
        },
    ];

    const sections = [
        {
            title: t('HelpCenter.sections.challenges.title'),
            description: t('HelpCenter.sections.challenges.description'),
        },
        {
            title: t('HelpCenter.sections.solutions.title'),
            description: t('HelpCenter.sections.solutions.description'),
        },
        {
            title: t('HelpCenter.sections.user.title'),
            description: t('HelpCenter.sections.user.description'),
        },
        {
            title: t('HelpCenter.sections.contact.title'),
            description: t('HelpCenter.sections.contact.description'),
        },
        {
            title: t('HelpCenter.sections.legal.title'),
            description: t('HelpCenter.sections.legal.description'),
        },
        {
            title: t('HelpCenter.sections.userManual.title'),
            description: t('HelpCenter.sections.userManual.description'),
        },
    ];

    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm) ||
        faq.answer.toLowerCase().includes(searchTerm)
    );

    const filteredSections = sections.filter(section =>
        section.title.toLowerCase().includes(searchTerm) ||
        section.description.toLowerCase().includes(searchTerm)
    );

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-primary">{t('HelpCenter.title')}</h1>
                <p className="text-muted-foreground">
                    {t('HelpCenter.description')}
                </p>
            </div>

            {/* Search Bar */}
            <div className="flex justify-center">
                <Input
                    type="text"
                    placeholder={t('HelpCenter.searchPlaceholder')}
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full max-w-lg"
                />
                <Button variant="outline" className="ml-2">
                    {t('HelpCenter.searchButton')}
                </Button>
            </div>

            {/* Sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSections.length > 0 ? (
                    filteredSections.map((section, index) => (
                        <Card key={index} className="hover:shadow-lg cursor-pointer">
                            <CardHeader>
                                <CardTitle>{section.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{section.description}</p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p>{t('HelpCenter.noSectionsFound')}</p>
                )}
            </div>

            {/* FAQs */}
            <h1 className="mb-4 text-xl font-semibold md:mb-11">
                {t('faq_section.title')}
            </h1>
            {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                    <div key={index}>
                        <Accordion type="single" collapsible>
                            <AccordionItem value={`item-${index}`}>
                                <AccordionTrigger className="hover:text-foreground/60 hover:no-underline">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent>{faq.answer}</AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                ))
            ) : (
                <p>{t('faq_section.noFaqsFound')}</p>
            )}
        </div>
    );
};

export default HelpCenter;