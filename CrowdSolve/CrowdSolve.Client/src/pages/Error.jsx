import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { AlertTriangle } from "lucide-react"
import { useTranslation } from 'react-i18next';

export default function ErrorPage() {
    const { t } = useTranslation();
    const navigate = useNavigate()

    return (
        <div className="flex items-center justify-center bg-background w-full">
            <div className="text-center space-y-6 max-w-md px-4">
                <div className="flex items-center justify-center space-x-4">
                    <div className="bg-accent rounded-full p-3 mx-auto my-2">
                        <AlertTriangle className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                </div>
                <div className="flex items-center justify-center space-x-4">
                    <h1 className="text-7xl font-extrabold text-primary">{t('errorPage.title')}</h1>
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t('errorPage.subtitle')}</h2>
                <p className="text-muted-foreground">
                {t('errorPage.description')}
                </p>
                <div className="flex justify-center space-x-4">
                    <Button onClick={() => navigate(-1)} variant="outline">
                    {t('errorPage.buttons.goBack')}
                    </Button>
                    <Button onClick={() => navigate("/")}>{t('errorPage.buttons.goHome')}</Button>
                </div>
            </div>
        </div>
    )
}