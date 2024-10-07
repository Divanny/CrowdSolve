import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectToken, selectUserViews, selectUser } from '../redux/selectors/userSelectors';
import EstatusUsuarioEnum from "@/enums/EstatusUsuarioEnum";

const ProtectedRoute = ({ children, requiredView }) => {
    const token = useSelector(selectToken);
    const user = useSelector(selectUser);
    const userViews = useSelector(selectUserViews);
    const location = useLocation();

    if (!token) {
        return <Navigate to="/SignIn" replace state={{ from: location }} />;
    }

    if (user.idEstatusUsuario === EstatusUsuarioEnum.Incompleto && !location.pathname.includes('/SignUp/Complete')) {
        return <Navigate to="/SignUp/Complete" replace state={{ from: location }}/>;
    }

    if (requiredView && !userViews.map((view) => view.nombre).includes(requiredView)) {
        return <Navigate to="/AccessDenied" replace />;
    }

    return children;
};

export default ProtectedRoute;