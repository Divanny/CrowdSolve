import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Instagram, Facebook, Mail, MapPin, Phone } from "lucide-react"
import { toast } from "sonner"
import { useSelector } from 'react-redux';
import useAxios from "@/hooks/use-axios";
import { Loading02Icon } from "hugeicons-react";
import ReCAPTCHA from "react-google-recaptcha"
import { useTranslation } from 'react-i18next';

export default function ContactPage() {
  const { t } = useTranslation();
  const [nombres, setFirstName] = useState("")
  const [apellidos, setLastName] = useState("")
  const [correoElectronico, setEmail] = useState("")
  const [mensaje, setMessage] = useState("")
  const [titulo, setTittle] = useState("")
  const [captchaValue, setCaptchaValue] = useState("")

  const { api } = useAxios();
  const isLoading = useSelector((state) => state.loading.isLoading);
  const idUsuario=useSelector((state) => state.user?.user?.idUsuario);
  const nombreUsuario=useSelector((state) => state.user?.user?.nombreUsuario);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombres || !apellidos || !correoElectronico || !mensaje ||!titulo) {
      toast.warning(
        {description:t('ContactUs.contact.form.toasts.incompleteFields'),
        });
      return;
    }

    if (!captchaValue) {
      toast.warning(t('ContactUs.contact.form.captchaWarning'))
      return
    }
    
    console.log(nombres,apellidos,correoElectronico,mensaje,titulo,idUsuario,nombreUsuario, isLoading);
    try {
      
      const response = await api.post("/api/Soportes/Contactanos", {
       idUsuario,
       nombreUsuario, 
       nombres, 
       apellidos, 
       correoElectronico, 
       mensaje,
       titulo
      });

      if (response.data.success==true) {
        toast.success(response.data.message);
        setFirstName("")
        setLastName("")
        setEmail("")
        setMessage("")
        setTittle("");
        
      }

      if (typeof window !== 'undefined' && window.grecaptcha) {
        window.grecaptcha.reset()
      }

    } catch (error) {
      console.error(error)
      toast.error(t('ContactUs.contact.form.toasts.error'))
    }
  }

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value); 
  };

  return (
    <div className="bg-background text-foreground font-['Poppins',sans-serif] p-6">
      <main className="container mx-auto mt-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h1 className="text-3xl font-bold mb-4">{t('ContactUs.contact.title')}</h1>
            <p className="mb-8 text-muted-foreground">
            {t('ContactUs.contact.description')}
            </p>
            <div className="flex flex-col space-y-4">
              <a href="https://www.instagram.com/crowdsolve" target="_blank" rel="noopener noreferrer" className="flex items-center text-foreground hover:text-primary transition-colors w-fit">
                <Instagram className="text-primary mr-2" />
                <span>Instagram</span>
              </a>
              <a href="https://www.facebook.com/crowdsolve" target="_blank" rel="noopener noreferrer" className="flex items-center text-foreground hover:text-primary transition-colors w-fit">
                <Facebook className="text-primary mr-2" />
                <span>Facebook</span>
              </a>
              <a href="mailto:tu-correo@ejemplo.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-foreground hover:text-primary transition-colors w-fit">
                <Mail className="text-primary mr-2" />
                <span>{t('ContactUs.contact.socials.email')}</span>
              </a>
              <a href="https://www.google.com/maps/search/intec/@18.4877513,-69.964905,17z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI0MTAyMi4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="flex items-center text-foreground hover:text-primary transition-colors w-fit">
                <MapPin className="text-primary mr-2" />
                <span>{t('ContactUs.contact.socials.location')}</span>
              </a>
              <a href="tel:+1234567890" target="_blank" rel="noopener noreferrer" className="flex items-center text-foreground hover:text-primary transition-colors w-fit">
                <Phone className="text-primary mr-2" />
                <span>{t('ContactUs.contact.socials.phone')}</span>
              </a>
            </div>
          </div>
          <div>
            <Card className="bg-card rounded-3xl shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">{t('ContactUs.contact.form.title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input  
                      placeholder={t('ContactUs.contact.form.fields.subject')} 
                      className="bg-background text-foreground border-input"
                      value={titulo}
                      onChange={(e) => setTittle(e.target.value)}
                      required
                    />
                  <div className="grid grid-cols-2 gap-4">
                    
                    <Input 
                      placeholder={t('ContactUs.contact.form.fields.firstName')}
                      className="bg-background text-foreground border-input"
                      value={nombres}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                    <Input 
                      placeholder={t('ContactUs.contact.form.fields.lastName')}
                      className="bg-background text-foreground border-input"
                      value={apellidos}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  <Input 
                    type="email" 
                    placeholder={t('ContactUs.contact.form.fields.email')}
                    className="bg-background text-foreground border-input"
                    value={correoElectronico}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Textarea 
                    placeholder={t('ContactUs.contact.form.fields.message')} 
                    rows={4} 
                    className="bg-background text-foreground border-input"
                    value={mensaje}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                  
                  
                  <ReCAPTCHA
                    sitekey="6LfF6WsqAAAAADtTf5-U0T10bwZWpZhu9P2rA9aw"
                    onChange={handleCaptchaChange}
                  />
                  

                  {isLoading ? (
                  <Button disabled className="w-full" tabIndex={5}>
                    <Loading02Icon className="mr-2 h-4 w-4 animate-spin" />
                    {t('ContactUs.contact.form.submit.loading')}
                  </Button>
                ) : (
                  <Button type="submit" className="w-full" tabIndex={5}>
                    {t('ContactUs.contact.form.submit.default')}
                  </Button>
                )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}