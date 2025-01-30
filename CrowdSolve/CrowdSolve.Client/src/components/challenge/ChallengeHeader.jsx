import { CalendarDays, Clock, Eye, Trophy } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useTranslation } from 'react-i18next';

export default function ChallengeHeader({ challenge, htmlContent, getCategoryName, ChallengeDetail }) {
  const { t } = useTranslation();
  const getDaysRemaining = () => {
    const today = new Date()
    const endDate = new Date(challenge.fechaLimite)
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  return (
    <Card className="w-full bg-gradient-to-b from-primary/10 to-background">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative">
              <img
                src={`/api/Account/GetAvatar/${challenge.idUsuarioEmpresa}`}
                alt={`Logo de ${challenge.empresa}`}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary/10"
              />
              <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {t('challengeHeader.company')}
              </div>
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl sm:text-2xl font-bold">{challenge.titulo}</CardTitle>
              <CardDescription className="text-primary font-medium">
                {challenge.empresa}
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {challenge.categorias.map((categoria) => (
              <Badge
                key={categoria.idDesafioCategoria}
                variant="secondary"
                className="px-2 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm"
              >
                {getCategoryName(categoria.idCategoria)}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground">{t('challengeHeader.startDate')}</p>
              <p className="text-sm sm:text-base font-medium">
                {new Date(challenge.fechaInicio).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground">{t('challengeHeader.deadline')}</p>
              <p className="text-sm sm:text-base font-medium">
                {new Date(challenge.fechaLimite).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground">{t('challengeHeader.daysRemaining')}</p>
              <p className="text-sm sm:text-base font-medium">{getDaysRemaining()} {t('challengeHeader.days')}</p>
            </div>
          </div>
        </div>
        <Separator className="my-4 sm:my-6" />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Eye className="mr-2 h-4 w-4" />
              {t('challengeHeader.viewChallengeContent')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] sm:max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="mt-4">
              <ChallengeDetail
                desafio={challenge}
                htmlContent={htmlContent}
                getCategoryName={getCategoryName}
              />
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

