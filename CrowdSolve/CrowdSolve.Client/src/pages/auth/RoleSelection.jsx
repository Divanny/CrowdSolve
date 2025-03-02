import CrowdSolveLogoLight from '@/assets/CrowdSolveLogo_light.svg';
import CrowdSolveLogoDark from '@/assets/CrowdSolveLogo_dark.svg';
import { useState } from "react";
import { useSelector } from 'react-redux';
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight02Icon } from "hugeicons-react";

import Empresas from "@/assets/roles/Empresas.svg";
import Participantes from "@/assets/roles/Participantes.svg";
import { useTranslation } from 'react-i18next';

function RoleSelection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const theme = useSelector((state) => state.theme.theme);
  const CrowdSolveLogo = theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? CrowdSolveLogoDark : CrowdSolveLogoLight) : (theme === 'dark' ? CrowdSolveLogoDark : CrowdSolveLogoLight);

  const handleRoleSelect = (role) => {
    if (selectedRole === role) {
      setSelectedRole(null);
      return;
    }
    setSelectedRole(role);
  };

  const handleNext = () => {
    if (selectedRole) {
      navigate(`/sign-up/complete/${selectedRole}`);
    } else {
      toast.error(t('RoleSelection.errorMessage'), {
        description: t('RoleSelection.errorMessageDescription'),
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="grid grid-cols-1 gap-4">
        <div className="flex grow flex-col justify-center py-2 [@media(min-height:800px)]:py-6 [@media(min-height:900px)]:py-10 w-full min-h-screen px-5">
          <div className="w-full max-w-lg mx-auto">
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <img
                src={CrowdSolveLogo}
                alt="CrowdSolve Logo"
                className="h-12 sm:h-16 md:h-20"
              />
            </div>

            <div>
              <div className="my-4">
                <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-2">
                {t('RoleSelection.selectRoleTitle')}
                </h1>
                <h2 className="text-base sm:text-lg font-semibold text-center text-muted-foreground mb-6">
                {t('RoleSelection.selectRoleSubtitle')}
                </h2>
              </div>
              <div className="justify-center my-4 sm:my-8 grid grid-cols-1 gap-4 min-[1000px]:grid-cols-2">
                <Card
                  className={`cursor-pointer p-4 sm:p-6 transition-all duration-300 transform hover:scale-105 ${
                    selectedRole === "company"
                      ? "border-primary"
                      : "border"
                  }`}
                  onClick={() => handleRoleSelect("company")}
                >
                  <img
                    src={Empresas}
                    alt="Empresas"
                    className={`h-24 sm:h-36 mx-auto transition-all duration-300 ${
                      selectedRole === "company" ? "grayscale-0" : "grayscale"
                    }`}
                  />
                  <h3 className="text-center mt-4 text-base sm:text-lg font-semibold">
                  {t('RoleSelection.companyRoleTitle')}
                  </h3>
                  <p className="text-center text-muted-foreground mt-2 text-sm">
                  {t('RoleSelection.companyRoleDescription')}
                  </p>
                </Card>
                <Card
                  className={`cursor-pointer p-4 sm:p-6 transition-all duration-300 transform hover:scale-105 ${
                    selectedRole === "participant"
                      ? "border-primary"
                      : "border"
                  }`}
                  onClick={() => handleRoleSelect("participant")}
                >
                  <img
                    src={Participantes}
                    alt="Participantes"
                    className={`h-24 sm:h-36 mx-auto transition-all duration-300 ${
                      selectedRole === "participant"
                        ? "grayscale-0"
                        : "grayscale"
                    }`}
                  />
                  <h3 className="text-center mt-4 text-base sm:text-lg font-semibold">
                  {t('RoleSelection.participantRoleTitle')}
                  </h3>
                  <p className="text-center text-muted-foreground mt-2 text-sm">
                  {t('RoleSelection.participantRoleDescription')}
                  </p>
                </Card>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={handleNext}
                  className="px-4 py-2 sm:px-6 sm:py-3 text-white rounded-lg shadow-md group w-full"
                  disabled={!selectedRole}
                >
                  {t('RoleSelection.nextButton')}
                  <ArrowRight02Icon className="ml-2 w-4 h-4 sm:w-6 sm:h-6 transition-all duration-300 hidden opacity-0 group-hover:block group-hover:opacity-100" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RoleSelection;