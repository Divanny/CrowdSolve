import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function VerificationPending() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full inline-block">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">{t('verificationPending.successCard.header.title')}</CardTitle>
          <CardDescription>{t('verificationPending.successCard.header.description')}</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Clock className="h-5 w-5" />
            <span>{t('verificationPending.successCard.content.verificationTime.text')}</span>
          </div>
          <p>
          {t('verificationPending.successCard.content.thankYouMessage')}
          </p>
          <p>
          {t('verificationPending.successCard.content.emailNotification')}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" variant="outline" onClick={() => navigate('/')}>
          {t('verificationPending.successCard.footer.backButton')}
          </Button>
          <Button className="w-full" variant="link">
          {t('verificationPending.successCard.footer.supportButton')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}