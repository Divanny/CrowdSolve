import { useState, useEffect } from 'react'
import { CalendarIcon } from "lucide-react"
import useAxios from '@/hooks/use-axios'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

const ProfileHover = ({ userName, children }) => {
  const [user, setUser] = useState(null)
  const { api } = useAxios()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`/api/Participantes/PerfilPublico/${userName}`)
        setUser(response.data)
      } catch {
        toast.error("Operación fallida", {
          description: "No se pudo cargar la información del perfil",
        })
      }
    }

    fetchUserProfile()

    // eslint-disable-next-line
  }, [userName])

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        {user ? (
          <div className="flex justify-between space-x-4">
            <Avatar>
              <AvatarImage src={`/api/Account/GetAvatar/${user.idUsuario}`} />
              <AvatarFallback>{user.nombreUsuario.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">@{user.nombreUsuario}</h4>
              <p className="text-sm">{user.descripcionPersonal}</p>
              <div className="flex items-center pt-2">
                <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                <span className="text-xs text-muted-foreground">
                  {/* Joined date placeholder */}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-between space-x-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center pt-2">
                <Skeleton className="h-4 w-4 mr-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}

export default ProfileHover