"use client";

import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export default function UserManual() {
  const { t } = useTranslation();

  // Asumimos que el PDF está en la carpeta public
  const pdfUrl = "https://localhost:5173/Manual%20de%20Usuarios%20-%20CrowdSolve.pdf";

  const renderPdfViewer = () => {
    const commonProps = {
      width: "100%",
      height: "648vh",
      border: "none",
    };

    return (
      <div>
        <iframe
          src={pdfUrl}
          {...commonProps}
          title="Manual de Usuario CrowdSolve"
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary">
            {t("UserManual.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("UserManual.description")}
          </p>
        </div>
      </div>

      <Card className="h-full overflow-hidden">
        <div>{renderPdfViewer()}</div>
      </Card>
    </div>
  );
}
