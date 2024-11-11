import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"

function PrivacyPolicy() {
  return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mt-8 mb-8 md:mb-16 md:mt-16">
              Pol&iacute;tica de Privacidad
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <p className="text-lg mb-2 md:mb-0">Efectiva desde el 8 de agosto, 2024</p>
          </div>

          <div className="space-y-6 text-lg">
              <p>
                  En CrowdSolve, valoramos y respetamos tu privacidad. Esta Pol&iacute;tica de Privacidad explica c&oacute;mo recopilamos,
                  utilizamos y protegemos tu informaci&oacute;n personal cuando utilizas nuestra plataforma y servicios.
              </p>

              <div className="border-t pt-6 mt-8">
                  <h2 className="text-2xl font-bold mb-4">1. Informaci&oacute;n que Recopilamos</h2>
                  <p>
                      Recopilamos la siguiente informaci&oacute;n:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Informaci&oacute;n de registro: nombre, direcci&oacute;n de correo electr&oacute;nico, contrase&ntilde;a.</li>
                      <li>Informaci&oacute;n de perfil: experiencia profesional, habilidades, foto de perfil (opcional).</li>
                      <li>Contenido generado por el usuario: propuestas, comentarios, votaciones.</li>
                      <li>Informaci&oacute;n de uso: interacciones con la plataforma, participaci&oacute;n en desaf&iacute;os.</li>
                      <li>Informaci&oacute;n de pago: para procesar recompensas (solo para participantes ganadores).</li>
                  </ul>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">2. C&oacute;mo Utilizamos tu Informaci&oacute;n</h2>
                  <p>
                      Utilizamos tu informaci&oacute;n para:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Proporcionar y mejorar nuestros servicios.</li>
                      <li>Facilitar la participaci&oacute;n en desaf&iacute;os y la colaboraci&oacute;n entre usuarios.</li>
                      <li>Procesar pagos y recompensas.</li>
                      <li>Enviar notificaciones relacionadas con el servicio y actualizaciones.</li>
                      <li>Prevenir fraudes y garantizar la seguridad de la plataforma.</li>
                  </ul>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">3. Compartir Informaci&oacute;n</h2>
                  <p>
                      Compartimos tu informaci&oacute;n en las siguientes circunstancias:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Con empresas que publican desaf&iacute;os, limitado a la informaci&oacute;n necesaria para evaluar propuestas.</li>
                      <li>Con proveedores de servicios que nos ayudan a operar la plataforma.</li>
                      <li>Cuando sea requerido por ley o para proteger nuestros derechos legales.</li>
                  </ul>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">4. Seguridad de Datos</h2>
                  <p>
                      Implementamos medidas de seguridad t&eacute;cnicas y organizativas para proteger tu informaci&oacute;n personal
                      contra acceso no autorizado, p&eacute;rdida o alteraci&oacute;n. Sin embargo, ninguna transmisi&oacute;n de datos por
                      Internet es 100% segura.
                  </p>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">5. Tus Derechos</h2>
                  <p>
                      Tienes derecho a:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Acceder a tu informaci&oacute;n personal.</li>
                      <li>Corregir datos inexactos.</li>
                      <li>Solicitar la eliminaci&oacute;n de tus datos.</li>
                      <li>Oponerte al procesamiento de tus datos.</li>
                      <li>Solicitar la portabilidad de tus datos.</li>
                  </ul>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">6. Cookies y Tecnolog&iacute;as Similares</h2>
                  <p>
                      Utilizamos cookies y tecnolog&iacute;as similares para mejorar la experiencia del usuario, analizar el tr&aacute;fico
                      y personalizar el contenido. Puedes controlar el uso de cookies a trav&eacute;s de la configuraci&oacute;n de tu navegador.
                  </p>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">7. Cambios en la Pol&iacute;tica de Privacidad</h2>
                  <p>
                      Podemos actualizar esta Pol&iacute;tica de Privacidad ocasionalmente. Te notificaremos sobre cambios significativos
                      mediante un aviso en nuestra plataforma o por correo electr&oacute;nico.
                  </p>
              </div>

              <div className="border-t pt-6 mt-8">
                  <p className="font-medium">
                      Si tienes preguntas sobre esta Pol&iacute;tica de Privacidad, por favor cont&aacute;ctanos en{" "}
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
                      <Link to="/usage-policy">
                          Ver Pol&iacute;tica de Uso Aceptable
                      </Link>
                  </Button>
              </div>
          </div>
      </div>
  );
}

export default PrivacyPolicy;