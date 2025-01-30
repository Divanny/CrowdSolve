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
import { useTranslation } from 'react-i18next';

export default function ForgotPassword() {
  const { t } = useTranslation();
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
      toast.warning(t('ForgotPassword.toastMessages.operationFailed'), {
        description: t('ForgotPassword.toastMessages.pleaseCompleteFields'),
      });
      return
    }

    try {
      const response = await api.get(`/api/Account/ForgotPassword/${email}`);

      if (response.data.success) {
        toast.success(t('ForgotPassword.toastMessages.operationSuccessful'), {
          description: t('ForgotPassword.toastMessages.resetPasswordLinkSent'),
        });

        setUser(response.data.data);
        setStep(2);
      }
      else {
        toast.error(t('ForgotPassword.toastMessages.operationFailed'), {
          description: response.data.message,
        });
      }
    }
    catch (error) {
      toast.error(t('ForgotPassword.toastMessages.operationFailed'), {
        description: error.message,
      });
    }
  }

  const handleValidateOTP = async (e) => {
    e.preventDefault()

    if (!otp) {
      toast.warning(t('ForgotPassword.toastMessages.operationFailed'), {
        description: t('ForgotPassword.toastMessages.pleaseCompleteFields'),
      });
      return
    }

    try {
      const response = await api.post("/api/Account/VerifyCode", {
        idUsuario: user.idUsuario,
        code: otp,
      });

      if (response.data.success) {
        toast.success(t('ForgotPassword.toastMessages.operationSuccessful'), {
          description: t('ForgotPassword.toastMessages.verificationCodeCorrect'),
        });

        setJwtToken(response.data.data);
        setStep(3);
      }
      else {
        toast.error(t('ForgotPassword.toastMessages.operationFailed'), {
          description: response.data.message,
        });
      }
    }
    catch (error) {
      toast.error(t('ForgotPassword.toastMessages.operationFailed'), {
        description: error.message,
      });
    }
  }

  const handleSetNewPassword = async (e) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      toast.warning(t('ForgotPassword.toastMessages.operationFailed'), {
        description: t('ForgotPassword.toastMessages.pleaseCompleteFields'),
      });
      return
    }

    if (password !== confirmPassword) {
      toast.warning(t('ForgotPassword.toastMessages.operationFailed'), {
        description: t('ForgotPassword.toastMessages.passwordMismatch'),
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
        toast.success(t('ForgotPassword.toastMessages.operationSuccessful'), {
          description: t('ForgotPassword.toastMessages.passwordResetSuccessful'),
        });

        navigate("/sign-in");
      }
      else {
        toast.error(t('ForgotPassword.toastMessages.operationFailed'), {
          description: response.data.message,
        });
      }
    }

    catch (error) {
      toast.error(t('ForgotPassword.toastMessages.operationFailed'), {
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
              <CardTitle className="text-xl md:text-2xl font-medium">{t('ForgotPassword.passwordRecovery.forgotPasswordTitle')}</CardTitle>
              <CardDescription className="text-sm md:text-base">{t('ForgotPassword.passwordRecovery.forgotPasswordDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitEmail}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">{t('ForgotPassword.passwordRecovery.emailLabel')}</Label>
                    <Input
                      id="email"
                      placeholder={t('ForgotPassword.passwordRecovery.emailPlaceholder')}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
                <Button className="w-full mt-6" type="submit">
                {t('ForgotPassword.passwordRecovery.resetPasswordButton')}
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
              <CardTitle className="text-xl md:text-2xl font-medium">{t('ForgotPassword.passwordRecovery.checkEmailTitle')}</CardTitle>
              <CardDescription className="text-sm md:text-base">{t('ForgotPassword.passwordRecovery.checkEmailDescription')}<br />{email}</CardDescription>
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
                {t('ForgotPassword.passwordRecovery.validateLinkButton')}
                </Button>
              </form>
              <p className="text-center text-sm mt-4">
              {t('ForgotPassword.passwordRecovery.resendCodeLink')} <Button variant="link" className="text-primary font-medium ml-auto inline-block" onClick={(e) => handleSubmitEmail(e)}>
              {t('ForgotPassword.passwordRecovery.resendCodeBt')}
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
              <CardTitle className="text-xl md:text-2xl font-medium">{t('ForgotPassword.passwordRecovery.setNewPasswordTitle')}</CardTitle>
              <CardDescription className="text-sm md:text-base">{t('ForgotPassword.passwordRecovery.setNewPasswordDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSetNewPassword}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="newPassword">{t('ForgotPassword.passwordRecovery.newPasswordLabel')}</Label>
                    <PasswordInput id="newPassword" placeholder="Ingrese la nueva contraseña" required value={password}
                      onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="confirmPassword">{t('ForgotPassword.passwordRecovery.confirmPasswordLabel')}</Label>
                    <PasswordInput id="confirmPassword" placeholder={t('ForgotPassword.passwordRecovery.confirmPasswordLabel')} required value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
                  </div>
                </div>
                <Button className="w-full mt-6" type="submit">
                {t('ForgotPassword.passwordRecovery.setNewPasswordButton')}
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
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> {t('ForgotPassword.passwordRecovery.backToSignInButton')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}