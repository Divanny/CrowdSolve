import { Card, CardContent } from '@/components/ui/card'

const StatsOverview = ({ solutions }) => {
  const distributionData = Array.from({ length: 5 }).map((_, i) => {
    const count = solutions.filter(s => 
      s.puntuacion >= i * 20 && s.puntuacion < (i + 1) * 20
    ).length
    return { 
      range: `${i * 20}-${(i + 1) * 20}`,
      count,
      percentage: (count / solutions.length) * 100
    }
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Distribución de Puntuaciones</h3>
          <div className="h-[200px] flex items-end gap-2">
            {distributionData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-primary/20 relative group"
                  style={{ 
                    height: `${data.percentage}%`,
                    minHeight: '10px'
                  }}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-background text-foreground px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    {data.count} soluciones
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {data.range}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Estadísticas Generales</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatItem label="Promedio de puntuación" 
              value={(solutions.reduce((acc, sol) => acc + sol.puntuacion, 0) / solutions.length).toFixed(2)} 
            />
            <StatItem label="Solución mejor puntuada" 
              value={Math.max(...solutions.map(s => s.puntuacion))} 
            />
            <StatItem label="Soluciones públicas" 
              value={solutions.filter(s => s.publica).length} 
            />
            <StatItem label="Soluciones privadas" 
              value={solutions.filter(s => !s.publica).length} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const StatItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="text-2xl font-semibold">{value}</p>
  </div>
)

export default StatsOverview