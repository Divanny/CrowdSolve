import { motion } from 'framer-motion';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from '@/components/ui/accordion';
  
  const FAQSection = () => {
    const faqs = [
      {
        question: '¿Qué es CrowdSolve?',
        answer:
          'CrowdSolve es una plataforma colaborativa donde los usuarios pueden trabajar juntos para resolver problemas complejos.',
      },
      {
        question: '¿Cómo funciona CrowdSolve?',
        answer:
          'CrowdSolve permite a los usuarios publicar problemas y colaborar con otros para encontrar soluciones a través de la inteligencia colectiva.',
      },
      {
        question: '¿Quién puede usar CrowdSolve?',
        answer:
          'Cualquier persona interesada en resolver problemas puede unirse a CrowdSolve. No se requieren habilidades específicas, solo un deseo de colaborar y contribuir.',
      },
      {
        question: '¿Cuáles son los beneficios de usar CrowdSolve?',
        answer:
          'Los beneficios de usar CrowdSolve incluyen acceso a una comunidad diversa de solucionadores de problemas, la posibilidad de encontrar soluciones innovadoras y la oportunidad de aprender de otros.',
      },
    ];
  
    return (
      <motion.section 
        className="py-32 bg-accent"
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
            Preguntas frecuentes sobre CrowdSolve
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