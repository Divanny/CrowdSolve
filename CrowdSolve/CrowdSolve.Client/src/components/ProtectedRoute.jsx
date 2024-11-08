import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation, useMatches } from 'react-router-dom';
import { selectToken, selectUser } from '../redux/selectors/userSelectors';
import EstatusUsuarioEnum from "@/enums/EstatusUsuarioEnum";
import usePermisoAcceso from '@/hooks/use-permiso-acceso';

const ProtectedRoute = () => {
    const token = useSelector(selectToken);
    const user = useSelector(selectUser);

    const location = useLocation();
    const matches = useMatches();

    const currentRoute = matches[matches.length - 1];
    const permission = currentRoute?.handle?.permission;
    
    console.log(permission);
    const hasPermission  = usePermisoAcceso(permission);

    if (!token) {
        return <Navigate to="/sign-in" replace state={{ from: location }} />;
    }

    if (user.idEstatusUsuario === EstatusUsuarioEnum.PendienteDeValidar && !location.pathname.includes('/company/pending-verification')) {
        return <Navigate to="/company/pending-verification" replace state={{ from: location }} />;
    }

    if (user.idEstatusUsuario === EstatusUsuarioEnum.Incompleto && !location.pathname.includes('/sign-up/complete')) {
        return <Navigate to="/sign-up/complete" replace state={{ from: location }}/>;
    }

    if (permission && !hasPermission ) {
        return <Navigate to="/AccessDenied" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;