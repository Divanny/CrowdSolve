import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";

function UsagePolicy() {
  return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mt-8 mb-8 md:mb-16 md:mt-16">
              Pol&iacute;tica de Uso Aceptable
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <p className="text-lg mb-2 md:mb-0">Efectiva desde el 8 de agosto, 2024</p>
          </div>

          <div className="space-y-6 text-lg">
              <p>
                  Esta Pol&iacute;tica de Uso Aceptable (&quot;PUA&quot;) describe las pr&aacute;cticas prohibidas cuando utilizas
                  CrowdSolve. Al usar nuestra plataforma, aceptas cumplir con esta PUA. CrowdSolve se reserva el derecho
                  de modificar esta pol&iacute;tica en cualquier momento.
              </p>

              <div className="border-t pt-6 mt-8">
                  <h2 className="text-2xl font-bold mb-4">1. Conducta General</h2>
                  <p>
                      Los usuarios de CrowdSolve deben:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Cumplir con todas las leyes aplicables.</li>
                      <li>Respetar los derechos de propiedad intelectual.</li>
                      <li>Ser honestos y transparentes en todas las interacciones.</li>
                      <li>Mantener la confidencialidad de la informaci&oacute;n sensible compartida en los desaf&iacute;os.</li>
                      <li>Tratar a otros usuarios con respeto y profesionalismo.</li>
                  </ul>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">2. Actividades Prohibidas</h2>
                  <p>
                      Los usuarios no deben:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Publicar contenido ilegal, difamatorio, acosador, obsceno o fraudulento.</li>
                      <li>Infringir los derechos de propiedad intelectual de terceros.</li>
                      <li>Utilizar la plataforma para distribuir spam o malware.</li>
                      <li>Intentar acceder sin autorizaci&oacute;n a cuentas o sistemas de otros usuarios.</li>
                      <li>Manipular los sistemas de votaci&oacute;n o evaluaci&oacute;n de la plataforma.</li>
                      <li>Crear m&uacute;ltiples cuentas para eludir las reglas o ganar ventaja injusta.</li>
                      <li>Revelar informaci&oacute;n confidencial de otros usuarios o empresas sin autorizaci&oacute;n.</li>
                  </ul>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">3. Contenido de los Desaf&iacute;os</h2>
                  <p>
                      Las empresas que publican desaf&iacute;os deben:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Proporcionar informaci&oacute;n precisa y clara sobre los requisitos del desaf&iacute;o.</li>
                      <li>Establecer t&eacute;rminos justos para la transferencia de propiedad intelectual.</li>
                      <li>Cumplir con las promesas de recompensas y plazos establecidos.</li>
                      <li>No solicitar soluciones para actividades ilegales o no &eacute;ticas.</li>
                  </ul>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">4. Propuestas y Soluciones</h2>
                  <p>
                      Los participantes que env&iacute;an propuestas deben:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Presentar solo trabajo original o tener los derechos necesarios para el contenido enviado.</li>
                      <li>Respetar la confidencialidad de la informaci&oacute;n proporcionada en los desaf&iacute;os.</li>
                      <li>No copiar o plagiar el trabajo de otros participantes.</li>
                      <li>Proporcionar informaci&oacute;n precisa sobre sus habilidades y experiencia.</li>
                  </ul>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">5. Uso de la Plataforma</h2>
                  <p>
                      Los usuarios no deben:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Intentar interferir con el funcionamiento adecuado de la plataforma.</li>
                      <li>Utilizar bots, scrapers u otros medios automatizados para acceder a CrowdSolve.</li>
                      <li>Recopilar informaci&oacute;n de otros usuarios sin su consentimiento.</li>
                      <li>Vender o transferir su cuenta a terceros.</li>
                  </ul>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">6. Consecuencias del Incumplimiento</h2>
                  <p>
                      El incumplimiento de esta PUA puede resultar en:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Eliminaci&oacute;n del contenido infractor.</li>
                      <li>Suspensi&oacute;n o terminaci&oacute;n de la cuenta del usuario.</li>
                      <li>Descalificaci&oacute;n de desaf&iacute;os actuales o futuros.</li>
                      <li>Acciones legales en casos graves de violaci&oacute;n.</li>
                  </ul>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">7. Reportar Violaciones</h2>
                  <p>
                      Si observas contenido o comportamiento que viola esta PUA, por favor rep&oacute;rtalo inmediatamente a
                      nuestro equipo de moderaci&oacute;n. Valoramos tu ayuda para mantener CrowdSolve como un espacio
                      seguro y productivo para todos.
                  </p>
              </div>

              <div className="border-t pt-6 mt-8">
                  <p className="font-medium">
                      Si tienes preguntas sobre esta Pol&iacute;tica de Uso Aceptable, por favor cont&aacute;ctanos en{" "}
                      <a href="mailto:soporte@crowdsolve.site" className="text-primary hover:text-primary/80 transition-colors">
                          soporte@crowdsolve.site
                      </a>
                      .
                  </p>
              </div>

              <div className="mt-8 space-x-4">
                  <Button asChild>
                      <Link to="/terms-of-service">
                          Ver T&eacute;rminos de Servicio
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

export default UsagePolicy;