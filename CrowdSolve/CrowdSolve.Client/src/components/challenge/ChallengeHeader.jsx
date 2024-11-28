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

export default function ChallengeHeader({ challenge, htmlContent, getCategoryName, ChallengeDetail }) {
  const getDaysRemaining = () => {
    const today = new Date()
    const endDate = new Date(challenge.fechaLimite)
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  return (
    <Card className="w-full bg-gradient-to-b from-muted/50 to-background border-none shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={challenge.logoEmpresa}
                alt={`Logo de ${challenge.empresa}`}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary/10"
              />
              <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                Empresa
              </div>
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">{challenge.titulo}</CardTitle>
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
                className="px-3 py-1"
              >
                {getCategoryName(categoria.idCategoria)}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Fecha inicio</p>
              <p className="font-medium">
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
              <p className="text-sm text-muted-foreground">Fecha límite</p>
              <p className="font-medium">
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
              <p className="text-sm text-muted-foreground">Días restantes</p>
              <p className="font-medium">{getDaysRemaining()} días</p>
            </div>
          </div>
        </div>
        <Separator className="my-6" />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Eye className="mr-2 h-4 w-4" />
              Ver contenido del desafío
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
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

