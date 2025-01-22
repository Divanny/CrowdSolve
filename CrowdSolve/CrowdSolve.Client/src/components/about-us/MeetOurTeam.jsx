import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useTranslation } from 'react-i18next';

const people = [
  {
    id: 'person-1',
    name: 'Ricardo Acosta',
    role: 'Project Manager / Developer Frontend',
    avatar: 'https://www.shadcnblocks.com/images/block/avatar-4.webp',
  },
  {
    id: 'person-2',
    name: 'Divanny Pérez',
    role: 'Developer Fullstack',
    avatar: 'https://www.shadcnblocks.com/images/block/avatar-5.webp',
  },
  {
    id: 'person-3',
    name: 'Manuel Sánchez',
    role: 'Developer Frontend',
    avatar: 'https://www.shadcnblocks.com/images/block/avatar-2.webp',
  },
  {
    id: 'person-4',
    name: 'Jesús Bidó',
    role: 'QA Engineer',
    avatar: 'https://www.shadcnblocks.com/images/block/avatar-8.webp',
  },
];

const MeetOurTeam = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            {t('MeetOurteam.title')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          {t('MeetOurteam.description')}
          </p>
        </div>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {people.map((person) => (
            <div key={person.id} className="flex flex-col items-center">
              <Avatar className="mb-6 h-32 w-32 border-4 border-primary">
                <AvatarImage src={person.avatar} alt={person.name} />
                <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h3 className="mb-2 text-xl font-semibold">{person.name}</h3>
              <p className="text-center text-muted-foreground">{person.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetOurTeam;

