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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useTranslation } from 'react-i18next';

export function SupportDialog({ isOpen, onClose, onSaved, support, mode  }) {
  const { t } = useTranslation();
  const { api } = useAxios();
  const [supportRequest, setSupportRequest] = useState(support)



  useEffect(() => {
    setSupportRequest(support)
  }, [support])


  const FinalizarSoporte = async () => {
    try {
      const response = await api.put(`api/Soportes/Finalizar/${supportRequest}`,null, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
       // Check if the response was successful
    if (response.data.success) {
      toast.success(t('SupportRequestDialog.successfulOperation'), {
        description: response.data.message,
      });

      onSaved()
      onClose()
      
    } else {
      toast.warning(t('SupportRequestDialog.failedOperation'), {
        description: response.data.message,
      });
    }
    } catch (error) {
      toast.error(t('SupportRequestDialog.operationError'));
      console.error('Error:', error);
    }
  };



  const DescartarSoporte = async () => {
    try {
      const response = await api.put(`api/Soportes/Descartar/${supportRequest}`,null, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
       // Check if the response was successful
    if (response.data.success) {
      toast.success(t('SupportRequestDialog.successfulOperation'), {
        description: response.data.message,
      });

      onSaved()
      onClose()
      
    } else {
      toast.warning(t('SupportRequestDialog.failedOperation'), {
        description: response.data.message,
      });
    }
    } catch (error) {
      toast.error(t('SupportRequestDialog.operationError'));
      console.error('Error:', error);
    }
  };

  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {mode !="view" && (
      <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{mode === "closeSupport" ? t('SupportRequestDialog.finalize') : t('SupportRequestDialog.discard')} {t('SupportRequestDialog.SupportRequest')}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-red-500 mt-4 mb-6">
        {t('SupportRequestDialog.Once')} {mode === "closeSupport" ? t('SupportRequestDialog.finalized') : t('SupportRequestDialog.discarded')} {t('SupportRequestDialog.Confirmation')}
        </p>
        <DialogFooter>
          {mode === "closeSupport" && (
            <Button type="submit" onClick={FinalizarSoporte}>
              {t('SupportRequestDialog.finalizeSupport')}
            </Button>
          )}
          {mode === "declineSupport" && (
            <Button type="submit" onClick={DescartarSoporte}>
              {t('SupportRequestDialog.discardSupport')}
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={onClose}>
          {t('SupportRequestDialog.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
      )}

      {mode=="view" && (
      <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle> {t('SupportRequestDialog.viewSupportRequest')}</DialogTitle>
        </DialogHeader>
        <form className="space-y-2">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="usuarioAfectado">{t('SupportRequestDialog.affectedUser')}</Label>
              <Input
                id="usuarioAfectado"
                name="usuarioAfectado"
                value={supportRequest.nombreUsuario}
                disabled={mode === "view"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="titulo">{t('SupportRequestDialog.title')}</Label>
              <Input
                id="titulo"
                name="titulo"
                value={supportRequest.titulo}
                disabled={mode === "view"}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mensaje">{t('SupportRequestDialog.message')}</Label>
            <Textarea
              id="mensaje"
              name="mensaje"
              placeholder="Ingrese una descripción"
              value={supportRequest.mensaje}
              rows={4}
              autoComplete="off"
              disabled={mode === "view"}
            />

            <div className="space-y-2">
              <Label htmlFor="soporte">{t('SupportRequestDialog.supportDate')}</Label>
              <Input
                id="soporte"
                name="soporte"
                value={supportRequest.fecha}
                disabled={mode === "view"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombres">{t('SupportRequestDialog.names')}</Label>
              <Input
                id="nombres"
                name="nombres"
                value={supportRequest.nombres}
                disabled={mode === "view"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellidos">{t('SupportRequestDialog.lastNames')}</Label>
              <Input
                id="apellidos"
                name="apellidos"
                value={supportRequest.apellidos}
                disabled={mode === "view"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="correoElectronico">{t('SupportRequestDialog.email')}</Label>
              <Input
                id="correoElectronico"
                name="correoElectronico"
                value={supportRequest.correoElectronico}
                disabled={mode === "view"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usuarioAsignado">{t('SupportRequestDialog.assignedUser')}</Label>
              <Input
                id="usuarioAsignado"
                name="usuarioAsignado"
                value={supportRequest.nombreAsignado}
                disabled={mode === "view"}
              />
            </div>
          </div>

          

          

        </form>

        <DialogFooter>
          {mode === "edit" && (
            <Button type="submit">
              {t('SupportRequestDialog.saveChanges')}
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={onClose}>
          {t('SupportRequestDialog.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
      )}
    </Dialog>
  )
}