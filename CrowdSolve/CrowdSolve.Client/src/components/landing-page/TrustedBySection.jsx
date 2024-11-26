import { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";

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

export default function TrustedBySection() {
  const plugin = useRef(
    AutoScroll({ playOnInit: true, speed: 2 })
  );

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

  const fadeEdgeStyle = {
    maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
    WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
  };

  return (
    <motion.section
      className='bg-accent pb-20'
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="container px-4 md:px-6">
        <motion.div className="container flex flex-col items-center text-center" variants={itemVariants}>
          <motion.h1 className="my-6 text-pretty text-2xl font-bold lg:text-4xl" variants={itemVariants}>
            Confiado por estas empresas
          </motion.h1>
        </motion.div>
        <motion.div className="pt-10 md:pt-16 lg:pt-20" variants={itemVariants} style={fadeEdgeStyle}>
          <Carousel
            opts={{
              align: "start",
              loop: true,
              skipSnaps: false,
              inViewThreshold: 0.7,
            }}
            plugins={[plugin.current]}
            className="w-full"
          >
            <CarouselContent>
              {logos.concat(logos).map((logo, index) => (
                <CarouselItem key={`${logo.id}-${index}`} className="md:basis-1/4 lg:basis-1/5">
                  <div className="p-1">
                    <img
                      src={logo.image}
                      alt={logo.description}
                      className="mx-auto h-12 w-32 object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </motion.div>
      </div>
    </motion.section>
  );
}