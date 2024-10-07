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
                if (status === 401) {
                    dispatch(clearUser());
                    navigate("/SignIn");
                    toast.warning("Sesión expirada. Por favor, inicia sesión nuevamente.");
                } else {
                    // Manejar otros errores
                    toast.error("Operación fallida", {
                        description: error.message,
                    });
                }
            } else {
                toast.error("Operación fallida", {
                    description: error.message,
                });
            }

            return Promise.reject(error);
        }
    );

    return { api };
};

export default useAxios;