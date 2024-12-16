import { motion } from 'framer-motion';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from '@/components/ui/accordion';
  import { useTranslation } from 'react-i18next';

  const FAQSection = () => {
    const { t } = useTranslation();
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
  
    return (
      <motion.section 
        className="py-20 md:py-32 bg-accent"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">
          <motion.h1 
            className="mb-4 text-3xl font-semibold md:mb-11 md:text-5xl"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t('faq_section.title')}
          </motion.h1>
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Accordion type="single" collapsible>
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="hover:text-foreground/60 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          ))}
        </div>
      </motion.section>
    );
  };
  
  export default FAQSection;