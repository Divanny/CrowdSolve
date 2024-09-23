import axios from "axios";
import { useState } from "react"
import { toast } from "sonner"

const useAxios = () => {
    const [loading, setLoading] = useState(false);

    const api = axios.create({
        baseURL: import.meta.env.BASE_URL
    });

    api.interceptors.request.use((config) => {
        const requireLoading = config.requireLoading !== false;
        if (requireLoading) {
            setLoading(true);
        }

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    api.interceptors.response.use(
        (response) => {
            setLoading(false);
            return response;
        },
        (error) => {
            setLoading(false);
            if (error.response.status === 400) {
                return Promise.resolve(error.response);
            }
            if (error.response.status === 401 && localStorage.getItem("token")) {
                localStorage.removeItem("token");
                localStorage.removeItem("sessionExpireTime");
                // Handle screen lock logic here
                toast.warning("Debe iniciar sesión para continuar");
            } else if (error.response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("sessionExpireTime");
                // Redirect to login page
                window.location.href = "/login";
            } else if (error.response.status === 403) {
                toast.warning("No tienes permisos para realizar esta acción");
            }
            
            return Promise.reject(error);
        }
    );

    return { api, loading };
};

export default useAxios;