'use client'

import { useState, useEffect } from 'react'
import useAxios from '@/hooks/use-axios'
import { toast } from 'sonner'
import ProfileInfo from '@/components/participants/ProfileInfo'
import ProfileSkeleton from '@/components/participants/ProfileSkeleton'
import SolutionsOverview from '@/components/participants/SolutionsOverview'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const PublicProfile = () => {
    const { t } = useTranslation();
    const [user, setUser] = useState(null)
    const { api } = useAxios()
    const { userName } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await api.get(`/api/Participantes/PerfilPublico/${userName}`)
                setUser(response.data)
            } catch {
                toast.error(t('publicProfile.errors.failedOperation'), {
                    description: t('publicProfile.errors.profileLoadError'),
                })
                navigate(-1)
            }
        }

        fetchUserProfile()

        // eslint-disable-next-line
    }, [userName])

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
                        <SolutionsOverview solutions={user.soluciones} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PublicProfile