import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Mail, Phone, Calendar, Building2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ProfileInfo = ({ user, onEdit }) => (
  <div className="sticky top-8 space-y-6">
    <div className="flex flex-col items-center lg:items-start">
      <Avatar className="rounded-full mb-4 h-36 w-36 lg:h-48 lg:w-48">
        <AvatarImage src={`/api/Account/GetAvatar/${user.idUsuario}`} />
        <AvatarFallback className="text-4xl">
          {user.nombreUsuario.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <h1 className="text-2xl font-bold text-center lg:text-left">{user.nombres} {user.apellidos}</h1>
      <p className="text-lg text-muted-foreground mb-4 text-center lg:text-left">@{user.nombreUsuario}</p>
      <p className="text-muted-foreground mb-6 text-center lg:text-left">{user.descripcionPersonal}</p>
      
      <div className="space-y-2 text-sm w-full">
        <InfoItem icon={Building2} text={user.nivelEducativo} />
        <InfoItem icon={Mail} text={user.correoElectronico} />
        <InfoItem icon={Phone} text={user.telefono} />
        <InfoItem 
          icon={Calendar} 
          text={format(new Date(user.fechaNacimiento + 'T00:00:00'), 'd \'de\' MMMM \'de\' yyyy', { locale: es })} 
        />
      </div>
      {onEdit && (
        <Button onClick={onEdit} variant="outline" className="mt-4 w-full lg:w-auto">
          <Edit className="w-4 h-4" />
          Editar Perfil
        </Button>
      )}
    </div>
  </div>
)

const InfoItem = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 text-muted-foreground">
    <Icon className="w-4 h-4" />
    <span>{text}</span>
  </div>
)

export default ProfileInfo