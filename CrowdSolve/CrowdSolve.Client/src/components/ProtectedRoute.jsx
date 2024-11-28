import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAxios from "@/hooks/use-axios";
import { selectToken, selectUser, selectUserViews } from '../redux/selectors/userSelectors';
import { setUser } from '@/redux/slices/userSlice';
import EstatusUsuarioEnum from "@/enums/EstatusUsuarioEnum";
import { toast } from "sonner";
import { useEffect } from 'react';

const ProtectedRoute = () => {
    const { api } = useAxios();

    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    const user = useSelector(selectUser);
    const userViews = useSelector(selectUserViews);
    const location = useLocation();

    const checkUser = async () => {
        try {
            const response = await api.get("/api/Account");

            if (response.data) {
                const { data } = response;

                const responseAvatarURL = await api.get(`/api/Account/GetAvatar/${data.usuario.idUsuario}`, { responseType: 'blob', requireLoading: false })
                const avatarBlob = new Blob([responseAvatarURL.data], { type: responseAvatarURL.headers['content-type'] })
                const url = URL.createObjectURL(avatarBlob)

                dispatch(setUser({
                    user: { ...data.usuario, avatarUrl : url },
                    token: token,
                    views: Array.isArray(data.vistas) ? data.vistas : []
                }));
            }
        }
        catch (error) {
            if (error.response && error.response.status === 401) {
                dispatch(setUser({ user: null, token: null, views: [] }));

                toast.warning("Debe iniciar sesión", {
                    description: "Sesión expirada. Por favor, inicia sesión nuevamente.",
                });
            }
            else {
                toast.error("Error al obtener la información del usuario", {
                    description: error.message,
                });
            }
        }
    }

    const compareRoutes = (route, view) => {
        const isParam = (segment) => segment.startsWith(':');
        const isNumber = (segment) => !isNaN(segment);

        const routeParts = route.split('/');
        const viewParts = view.split('/');

        if (routeParts.length !== viewParts.length) {
            return false;
        }

        for (let i = 0; i < routeParts.length; i++) {
            if (isNumber(routeParts[i]) || isParam(viewParts[i])) {
                continue;
            }

            if (routeParts[i] !== viewParts[i] && !isParam(routeParts[i])) {
                return false;
            }
        }

        return true;
    }

    const canAcess = () => {
        const view = userViews.find(view => compareRoutes(view.url, location.pathname));

        if (!view) {
            // eslint-disable-next-line no-undef
            if (process.env.NODE_ENV === 'development') {
                toast.warning('Advertencia - Vista sin acceso', {
                    description: `La vista "${location.pathname}" no tiene acceso asignado. Por motivos de desarrollo, se permitirá el acceso.`
                })
                return true;
            }
            return false;
        }

        return true;
    }

    useEffect(() => {
        checkUser();
        // eslint-disable-next-line
    }, []);

    if (!token) {
        return <Navigate to="/sign-in" replace state={{ from: location }} />;
    }

    if (user.idEstatusUsuario === EstatusUsuarioEnum.PendienteDeValidar && !location.pathname.includes('/company/pending-verification')) {
        return <Navigate to="/company/pending-verification" replace state={{ from: location }} />;
    }

    if (user.idEstatusUsuario === EstatusUsuarioEnum.Incompleto && !location.pathname.includes('/sign-up/complete')) {
        return <Navigate to="/sign-up/complete" replace state={{ from: location }} />;
    }

    if (!canAcess()) {
        return <Navigate to="/access-denied" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default ProtectedRoute;