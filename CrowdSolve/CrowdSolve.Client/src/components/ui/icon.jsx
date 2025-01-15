import { icons } from 'lucide-react';

const Icon = ({ name, color, size, className }) => {
  const LucideIcon = icons[name];
  return <LucideIcon color={color} size={size} className={className} />;
};

export default Icon;