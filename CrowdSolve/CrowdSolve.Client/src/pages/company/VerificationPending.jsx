import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom";

export default function VerificationPending() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full inline-block">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Cuenta Creada con Éxito</CardTitle>
          <CardDescription>Su cuenta empresarial está en proceso de verificación</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Clock className="h-5 w-5" />
            <span>Tiempo estimado de verificación: 1-3 días hábiles</span>
          </div>
          <p>
            Gracias por crear su cuenta empresarial. Nuestro equipo está revisando la información proporcionada para asegurar que todo esté en orden.
          </p>
          <p>
            Le notificaremos por correo electrónico una vez que la verificación esté completa y su cuenta esté totalmente activada.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" variant="outline" onClick={() => navigate('/')}>
            Volver al Inicio
          </Button>
          <Button className="w-full" variant="link">
            Contactar Soporte
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}