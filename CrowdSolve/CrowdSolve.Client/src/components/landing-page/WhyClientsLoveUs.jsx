import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";

const reviews = [
  {
    name: "Jean Güichardo",
    username: "@Leru",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://i.imgur.com/7QzhpGt.jpeg",
  },
  {
    name: "Jesus Bidó",
    username: "@whobido",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://i.imgur.com/dsDzjOQ.jpeg",
  },
  {
    name: "Manuel Sánchez",
    username: "@TakeCareWithManu",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://i.imgur.com/3nyMUgM.png",
  },
  {
    name: "Sebastian Peralta",
    username: "@PopularStick",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://i.imgur.com/4V07GqG.png",
  },
  {
    name: "Jorge Cruz",
    username: "@georgethe3",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://i.imgur.com/n0DUW83.png",
  },
  {
    name: "Wilbert León",
    username: "@klk4aqui5wibu",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://i.imgur.com/vrDgQ42.jpeg",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

const WhyClientsLoveUs = () => {
  const { t } = useTranslation();
  return (
    <section className='py-24 md:py-32 bg-accent relative'>
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className='z-10'
      >
        <div className="container">
          <div className="flex flex-col items-center z-10">
            <h2 className="text-2xl font-bold text-center md:text-4xl mb-12">
              {t('WhyClientsLoveUs.title')}
            </h2>
          </div>
          <div className="relative overflow-hidden">
            <Marquee pauseOnHover className="[--duration:20s]">
              {firstRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:20s]">
              {secondRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-accent"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-accent"></div>
          </div>
        </div>
      </motion.section>
      <BackgroundBeams />
    </section>
  );
};

export default WhyClientsLoveUs;