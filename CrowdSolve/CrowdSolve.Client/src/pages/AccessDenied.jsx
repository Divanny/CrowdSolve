import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { ShieldX } from "lucide-react"

export default function AccessDenied() {
    const navigate = useNavigate()

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
                <h2 className="text-2xl font-bold text-foreground">Acceso Denegado</h2>
                <p className="text-muted-foreground">
                    Lo sentimos, no tienes permiso para acceder a esta página. Si crees que esto es un error, por favor contacta al administrador.
                </p>
                <div className="flex justify-center space-x-4">
                    <Button onClick={() => navigate(-1)} variant="outline">
                        Volver
                    </Button>
                    <Button onClick={() => navigate("/")}>Ir al inicio</Button>
                </div>
            </div>
        </div>
    )
}