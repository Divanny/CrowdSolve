'use client'

import { useState, useEffect } from 'react'
import useAxios from '@/hooks/use-axios'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import ProfileInfo from '@/components/participants/ProfileInfo'
import SolutionsOverview from '@/components/participants/SolutionsOverview'
import StatsOverview from '@/components/participants/StatsOverview'

const MyProfile = () => {
  const [user, setUser] = useState(null)
  const [relationalObjects, setRelationalObjects] = useState(null)
  const { api } = useAxios()

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const response = await api.get('/api/Participantes/MiPerfil')
        setUser(response.data)
        await fetchRelationalObjects()
      } catch (error) {
        toast.error("Operación fallida", {
          description: "No se pudo cargar la información de tu perfil",
        })
      }
    }

    const fetchRelationalObjects = async () => {
      try {
        const response = await api.get('/api/Participantes/GetRelationalObjects')
        setRelationalObjects(response.data)
      } catch (error) {
        toast.error("Operación fallida", {
          description: "No se pudieron cargar los objetos relacionales",
        })
      }
    }

    fetchMyProfile()
  }, [])

  if (!user) {
    return <ProfileSkeleton />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ProfileInfo user={user} />
          </div>
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="solutions" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="solutions">Soluciones</TabsTrigger>
                    <TabsTrigger value="stats">Estadísticas</TabsTrigger>
                  </TabsList>
                  <TabsContent value="solutions">
                    <SolutionsOverview solutions={user.soluciones} />
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
    </div>
  )
}

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Skeleton className="w-[296px] h-[296px] rounded-full mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-20 w-full mb-4" />
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full mb-2" />
          ))}
        </div>
        <div className="lg:col-span-3">
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    </div>
  </div>
)

export default MyProfile