import { useState } from "react"
import useAxios from "@/hooks/use-axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { KeyIcon, MailIcon, LockIcon, ArrowLeftIcon } from "lucide-react"
import { useNavigate } from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { PasswordInput } from "@/components/ui/password-input"

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { api } = useAxios();

  const [step, setStep] = useState(1);

  const [user, setUser] = useState({});
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [jwtToken, setJwtToken] = useState("");

  const handleSubmitEmail = async (e) => {
    e.preventDefault()

    if (!email) {
      toast.warning("Operación fallida", {
        description: "Por favor, complete todos los campos",
      });
      return
    }

    try {
      const response = await api.get(`/api/Account/ForgotPassword/${email}`);

      if (response.data.success) {
        toast.success("Operación exitosa", {
          description: "Se ha enviado un enlace de restablecimiento a su correo electrónico",
        });

        setUser(response.data.data);
        setStep(2);
      }
      else {
        toast.error("Operación fallida", {
          description: response.data.message,
        });
      }
    }
    catch (error) {
      toast.error("Operación fallida", {
        description: error.message,
      });
    }
  }

  const handleValidateOTP = async (e) => {
    e.preventDefault()

    if (!otp) {
      toast.warning("Operación fallida", {
        description: "Por favor, complete todos los campos",
      });
      return
    }

    try {
      const response = await api.post("/api/Account/VerifyCode", {
        idUsuario: user.idUsuario,
        code: otp,
      });

      if (response.data.success) {
        toast.success("Operación exitosa", {
          description: "Código de verificación correcto",
        });

        setJwtToken(response.data.data);
        setStep(3);
      }
      else {
        toast.error("Operación fallida", {
          description: response.data.message,
        });
      }
    }
    catch (error) {
      toast.error("Operación fallida", {
        description: error.message,
      });
    }
  }

  const handleSetNewPassword = async (e) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      toast.warning("Operación fallida", {
        description: "Por favor, complete todos los campos",
      });
      return
    }

    if (password !== confirmPassword) {
      toast.warning("Operación fallida", {
        description: "Las contraseñas no coinciden",
      });
      return
    }

    try {
      const response = await api.post("/api/Account/ResetPassword", {
        password: password,
        confirmPassword: confirmPassword
      }, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });

      if (response.data.success) {
        toast.success("Operación exitosa", {
          description: "Contraseña restablecida correctamente",
        });

        navigate("/sign-in");
      }
      else {
        toast.error("Operación fallida", {
          description: response.data.message,
        });
      }
    }

    catch (error) {
      toast.error("Operación fallida", {
        description: error.message,
      });
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        {step === 1 && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full inline-block">
                <KeyIcon className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-xl md:text-2xl font-medium">¿Has olvidado tu contraseña?</CardTitle>
              <CardDescription className="text-sm md:text-base">No te preocupes, enviaremos a tu correo electrónico instrucciones para restablecerla.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitEmail}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      placeholder="Ingrese su correo electrónico"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
                <Button className="w-full mt-6" type="submit">
                  Restablecer contraseña
                </Button>
              </form>
            </CardContent>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full inline-block">
                <MailIcon className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-xl md:text-2xl font-medium">Revisa tu correo</CardTitle>
              <CardDescription className="text-sm md:text-base">Enviamos un enlace para restablecer la contraseña a<br />{email}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleValidateOTP}>
                <div className="grid w-full items-center justify-center gap-4">
                  <InputOTP id="otp" maxLength={6} value={otp} onChange={(value) => setOTP(value.replace(/\s/g, ''))}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button className="w-full mt-6" type="submit">
                  Validar enlace de restablecimiento
                </Button>
              </form>
              <p className="text-center text-sm mt-4">
                ¿No recibiste el código? <Button variant="link" className="text-primary font-medium ml-auto inline-block" onClick={(e) => handleSubmitEmail(e)}>
                  Reenviar código
                </Button>
              </p>
            </CardContent>
          </>
        )}

        {step === 3 && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full inline-block">
                <LockIcon className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-xl md:text-2xl font-medium">Establecer nueva contraseña</CardTitle>
              <CardDescription className="text-sm md:text-base">Introduzca su nueva contraseña a continuación.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSetNewPassword}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="newPassword">Nueva contraseña</Label>
                    <PasswordInput id="newPassword" placeholder="Ingrese la nueva contraseña" required value={password}
                      onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                    <PasswordInput id="confirmPassword" placeholder="Confirme la nueva contraseña" required value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
                  </div>
                </div>
                <Button className="w-full mt-6" type="submit">
                  Establecer nueva contraseña
                </Button>
              </form>
            </CardContent>
          </>
        )}
        <CardFooter>
          <Button
            variant="link"
            className="mx-auto text-foreground text-sm"
            onClick={() => navigate('/sign-in')}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Volver a iniciar sesión
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}