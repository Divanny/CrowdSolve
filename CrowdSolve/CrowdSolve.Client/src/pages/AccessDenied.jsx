import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { ShieldX } from "lucide-react"
import { useTranslation } from 'react-i18next';

export default function AccessDenied() {
    const navigate = useNavigate()
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center space-y-6 max-w-md px-4">
                <div className="flex items-center justify-center space-x-4">
                    <div className="bg-accent rounded-full p-3 mx-auto my-2">
                        <ShieldX className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                </div>
                <div className="flex items-center justify-center space-x-4">
                    <h1 className="text-7xl font-extrabold text-primary">403</h1>
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t('AccessDenied.accessDeniedTitle')}</h2>
                <p className="text-muted-foreground">
                {t('AccessDenied.accessDeniedMessage')}
                </p>
                <div className="flex justify-center space-x-4">
                    <Button onClick={() => navigate(-1)} variant="outline">
                    {t('AccessDenied.goBackButton')}
                    </Button>
                    <Button onClick={() => navigate("/")}>{t('AccessDenied.goHomeButton')}</Button>
                </div>
            </div>
        </div>
    )
}