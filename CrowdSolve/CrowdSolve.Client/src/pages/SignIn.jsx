import CrowdSolveLogo from "@/assets/CrowdSolveLogo.svg";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import useAxios from "@/hooks/use-axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ReactTyped } from "react-typed";
import { Card } from "@/components/ui/card";

function SignIn() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { api } = useAxios();

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.warning("Operación fallida", {
        description: "Por favor, complete todos los campos",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/Account/LogIn", {
        username,
        password,
      });

      console.log(response);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.data.usuario.nombreUsuario)
        );
        navigate("/");

        toast.success("Operación exitosa", {
          description: "Inicio de sesión exitoso",
        });
      } else {
        toast.warning("Operación fallida", {
          description: response.data.message,
        });
      }
    } catch (error) {
      toast.error("Operación fallida", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="grid grid-cols-1 gap-4 min-[1000px]:grid-cols-2">
        <div className="flex grow flex-col justify-center pt-2 [@media(min-height:800px)]:pt-6 [@media(min-height:900px)]:pt-10 w-full min-h-screen px-5">
          <div className="w-full max-w-md mx-auto">
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <img
                src={CrowdSolveLogo}
                alt="CrowdSolve Logo"
                className="h-14 sm:h-16"
              />
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
                className="text-lg sm:text-3xl font-serif text-[#3c3c3c]"
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
              <p className="text-sm text-center text-[#3c3c3c] mb-4">
                Empieza usando CrowdSolve para ti o tu empresa
              </p>

              <Button
                variant="outline"
                className="w-full  bg-white text-[#3c3c3c] border-[#d1d1d1]"
                tabIndex={1}
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
                Continuar con Google
              </Button>

              <div className="text-center text-sm text-[#3c3c3c] my-2">O</div>

              <form onSubmit={handleSignIn} className="grid gap-4 mb-4">
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
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Contraseña</Label>
                    <a
                      href="/forgot-password"
                      className="ml-auto inline-block text-xs underline text-right"
                      tabIndex={4}
                    >
                      ¿Has olvidado tu contraseña?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    tabIndex={3}
                  />
                </div>

                {loading ? (
                  <Button disabled className="w-full" tabIndex={5}>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
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
                <a href="#" className="underline" tabIndex={6}>
                  Registrarse
                </a>
              </div>

              <p className="text-xs text-[#3c3c3c] mt-4">
                By continuing, you agree to CrowdSolve&apos;s Consumer Terms and
                Usage Policy, and acknowledge their Privacy Policy.
              </p>
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
