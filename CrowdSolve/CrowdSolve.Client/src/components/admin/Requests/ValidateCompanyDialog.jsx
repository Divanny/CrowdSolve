import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import useAxios from "@/hooks/use-axios"
import { toast } from "sonner";


export function ValidateCompanyDialog({ isOpen, onClose, onSaved, estatusId, mode  }) {
  const { api } = useAxios();
  const [validateCompany, setValidateCompany] = useState(estatusId)

  useEffect(() => {
    console.log(estatusId);
    setValidateCompany(estatusId)
  }, [estatusId])


  const validarEmpresa = async () => {
    try {
      const response = await api.put(`api/Empresas/Aprobar/${validateCompany}`,null, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(validateCompany);
  
       // Check if the response was successful
    if (response.data.success) {
      toast.success("Operación exitosa", {
        description: response.data.message,
      });

      onSaved()
      onClose()
      
    } else {
      toast.warning("Operación fallida", {
        description: response.data.message,
      });
      console.log(response.data);
    }
    } catch (error) {
      toast.error('Hubo un error al realizar la operación');
      console.error('Error:', error);
    }
  };



  const rechazarEmpresa = async () => {
    try {
      const response = await api.put(`api/Empresas/Rechazar/${validateCompany}`,null, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(validateCompany);
  
       // Check if the response was successful
    if (response.data.success) {
      toast.success("Operación exitosa", {
        description: response.data.message,
      });

      onSaved()
      onClose()
      
    } else {
      toast.warning("Operación fallida", {
        description: response.data.message,
      });
      console.log(response.data);
    }
    } catch (error) {
      toast.error('Hubo un error al realizar la operación');
      console.error('Error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{mode === "validate" ? "Validar" : "Rechazar"} Empresa</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-red-500 mt-4 mb-6">
          Una vez {mode === "validate" ? "Validada" : "Rechazada"} la Empresa, no se podrá recuperar a menos que se solicite nuevamente.
        </p>
        <DialogFooter>
          {mode === "validate" && (
            <Button type="submit" onClick={validarEmpresa}>
              Validar Empresa
            </Button>
          )}
          {mode === "decline" && (
            <Button type="submit" onClick={rechazarEmpresa}>
              Rechazar Empresa
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}