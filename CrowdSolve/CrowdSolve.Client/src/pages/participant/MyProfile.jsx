'use client'

import { useState, useEffect } from 'react'
import useAxios from '@/hooks/use-axios'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileInfo from '@/components/participants/ProfileInfo'
import SolutionsOverview from '@/components/participants/SolutionsOverview'
import StatsOverview from '@/components/participants/StatsOverview'
import AvatarPicker from '@/components/ui/avatar-picker'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { CalendarIcon } from '@radix-ui/react-icons'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Label } from '@/components/ui/label'
import ProfileSkeleton from '@/components/participants/ProfileSkeleton'
import { useTranslation } from 'react-i18next';

const MyProfile = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null)
  const [relationalObjects, setRelationalObjects] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const { api } = useAxios()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const response = await api.get('/api/Participantes/MiPerfil')
        setUser(response.data)
        await fetchRelationalObjects()
      } catch {
        toast.error(t('myProfile.fetch.error'), {
          description: t('myProfile.fetch.profileErrorDescription'),
        })
      }
    }

    const fetchRelationalObjects = async () => {
      try {
        const response = await api.get('/api/Participantes/GetRelationalObjects')
        setRelationalObjects(response.data)
      } catch {
        toast.error(t('myProfile.fetch.error'), {
          description: t('myProfile.fetch.relationalObjectsErrorDescription'),
        })
      }
    }

    fetchMyProfile()
    // eslint-disable-next-line
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async (updatedUser) => {
    try {
      updatedUser.fechaNacimiento = format(updatedUser.fechaNacimiento, "yyyy-MM-dd");

      const formData = new FormData()
      Object.keys(updatedUser).forEach(key => {
        formData.append(key, updatedUser[key])
      })

      const response = await api.put('/api/Participantes/MiPerfil', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        setUser(() => ({
          ...updatedUser,
          avatar: updatedUser.avatar instanceof File || updatedUser.avatar instanceof Blob 
            ? URL.createObjectURL(updatedUser.avatar) 
            : updatedUser.avatar,
        }));
        setIsEditing(false)
        toast.success(t('myProfile.fetch.success'), {
          description: response.data.message,
        })
      } else {
        toast.warning(t('myProfile.fetch.saveError'), {
          description: response.data.message,
        })
      }
    } catch {
      toast.error(t('myProfile.fetch.saveError'), {
        description: t('myProfile.fetch.saveErrorDescription'),
      })
    }
  }

  if (!user) {
    return <ProfileSkeleton />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ProfileInfo user={user} onEdit={handleEdit} />
          </div>
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="solutions" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="solutions">{t('myProfile.profile.tabs.solutions')}</TabsTrigger>
                    <TabsTrigger value="stats">{t('myProfile.profile.tabs.stats')}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="solutions">
                    <SolutionsOverview solutions={user.soluciones} myProfile={true}/>
                  </TabsContent>
                  <TabsContent value="stats">
                    <StatsOverview solutions={user.soluciones} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {isDesktop ? (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('myProfile.profile.editButton')}</DialogTitle>
            </DialogHeader>
            <EditProfileForm
              user={user}
              relationalObjects={relationalObjects}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
              t={t}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isEditing} onOpenChange={setIsEditing}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{t('myProfile.profile.editButton')}</DrawerTitle>
            </DrawerHeader>
            <EditProfileForm
              user={user}
              relationalObjects={relationalObjects}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
              t={t}
            />
          </DrawerContent>
        </Drawer>
      )}
    </div>
  )
}

const EditProfileForm = ({ user, relationalObjects, onSave, onCancel, t }) => {
  const [formData, setFormData] = useState({
    ...user,
    fechaNacimiento: new Date(user.fechaNacimiento)
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AvatarPicker
        avatarURL={`/api/Account/GetAvatar/${user.idUsuario}`}
        onAvatarChange={(file) => setFormData((prevData) => ({ ...prevData, avatar: file }))}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombres">{t('myProfile.form.fields.firstName.label')}</Label>
          <Input
            id="nombres"
            name="nombres"
            placeholder={t('myProfile.form.fields.firstName.placeholder')}
            value={formData.nombres}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apellidos">{t('myProfile.form.fields.lastName.label')}</Label>
          <Input
            id="apellidos"
            name="apellidos"
            placeholder={t('myProfile.form.fields.lastName.placeholder')}
            value={formData.apellidos}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fechaNacimiento">{t('myProfile.form.fields.birthDate.label')}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="fechaNacimiento"
                name="fechaNacimiento"
                variant={"outline"}
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.fechaNacimiento ? format(formData.fechaNacimiento, "PPP") : t('myProfile.form.fields.birthDate.placeholder')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.fechaNacimiento}
                onSelect={(date) => setFormData((prevData) => ({ ...prevData, fechaNacimiento: date }))}
                fromYear={1960}
                toYear={new Date().getFullYear()}
                className="bg-transparent"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono">{t('myProfile.form.fields.phone.label')}</Label>
          <Input
            id="telefono"
            name="telefono"
            placeholder={t('myProfile.form.fields.phone.placeholder')}
            value={formData.telefono}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="idNivelEducativo">{t('myProfile.form.fields.educationLevel.label')}</Label>
        <Select
          onValueChange={(value) => handleSelectChange("idNivelEducativo", value)}
          value={formData.idNivelEducativo}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('myProfile.form.fields.educationLevel.placeholder')}>
              {formData.idNivelEducativo ? relationalObjects.nivelesEducativos.find((ne) => ne.idNivelEducativo == formData.idNivelEducativo).nombre : t('myProfile.form.fields.educationLevel.placeholder')}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {relationalObjects.nivelesEducativos && relationalObjects.nivelesEducativos.map((ne) => (
              <SelectItem key={ne.idNivelEducativo} value={ne.idNivelEducativo}>
                {ne.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcionPersonal">{t('myProfile.form.fields.personalDescription.label')}</Label>
        <Textarea
          id="descripcionPersonal"
          name="descripcionPersonal"
          placeholder={t('myProfile.form.fields.personalDescription.placeholder')}
          value={formData.descripcionPersonal}
          onChange={handleChange}
          rows={4}
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>{t('myProfile.form.buttons.cancel')}</Button>
        <Button type="submit">{t('myProfile.form.buttons.save')}</Button>
      </div>
    </form>
  )
}

export default MyProfile