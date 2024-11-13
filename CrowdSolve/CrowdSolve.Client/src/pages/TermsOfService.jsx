import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"

function TermOfService() {
  return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mt-8 mb-8 md:mb-16 md:mt-16">
              T&eacute;rminos de Servicio
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <p className="text-lg mb-2 md:mb-0">Efectivo desde el 8 de agosto, 2024</p>
          </div>

          <div className="space-y-6 text-lg">

              <p className="font-medium">
                  &iexcl;Bienvenido a CrowdSolve! Antes de acceder a nuestros servicios, por favor lee estos T&eacute;rminos de Servicio.
              </p>

              <p>
                  Estos T&eacute;rminos de Servicio (&quot;T&eacute;rminos&quot;) rigen tu uso de CrowdSolve, incluyendo nuestra plataforma web,
                  herramientas de colaboraci&oacute;n, y todos los servicios asociados (en conjunto, nuestros &quot;Servicios&quot;).
                  Estos T&eacute;rminos son un contrato entre t&uacute; y CrowdSolve. Al acceder a nuestros Servicios, aceptas estos T&eacute;rminos.
              </p>

              <p>
                  Por favor, lee nuestra{" "}
                    <Link
                        to="/privacy-policy"
                        className="text-primary hover:text-primary/80 transition-colors"
                    >
                        Pol&iacute;tica de Privacidad
                    </Link>
                  , que describe c&oacute;mo recopilamos y utilizamos la informaci&oacute;n personal.
              </p>

              <div className="border-t pt-6 mt-8">
                  <h2 className="text-2xl font-bold mb-4">1. Uso de nuestros Servicios</h2>
                  <p>
                      Nuestros Servicios est&aacute;n dise&ntilde;ados para conectar empresas con una comunidad global de solucionadores.
                      Debes seguir todas las pol&iacute;ticas puestas a tu disposici&oacute;n dentro de los Servicios. Solo puedes usar nuestros
                      Servicios seg&uacute;n lo permitido por la ley. Podemos suspender o dejar de proporcionarte nuestros Servicios si
                      no cumples con nuestros t&eacute;rminos o pol&iacute;ticas o si estamos investigando una sospecha de mala conducta.
                  </p>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">2. Tu Cuenta</h2>
                  <p>
                      Necesitas una cuenta para utilizar CrowdSolve. Eres responsable de mantener la seguridad de tu cuenta y de
                      cualquier actividad que ocurra a trav&eacute;s de ella. Mant&eacute;n tu contrase&ntilde;a segura y cont&aacute;ctanos inmediatamente si
                      detectas cualquier uso no autorizado de tu cuenta. Tu cuenta puede ser para una empresa que publica desaf&iacute;os
                      o para un participante que propone soluciones.
                  </p>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">3. Publicaci&oacute;n de Desaf&iacute;os y Participaci&oacute;n</h2>
                  <p>
                      Las empresas pueden publicar desaf&iacute;os en nuestra plataforma. Al hacerlo, aceptas proporcionar informaci&oacute;n
                      precisa sobre los requisitos, plazos y recompensas. Los participantes pueden enviar propuestas para estos
                      desaf&iacute;os. Al participar, garantizas que tu propuesta es original y no infringe los derechos de terceros.
                  </p>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">4. Propiedad Intelectual</h2>
                  <p>
                      Los derechos de propiedad intelectual de las propuestas ganadoras se transferir&aacute;n a la empresa que public&oacute;
                      el desaf&iacute;o, seg&uacute;n los t&eacute;rminos espec&iacute;ficos de cada reto. CrowdSolve no reclama la propiedad de las propuestas
                      no ganadoras. Respetamos los derechos de propiedad intelectual y esperamos que todos los usuarios hagan lo mismo.
                  </p>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">5. Pagos y Recompensas</h2>
                  <p>
                      Las empresas son responsables de proporcionar las recompensas prometidas a los ganadores de los desaf&iacute;os.
                      CrowdSolve facilita el proceso de pago pero no es responsable de los incumplimientos por parte de las empresas.
                      Los participantes son responsables de cualquier impuesto aplicable a las recompensas recibidas.
                  </p>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">6. Privacidad y Protecci&oacute;n de Datos</h2>
                  <p>
                      Nuestra pol&iacute;tica de privacidad explica c&oacute;mo tratamos tus datos personales y protegemos tu privacidad cuando
                      utilizas nuestros Servicios. Al usar CrowdSolve, aceptas que podemos usar dichos datos de acuerdo con nuestra
                      pol&iacute;tica de privacidad. Nos comprometemos a proteger la confidencialidad de la informaci&oacute;n sensible compartida
                      en los desaf&iacute;os.
                  </p>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">7. Modificaciones a los T&eacute;rminos</h2>
                  <p>
                      Podemos modificar estos T&eacute;rminos de vez en cuando. Te notificaremos de cualquier cambio significativo en los
                      T&eacute;rminos. Tu uso continuado de nuestros Servicios despu&eacute;s de dichos cambios constituye tu aceptaci&oacute;n de los
                      nuevos T&eacute;rminos.
                  </p>
              </div>

              <div className="border-t pt-6 mt-8">
                  <p className="font-medium">
                      Al utilizar CrowdSolve, aceptas estos T&eacute;rminos de Servicio. Si no est&aacute;s de acuerdo con estos T&eacute;rminos, por favor,
                      no uses nuestros Servicios. Si tienes alguna pregunta sobre estos T&eacute;rminos, cont&aacute;ctanos en{" "}
                      <a href="mailto:soporte@crowdsolve.site" className="text-primary hover:text-primary/80 transition-colors">
                          soporte@crowdsolve.site
                      </a>
                      .
                  </p>
              </div>

              <div className="mt-8 space-x-4">
                  <Button asChild>
                      <Link to="/usage-policy">
                          Ver Pol&iacute;tica de Uso Aceptable
                      </Link>
                  </Button>
                  <Button asChild variant="outline">
                      <Link to="/privacy-policy">
                          Ver Pol&iacute;tica de Privacidad
                      </Link>
                  </Button>
              </div>
          </div>
      </div>
  );
}

export default TermOfService;