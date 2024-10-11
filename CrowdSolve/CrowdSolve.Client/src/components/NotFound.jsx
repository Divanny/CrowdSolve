import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center max-w-sm">
                <h1 className="text-9xl font-bold">404</h1>
                <h2 className="mt-0 text-lg font-semibold">Página no encontrada</h2>
                <p className="text-sm">Es posible que la página que está buscando se haya eliminado, se haya cambiado de nombre o no esté disponible temporalmente.</p>
                <Button className="mt-4" onClick={() => navigate(-1)}>Volver</Button>
            </div>
        </div>
    );
};

export default NotFound;