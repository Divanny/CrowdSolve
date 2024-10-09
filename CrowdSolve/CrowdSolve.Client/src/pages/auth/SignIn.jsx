import CrowdSolveLogoLight from '@/assets/CrowdSolveLogo_light.svg';
import CrowdSolveLogoDark from '@/assets/CrowdSolveLogo_dark.svg';
import { Button } from "@/components/ui/button";
import { Loading02Icon } from "hugeicons-react"
import { Input } from "@/components/ui/input";
import { PasswordInput } from '@/components/ui/password-input';
import { useState } from "react";
import { Label } from "@/components/ui/label";
import useAxios from "@/hooks/use-axios";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { ReactTyped } from "react-typed";
import { Card } from "@/components/ui/card";
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/slices/userSlice';
import EstatusUsuarioEnum from "@/enums/EstatusUsuarioEnum";
import GoogleLoginButton from '@/components/GoogleLoginButton';

function SignIn() {
  const navigate = useNavigate();

  const theme = useSelector((state) => state.theme.theme);
  const CrowdSolveLogo = theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? CrowdSolveLogoDark : CrowdSolveLogoLight) : (theme === 'dark' ? CrowdSolveLogoDark : CrowdSolveLogoLight);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { api } = useAxios();
  const isLoading = useSelector((state) => state.loading.isLoading);

  const dispatch = useDispatch();

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.warning("Operación fallida", {
        description: "Por favor, complete todos los campos",
      });
      return;
    }

    try {
      const response = await api.post("/api/Account/SignIn", {
        username,
        password
      });

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
          description: "Inicio de sesión exitoso",
        });
      } else {
        toast.warning("Operación fallida", {
          description: response.data.message,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="grid grid-cols-1 gap-4 min-[1000px]:grid-cols-2">
        <div className="flex grow flex-col justify-center pt-2 [@media(min-height:800px)]:pt-6 [@media(min-height:900px)]:pt-10 w-full min-h-screen px-5">
          <div className="w-full max-w-md mx-auto">
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <Link to="/">
                <img
                  src={CrowdSolveLogo}
                  alt="CrowdSolve Logo"
                  className="h-14 sm:h-16"
                />
              </Link>
            </div>

            <h2 className="mb-6 sm:mb-8 text-center">
              <ReactTyped
                strings={[
                  "Despierta tu creatividad",
                  "Demuestra tu talento",
                  "Resuelve problemas",
                ]}
                typeSpeed={80}
                loop
                className="text-lg sm:text-3xl font-serif"
                style={{
                  fontFamily:
                    'font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif; !important',
                }}
                backSpeed={20}
                cursorChar="|"
                showCursor={true}
                backDelay={1000}
              />
            </h2>

            <Card className="p-4 sm:p-6 max-w-md shadow-sm">
              <p className="text-sm text-center mb-4">
                Empieza usando CrowdSolve para ti o tu empresa
              </p>

              <GoogleLoginButton />

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">O</span>
                </div>
              </div>

              <form onSubmit={handleSignIn} className="grid gap-4 mb-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Nombre de usuario o correo electrónico</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Ingrese su usuario o su correo electrónico"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    tabIndex={2}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Contraseña</Label>
                    <Link
                      to="/forgot-password"
                      className="text-primary font-medium ml-auto inline-block text-xs"
                      tabIndex={4}
                    >
                      ¿Has olvidado tu contraseña?
                    </Link>
                  </div>
                  <PasswordInput
                    id="password"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    tabIndex={3}
                  />
                </div>

                {isLoading ? (
                  <Button disabled className="w-full" tabIndex={5}>
                    <Loading02Icon className="mr-2 h-4 w-4 animate-spin" />
                    Por favor, espere
                  </Button>
                ) : (
                  <Button type="submit" className="w-full" tabIndex={5}>
                    Iniciar sesión
                  </Button>
                )}
              </form>

              <div className="mt-4 text-center text-xs">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/sign-up"
                  className="text-primary font-medium"
                  tabIndex={6}
                >
                  Registrarse
                </Link>
              </div>
            </Card>
          </div>
        </div>
        <div className="hidden min-[500px]:flex justify-center p-0 sm:p-4 ">
          <div className="w-full rounded-xl bg-card"></div>
        </div>
      </main>
    </div>
  );
}

export default SignIn;
