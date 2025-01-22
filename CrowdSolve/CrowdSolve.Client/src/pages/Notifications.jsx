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
import { useTranslation } from 'react-i18next';

export default function NotificationsPage() {
  const { t } = useTranslation();
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
        toast.warning(t('notification.functions.markAsRead.error'), { description: response.data.message })
        return;
      }
      setNotifications(prev => prev.map(n => ids.includes(n.idNotificacion) ? { ...n, leido: true } : n))
    } catch {
      toast.error(t('notification.functions.markAsRead.error'), { description: t('notification.functions.markAsRead.warning') })
    }
  }

  const markAsUnread = async (ids) => {
    try {
      const response = await api.put('/api/Notificaciones/MarcarNoLeido', ids)
      if (!response.data.success) {
        toast.warning(t('notification.functions.markAsRead.error'), { description: response.data.message })
        return;
      }
      setNotifications(prev => prev.map(n => ids.includes(n.idNotificacion) ? { ...n, leido: false } : n))
    } catch {
      toast.error(t('notification.functions.markAsRead.error'), { description: t('notification.functions.markAsRead.warning') })
    }
  }

  const deleteNotification = async (id) => {
    try {
      const response = await api.delete(`/api/Notificaciones/EliminarNotificacion/${id}`)
      if (!response.data.success) {
        toast.warning(t('notification.functions.markAsRead.error'), { description: response.data.message })
        return;
      }
      toast.success('Notificación eliminada', { description: t('notification.functions.deleteNotification.success') })
      setNotifications(prev => prev.filter(n => n.idNotificacion !== id))
    } catch {
      toast.error(t('notification.functions.markAsRead.error'), { description: t('notification.functions.deleteNotification.warning') })
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-4 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{t('myProfile.interface.notifications')}</h1>
          {unreadCount > 0 && (
            <Badge variant="secondary">
              {unreadCount} {t('myProfile.interface.unreadCount')}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 relative w-full sm:w-auto">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t('myProfile.interface.search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full sm:max-w-sm"
          />
        </div>
        <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full sm:w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">{t('myProfile.interface.tabs.all')}</TabsTrigger>
            <TabsTrigger value="unread">{t('myProfile.interface.tabs.unread')}</TabsTrigger>
            <TabsTrigger value="read">{t('myProfile.interface.tabs.read')}</TabsTrigger>
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
                  {selectedIds.length} {t('myProfile.labels.selectedCount')}
                </Label>
              </div>
              {selectedIds.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" onClick={() => markAsRead(selectedIds)} size="sm" className="flex items-center gap-2 w-full sm:w-auto">
                    <Check className="h-4 w-4" />
                    <span>{t('myProfile.labels.markAsRead')}</span>
                  </Button>
                  <Button variant="outline" onClick={() => markAsUnread(selectedIds)} size="sm" className="flex items-center gap-2 w-full sm:w-auto">
                    <span>{t('myProfile.labels.markAsUnread')}</span>
                  </Button>
                </div>
              )}
            </div>
            {filteredNotifications.length === 0 ? (
              <div className='h-100 flex items-center justify-center'>
                <div className="p-4 text-center text-muted-foreground">
                {t('myProfile.labels.noNotifications')}
                </div>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                return (
                  <div
                    key={notification.idNotificacion}
                    className={`group relative flex flex-col sm:flex-row items-start gap-4 p-4 transition-colors hover:bg-muted/50 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary before:opacity-0 hover:before:opacity-100 ${!notification.leido ? 'bg-muted/30' : 'bg-background'}`}
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <Checkbox
                        checked={selectedIds.includes(notification.idNotificacion)}
                        onCheckedChange={() => toggleNotification(notification.idNotificacion)}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground/70 self-start sm:self-auto sm:hidden items-center flex gap-2 flex-1 justify-between">
                        {formatDistanceToNow(new Date(notification.fecha), { addSuffix: true, locale: es })}
                        <Button variant="ghostDestructive" size="icon" onClick={() => deleteNotification(notification.idNotificacion)} className="transition-opacity">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </p>
                    </div>
                    <div className="flex gap-3 min-w-0 flex-1">
                      {notification.icono != null &&
                        (<Icon name={notification.icono} className={`h-4 w-4 mt-1 flex-shrink-0 ${!notification.leido ? `text-${notification.severidad}` : 'text-muted-foreground'}`} />)
                      }
                      <div className="flex-1">
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
                      <p className="text-xs text-muted-foreground/70 mt-2 self-start sm:self-auto hidden sm:flex sm:flex-row items-end sm:items-center gap-2">
                        {formatDistanceToNow(new Date(notification.fecha), { addSuffix: true, locale: es })}
                        <Button variant="ghostDestructive" size="icon" onClick={() => deleteNotification(notification.idNotificacion)} className="hidden group-hover:flex transition-opacity">
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