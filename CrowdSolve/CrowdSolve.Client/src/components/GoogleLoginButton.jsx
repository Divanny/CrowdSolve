import { useGoogleLogin } from '@react-oauth/google';
import useAxios from '@/hooks/use-axios';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import EstatusUsuarioEnum from '@/enums/EstatusUsuarioEnum';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

function GoogleLoginButton() {
    const { t } = useTranslation();
    const { api } = useAxios();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleLoginSuccess = async (tokenResponse) => {
        const { code } = tokenResponse;

        try {
            const response = await api.post('api/Account/GoogleLogin', { code: code });

            if (response.data.success) {
                const { token, data } = response.data;

                dispatch(setUser({
                    user: data.usuario,
                    token: token,
                    views: Array.isArray(data.vistas) ? data.vistas : []
                }));

                if (data.usuario.idEstatusUsuario === EstatusUsuarioEnum.PendienteDeValidar) {
                    navigate("/company/pending-verification");
                } else if (data.usuario.idEstatusUsuario === EstatusUsuarioEnum.Incompleto) {
                    navigate("/sign-up/complete");
                } else {
                    navigate("/");
                }

                toast.success("Operación exitosa", {
                    description: "Inicio de sesión con Google exitoso",
                });
            } else {
                toast.warning("Operación errónea", {
                    description: response.data.message || "Error al iniciar sesión con Google",
                });
            }
        } catch (error) {
            console.error('Error al iniciar sesión con Google:', error);
            toast.error("Operación errónea", {
                description: "Error al iniciar sesión con Google",
            });
        }
    };

    const login = useGoogleLogin({
        onSuccess: handleGoogleLoginSuccess,
        onError: (error) => {
            console.error('Fallo en el inicio de sesión con Google:', error);
            toast.error("Operación errónea", {
                description: "Error al iniciar sesión con Google",
            });
        },
        flow: 'auth-code',
    });

    return (
        <Button
            variant="outline"
            className="w-full"
            tabIndex={1}
            onClick={login}
        >
            <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                />
                <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                />
                <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                />
                <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                />
            </svg>
            {t('ContinueGoogle.continueWithGoogle')}
        </Button>
    );
}

export default GoogleLoginButton;