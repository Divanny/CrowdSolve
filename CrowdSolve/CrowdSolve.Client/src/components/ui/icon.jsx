import { icons } from 'lucide-react';
import { CircleAlert } from 'lucide-react';
const Icon = ({ name, color, size, className }) => {
  const LucideIcon = icons[name];
  if (!LucideIcon) {
    return <CircleAlert color={color} size={size} className={'text-destructive'} />;
  }
  return <LucideIcon color={color} size={size} className={className} />;
};

export default Icon;