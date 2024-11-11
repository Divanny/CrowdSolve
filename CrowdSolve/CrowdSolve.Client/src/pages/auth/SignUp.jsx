import CrowdSolveLogoDark from '@/assets/CrowdSolveLogo_dark.svg';
import CrowdSolveLogoLight from '@/assets/CrowdSolveLogo_light.svg';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import useAxios from "@/hooks/use-axios";
import { setUser } from '@/redux/slices/userSlice';
import { Loading02Icon } from "hugeicons-react";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { ReactTyped } from "react-typed";
import { toast } from "sonner";

function SignUp() {
  const navigate = useNavigate();

  const theme = useSelector((state) => state.theme.theme);
  const CrowdSolveLogo = theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? CrowdSolveLogoDark : CrowdSolveLogoLight) : (theme === 'dark' ? CrowdSolveLogoDark : CrowdSolveLogoLight);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { api } = useAxios();
  const dispatch = useDispatch();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!username || !password || !email) {
      toast.warning("Operación fallida", {
        description: "Por favor, complete todos los campos",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Operación fallida", {
        description: "Las contraseñas no coinciden",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/Account/SignUp", {
        username,
        email,
        password,
      });

      if (response.data.success) {
        const { token, data } = response.data;

        dispatch(setUser({
          user: data.usuario,
          token: token,
          views: Array.isArray(data.vistas) ? data.vistas : []
        }));

        navigate("/sign-up/complete");
        toast.success("Operación exitosa", {
          description: response.data.message,
        });
      } else {
        toast.warning("Operación fallida", {
          description: response.data.message,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="grid grid-cols-1 gap-4">
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
              <h2 className="mb-6 sm:mb-8 text-center text-base sm:text-lg">
                <ReactTyped
                  strings={[
                    "Despierta tu creatividad",
                    "Demuestra tu talento",
                    "Resuelve problemas",
                  ]}
                  typeSpeed={80}
                  loop
                  className="text-lg sm:text-3xl font-serif"
                  backSpeed={20}
                  cursorChar="|"
                  showCursor={true}
                  backDelay={1000}
                />
              </h2>
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

              <form onSubmit={handleSignUp} className="grid gap-4 mb-4">
                {/* Username */}
                <div className="grid gap-2">
                  <Label htmlFor="username">Nombre de usuario</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Ingrese su usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    tabIndex={2}
                    autoComplete="username"
                  />
                </div>
                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ingrese su correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    tabIndex={3}
                    autoComplete="email"
                  />
                </div>
                {/* Password */}
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <PasswordInput
                    id="password"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    tabIndex={3}
                    autoComplete="new-password"
                  />
                </div>

                {/* Confirm Password */}
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <PasswordInput
                    id="confirmPassword"
                    placeholder="Confirme su contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    tabIndex={4}
                    autoComplete="new-password"
                  />
                </div>

                {loading ? (
                  <Button disabled className="w-full" tabIndex={5}>
                    <Loading02Icon className="mr-2 h-4 w-4 animate-spin" />
                    Por favor, espere
                  </Button>
                ) : (
                  <Button type="submit" className="w-full" tabIndex={5}>
                    Crear cuenta
                  </Button>
                )}
              </form>

              <div className="mt-4 text-center text-xs">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/sign-in" className="text-primary font-medium" tabIndex={6}>
                  Iniciar Sesión
                </Link>
              </div>

              <p className="text-xs opacity-50 mt-4">
                By continuing, you agree to CrowdSolve&apos;s Consumer <Link to="/terms-of-service" target="_blank" className="text-primary font-medium">Terms</Link> and
                <Link to="/usage-policy" target="_blank" className="text-primary font-medium"> Usage Policy</Link>, and acknowledge their
                <Link to="/privacy-policy" target="_blank" className="text-primary font-medium"> Privacy Policy</Link>.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SignUp;
