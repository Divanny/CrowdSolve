import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { KeyIcon, MailIcon, LockIcon, ArrowLeftIcon } from "lucide-react"
import { Link, useNavigate } from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { PasswordInput } from "@/components/ui/password-input"

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")

  const handleSubmitEmail = (e) => {
    e.preventDefault()
    setStep(2)
  }

  const handleValidateOTP = () => {
    setStep(3)
  }

  const handleSetNewPassword = (e) => {
    e.preventDefault()
    // Here you would typically send the new password to your backend
    alert("Password reset successfully!")
    setStep(1)
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
              <CardTitle className="text-2xl font-medium">¿Has olvidado tu contraseña?</CardTitle>
              <CardDescription>No te preocupes, enviaremos a tu correo electrónico instrucciones para restablecerla.</CardDescription>
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
              <CardTitle className="text-2xl font-medium">Revisa tu correo</CardTitle>
              <CardDescription>Enviamos un enlace para restablecer la contraseña a<br />{email}</CardDescription>
            </CardHeader>
            <CardContent>

              <form onSubmit={handleValidateOTP}>
                <div className="grid w-full items-center justify-center gap-4">
                    <InputOTP id="otp" maxLength={6}>
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
                ¿No recibiste el código? <Link className="text-primary font-medium ml-auto inline-block" >
                  Reenviar código
                </Link>
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
              <CardTitle className="text-2xl font-medium">Establecer nueva contraseña</CardTitle>
              <CardDescription>Introduzca su nueva contraseña a continuación.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSetNewPassword}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="newPassword">New Password</Label>
                    <PasswordInput id="newPassword" placeholder="Ingrese su contraseña" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <PasswordInput id="confirmPassword" placeholder="Ingrese su contraseña" required />
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