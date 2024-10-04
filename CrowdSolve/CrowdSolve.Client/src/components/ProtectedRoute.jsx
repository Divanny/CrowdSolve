import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectToken, selectUserViews } from '../redux/selectors/userSelectors';

const ProtectedRoute = ({ children, requiredView }) => {
    const token = useSelector(selectToken);
    const userViews = useSelector(selectUserViews);
    const location = useLocation();

    if (!token) {
        return <Navigate to="/SignIn" replace state={{ from: location }} />;
    }

    if (requiredView && !userViews.map((view) => view.nombre).includes(requiredView)) {
        return <Navigate to="/AccessDenied" replace />;
    }

    return children;
};

export default ProtectedRoute;