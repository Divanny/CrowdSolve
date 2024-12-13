'use client'

import * as React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Search, Check, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useAxios from '@/hooks/use-axios'
import { Skeleton } from '@/components/ui/skeleton'
import Icon from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function NotificationsPage() {
  const { api } = useAxios()
  const [notifications, setNotifications] = React.useState([])
  const [selectedIds, setSelectedIds] = React.useState([])
  const [filterStatus, setFilterStatus] = React.useState("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/api/Notificaciones/MisNotificaciones', { requireLoading: false })
        const sortedNotifications = response.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        setNotifications(sortedNotifications)
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredNotifications = React.useMemo(() => {
    return notifications.filter(notification => {
      const matchesSearch = notification.titulo.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === "all" ? true : filterStatus === "unread" ? !notification.leido : notification.leido
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, filterStatus, notifications])

  const unreadCount = notifications.filter(n => !n.leido).length

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(filteredNotifications.map(n => n.idNotificacion))
    } else {
      setSelectedIds([])
    }
  }

  const toggleNotification = (id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const markAsRead = async (ids) => {
    try {
      const response = await api.put('/api/Notificaciones/MarcarLeido', ids)
      if (!response.data.success) {
        toast.warning('Operación fallida', { description: response.data.message })
        return;
      }
      setNotifications(prev => prev.map(n => ids.includes(n.idNotificacion) ? { ...n, leido: true } : n))
    } catch {
      toast.error('Operación errónea', { description: 'Ocurrió un error al marcar las notificaciones como leídas' })
    }
  }

  const markAsUnread = async (ids) => {
    try {
      const response = await api.put('/api/Notificaciones/MarcarNoLeido', ids)
      if (!response.data.success) {
        toast.warning('Operación fallida', { description: response.data.message })
        return;
      }
      setNotifications(prev => prev.map(n => ids.includes(n.idNotificacion) ? { ...n, leido: false } : n))
    } catch {
      toast.error('Operación errónea', { description: 'Ocurrió un error al marcar las notificaciones como leídas' })
    }
  }

  const deleteNotification = async (id) => {
    try {
      const response = await api.delete(`/api/Notificaciones/EliminarNotificacion/${id}`)
      if (!response.data.success) {
        toast.warning('Operación fallida', { description: response.data.message })
        return;
      }
      toast.success('Notificación eliminada', { description: 'La notificación ha sido eliminada correctamente' })
      setNotifications(prev => prev.filter(n => n.idNotificacion !== id))
    } catch {
      toast.error('Operación errónea', { description: 'Ocurrió un error al eliminar la notificación' })
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-4 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Notificaciones</h1>
          {unreadCount > 0 && (
            <Badge variant="secondary">
              {unreadCount} no leídas
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 relative w-full sm:w-auto">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar notificaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full sm:max-w-sm"
          />
        </div>
        <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full sm:w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="unread">No leídos</TabsTrigger>
            <TabsTrigger value="read">Leídos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)] rounded-md border">
        {isLoading ? (
          <div className="space-y-4 p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        ) : (
          <div className="divide-y divide-border">
            <div className="flex flex-col sm:flex-row gap-4 px-4 py-2 bg-muted/50">
              <div className='flex flex-row items-center gap-2'>
                <Checkbox
                  id="select-all"
                  checked={selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
                <Label htmlFor='select-all' className="text-sm text-muted-foreground">
                  {selectedIds.length} seleccionadas
                </Label>
              </div>
              {selectedIds.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" onClick={() => markAsRead(selectedIds)} size="sm" className="flex items-center gap-2 w-full sm:w-auto">
                    <Check className="h-4 w-4" />
                    <span>Marcar como leídas</span>
                  </Button>
                  <Button variant="outline" onClick={() => markAsUnread(selectedIds)} size="sm" className="flex items-center gap-2 w-full sm:w-auto">
                    <span>Marcar como no leídas</span>
                  </Button>
                </div>
              )}
            </div>
            {filteredNotifications.length === 0 ? (
              <div className='h-100 flex items-center justify-center'>
                <div className="p-4 text-center text-muted-foreground">
                  No hay notificaciones.
                </div>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                return (
                  <div
                    key={notification.idNotificacion}
                    className={`group relative flex flex-col sm:flex-row items-start gap-4 p-4 transition-colors hover:bg-muted/50 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary before:opacity-0 hover:before:opacity-100 ${!notification.leido ? 'bg-muted/30' : 'bg-background'}`}
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedIds.includes(notification.idNotificacion)}
                        onCheckedChange={() => toggleNotification(notification.idNotificacion)}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-3 min-w-0 flex-1">
                      {notification.icono != null &&
                        (<Icon name={notification.icono} className={`h-4 w-4 mt-1 flex-shrink-0 ${!notification.leido ? `text-${notification.severidad}` : 'text-muted-foreground'}`} />)
                      }
                      <div className="flex-1 min-w-5/6">
                        <div className="flex items-center gap-2">
                          {notification.urlRedireccion ? (
                            <a
                              href={notification.urlRedireccion}
                              className={`hover:text-primary ${!notification.leido ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
                              onClick={() => notification.leido ? null : markAsRead([notification.idNotificacion])}
                            >
                              {notification.titulo}
                            </a>
                          ) : (
                            <p className={`${!notification.leido ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                              {notification.titulo}
                            </p>
                          )}
                          {!notification.leido && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className={`text-sm mt-1 ${!notification.leido ? 'text-muted-foreground' : 'text-muted-foreground/70'}`} dangerouslySetInnerHTML={{ __html: notification.mensaje }} />
                      </div>
                      <p className="text-xs text-muted-foreground/70 mt-2 self-start sm:self-auto flex items-center gap-2">
                        {formatDistanceToNow(new Date(notification.fecha), { addSuffix: true, locale: es })}
                        <Button variant="ghostDestructive" size="icon" onClick={() => deleteNotification(notification.idNotificacion)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}