import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trophy, ExternalLink } from 'lucide-react'

const SolutionsOverview = ({ solutions }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Mis Soluciones</h2>
        </div>
        <Link to="/my-solutions">
          <Button variant="outline" className="gap-2">
            Ver todas
            <ExternalLink className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <SolutionStat label="Total de soluciones" value={solutions.length} />
        <SolutionStat 
          label="Puntos totales" 
          value={solutions.reduce((acc, sol) => acc + sol.puntuacion, 0)} 
        />
      </div>

      <ScrollArea className="h-[400px]">
        <div className="grid gap-4">
          {solutions.map((solucion) => (
            <SolutionCard key={solucion.idSolucion} solution={solucion} />
          ))}
          {solutions.length === 0 && (
            <div className="text-center text-muted-foreground">
              No se han encontrado soluciones públicas
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

const SolutionStat = ({ label, value }) => (
  <Card>
    <CardContent className="p-4 text-center">
      <h4 className="text-2xl font-semibold">{value}</h4>
      <p className="text-sm text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
)

const SolutionCard = ({ solution }) => (
  <Card className="overflow-hidden">
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg mb-1">{solution.titulo}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {solution.descripcion}
          </p>
          <div className="text-xs text-muted-foreground">
            {new Date(solution.fechaRegistro).toLocaleDateString('es-ES')}
          </div>
        </div>
        <Badge variant="secondary" className="ml-2">
          {solution.puntuacion} pts
        </Badge>
      </div>
    </CardContent>
  </Card>
)

export default SolutionsOverview