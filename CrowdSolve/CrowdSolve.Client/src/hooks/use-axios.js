import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from 'react-redux';
import { setLoading } from '../redux/slices/loadingSlice';
import { clearUser } from '../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { store } from '../redux/store';

const useAxios = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const api = axios.create({
        baseURL: import.meta.env.BASE_URL
    });

    api.interceptors.request.use((config) => {
        const requireLoading = config.requireLoading !== false;
        if (requireLoading) {
            dispatch(setLoading(true));
        }

        const state = store.getState();
        const token = state.user.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    api.interceptors.response.use(
        (response) => {
            dispatch(setLoading(false));
            return response;
        },
        (error) => {
            dispatch(setLoading(false));

            if (error.response) {
                const { status } = error.response;
                if (status === 401 && window.location.pathname !== "/sign-in") {
                    dispatch(clearUser());
                    navigate("/sign-in");

                    const state = store.getState();
                    const token = state.user.token;

                    if (token) {
                        toast.warning("Sesión expirada. Por favor, inicia sesión nuevamente.");
                    }
                    else {
                        toast.warning("Acceso denegado", {
                            description: "Debes iniciar sesión para acceder a esta página.",
                        });
                    }
                }
            }
            
            return Promise.reject(error);
        }
    );

    return { api };
};

export default useAxios;