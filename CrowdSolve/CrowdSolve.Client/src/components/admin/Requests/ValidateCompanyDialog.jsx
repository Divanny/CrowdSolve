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
import { useTranslation } from 'react-i18next';

export function ValidateCompanyDialog({ isOpen, onClose, onSaved, estatusId, mode  }) {
  const { t } = useTranslation();
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
      toast.success(t('validateCompanyDialog.operations.success'), {
        description: response.data.message,
      });

      onSaved()
      onClose()
      
    } else {
      toast.warning(t('validateCompanyDialog.operations.failure'), {
        description: response.data.message,
      });
      console.log(response.data);
    }
    } catch (error) {
      toast.error(t('validateCompanyDialog.operations.error'));
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
      toast.success(t('validateCompanyDialog.operations.success'), {
        description: response.data.message,
      });

      onSaved()
      onClose()
      
    } else {
      toast.warning(t('validateCompanyDialog.operations.failure'), {
        description: response.data.message,
      });
      console.log(response.data);
    }
    } catch (error) {
      toast.error(t('validateCompanyDialog.operations.error'));
      console.error('Error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{mode === "validate" ? t('validateCompanyDialog.dialog.validate_company.validate') : t('validateCompanyDialog.dialog.decline_company.reject')} {t('validateCompanyDialog.dialog.title')}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-red-500 mt-4 mb-6">
        {t('validateCompanyDialog.dialog.once')} {mode === "validate" ? t('validateCompanyDialog.dialog.validate_company.validate') : t('validateCompanyDialog.dialog.decline_company.reject')} {t('validateCompanyDialog.dialog.description')}
        </p>
        <DialogFooter>
          {mode === "validate" && (
            <Button type="submit" onClick={validarEmpresa}>
              {t('validateCompanyDialog.dialog.validate_company.button')}
            </Button>
          )}
          {mode === "decline" && (
            <Button type="submit" onClick={rechazarEmpresa}>
              {t('validateCompanyDialog.dialog.decline_company.button')}
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={onClose}>
          {t('validateCompanyDialog.dialog.close_button')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}