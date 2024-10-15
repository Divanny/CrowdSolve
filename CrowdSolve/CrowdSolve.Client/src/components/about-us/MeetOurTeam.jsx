import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  return (
    <section className="py-12">
      <div className="container flex flex-col items-center text-center">
        <h2 className="my-6 text-pretty text-2xl font-bold lg:text-4xl">
          Conoce a nuestro equipo
        </h2>
      </div>
      <div className="container mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-4">
        {people.map((person) => (
          <div key={person.id} className="flex flex-col items-center">
            <Avatar className="mb-4 size-20 border md:mb-5 lg:size-24">
              <AvatarImage src={person.avatar} />
              <AvatarFallback>{person.name}</AvatarFallback>
            </Avatar>
            <p className="text-center font-medium">{person.name}</p>
            <p className="text-center text-muted-foreground">{person.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MeetOurTeam;