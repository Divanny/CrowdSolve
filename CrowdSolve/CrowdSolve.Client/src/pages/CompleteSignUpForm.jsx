import CrowdSolveLogo from "@/assets/CrowdSolveLogo_light.svg";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import RegistroParticipante from "@/components/signup/RegistroParticipante";
import { Button } from "@/components/ui/button";
import RegistroEmpresa from "@/components/signup/RegistroEmpresa";

function CompleteSignUpForm() {
  const { Role } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="grid grid-cols-1 gap-4">
        <div className="flex grow flex-col justify-center py-2 [@media(min-height:800px)]:py-6 [@media(min-height:900px)]:py-10 w-full min-h-screen px-5">
          <div className="w-full max-w-lg mx-auto">
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <img
                src={CrowdSolveLogo}
                alt="CrowdSolve Logo"
                className="h-16 sm:h-20"
              />
            </div>
            <div className="my-4 sm:my-6">
              <h1 className="text-xl sm:text-2xl font-semibold text-center mb-2">
                { Role == "Company" ? 'Formulario de empresa' : "Formulario de participante" }
              </h1>
            </div>

            <Button variant="link" className="text-xs" onClick={() => navigate(-1)}>
              ← Volver a seleccionar rol
            </Button>

            <Card className="p-4 sm:p-6">
              {Role == "Company" && (
                <div>
                  <RegistroEmpresa />
                </div>
              )}

              {Role == "Participant" && (
                <div>
                  <RegistroParticipante />
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CompleteSignUpForm;
