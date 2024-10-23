import { icons } from 'lucide-react';

const Icon = ({ name, color, size }) => {
  const LucideIcon = icons[name];
  console.log(name, color, size)
  return <LucideIcon color={color} size={size} />;
};

export default Icon;