import CrowdSolveLogo from "@/assets/CrowdSolveLogo.svg";
import { useState } from "react";
import useAxios from "@/hooks/use-axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function CompleteSignUpForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { Role } = useParams();

  const { api } = useAxios();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="grid grid-cols-1 gap-4">
        <div className="flex grow flex-col justify-center pt-2 [@media(min-height:800px)]:pt-6 [@media(min-height:900px)]:pt-10 w-full min-h-screen px-5">
          <div className="w-full max-w-lg mx-auto">
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <img
                src={CrowdSolveLogo}
                alt="CrowdSolve Logo"
                className="h-16 sm:h-20"
              />
            </div>
            <Card className="p-4 sm:p-6 hadow-sm">
              {Role == "Company" && (
                <div>
                  <p className="text-lg text-center text-[#3c3c3c] font-semibold mb-4">
                    Registro de empresa
                  </p>
                </div>
              )}

              {Role == "Participant" && (
                <div>
                  <p className="text-lg text-[#3c3c3c] font-semibold mb-4">
                    Registro de participante
                  </p>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Nombres</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Apellidos</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                      <Calendar id="birthDate" name="birthDate" required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefono</Label>
                      <Input id="phone" name="phone" type="tel" required />
                    </div>
                    <div>
                      <Label htmlFor="educationLevel">Nivel educativo</Label>
                      <select
                        id="educationLevel"
                        name="educationLevel"
                        className="input"
                        required
                      >
                        <option value="">Seleccione su nivel educativo</option>
                        <option value="highSchool">Secundaria</option>
                        <option value="bachelor">Licenciatura</option>
                        <option value="master">Maestría</option>
                        <option value="doctorate">Doctorado</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="description">Descripcion personal</Label>
                      <Textarea id="description" name="description" required />
                    </div>
                    <Button type="submit" className="w-full">
                      Registrar
                    </Button>
                  </form>
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
