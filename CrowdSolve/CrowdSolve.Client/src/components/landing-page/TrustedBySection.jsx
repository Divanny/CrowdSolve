import { motion } from 'framer-motion';
import AutoScroll from 'embla-carousel-auto-scroll';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

const logos = [
  {
    id: 'logo-1',
    description: 'Logo 1',
    image: 'https://www.shadcnblocks.com/images/block/logos/astro.svg',
  },
  {
    id: 'logo-2',
    description: 'Logo 2',
    image: 'https://www.shadcnblocks.com/images/block/logos/figma.svg',
  },
  {
    id: 'logo-3',
    description: 'Logo 3',
    image: 'https://www.shadcnblocks.com/images/block/logos/nextjs.svg',
  },
  {
    id: 'logo-4',
    description: 'Logo 4',
    image: 'https://www.shadcnblocks.com/images/block/logos/react.png',
  },
  {
    id: 'logo-5',
    description: 'Logo 5',
    image: 'https://www.shadcnblocks.com/images/block/logos/shadcn-ui.svg',
  },
  {
    id: 'logo-6',
    description: 'Logo 6',
    image: 'https://www.shadcnblocks.com/images/block/logos/supabase.svg',
  },
  {
    id: 'logo-7',
    description: 'Logo 7',
    image: 'https://www.shadcnblocks.com/images/block/logos/tailwind.svg',
  },
  {
    id: 'logo-8',
    description: 'Logo 8',
    image: 'https://www.shadcnblocks.com/images/block/logos/vercel.svg',
  },
];

const TrustedBySection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.section
      className='bg-accent py-6 sm:pb-20'
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <motion.div className="container flex flex-col items-center text-center" variants={itemVariants}>
        <motion.h1 className="my-6 text-pretty text-2xl font-bold lg:text-4xl" variants={itemVariants}>
          Confiado por estas empresas
        </motion.h1>
      </motion.div>
      <motion.div className="pt-10 md:pt-16 lg:pt-20" variants={itemVariants}>
        <div className="relative mx-auto flex items-center justify-center lg:max-w-5xl">
          <Carousel
            opts={{ loop: true }}
            plugins={[AutoScroll({ playOnInit: true })]}
          >
            <CarouselContent className="ml-0">
              {logos.map((logo) => (
                <CarouselItem
                  key={logo.id}
                  className="basis-1/3 pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                >
                  <motion.div 
                    className="mx-10 flex shrink-0 items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div>
                      <motion.img
                        src={logo.image}
                        alt={logo.description}
                        className="h-7 w-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-accent to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-accent to-transparent"></div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default TrustedBySection;