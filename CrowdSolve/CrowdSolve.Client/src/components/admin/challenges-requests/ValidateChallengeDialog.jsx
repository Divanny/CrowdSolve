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
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from 'react-i18next'

export function ValidateChallengeDialog({ isOpen, onClose, onSaved, estatusId, mode  }) {
  const { t } = useTranslation();
  const { api } = useAxios();
  const [validateChallenge, setValidateChallenge] = useState(estatusId)
  const [reason, setReason] = useState(""); // Estado para almacenar el motivo

  useEffect(() => {
    console.log(estatusId);
    setValidateChallenge(estatusId)
  }, [estatusId])

  const validarDesafio = async () => {
    try {
      const response = await api.put(`api/Desafios/Validar/${validateChallenge}`);
      console.log(validateChallenge);

      if (response.data.success) {
        toast.success(t('validateChallengeDialog.successOperation'), {
          description: response.data.message,
        });

        onSaved();
        onClose();
      } else {
        toast.warning(t('validateChallengeDialog.failedOperation'), {
          description: response.data.message,
        });
        console.log(response.data);
      }
    } catch (error) {
      toast.error(t('validateChallengeDialog.errorOperation'));
      console.error('Error:', error);
    }
  };

  const rechazarDesafio = async () => {
    try {
      if (!reason) {
        toast.warning(t('validateChallengeDialog.enterReasonWarning'));
        return;
      }

      const response = await api.put(
        `api/Desafios/Rechazar/${validateChallenge}?motivo=${encodeURIComponent(reason)}`,
        null,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(validateChallenge);

      if (response.data.success) {
        toast.success(t('validateChallengeDialog.successOperation'), {
          description: response.data.message,
        });

        onSaved();
        onClose();
      } else {
        toast.warning(t('validateChallengeDialog.failedOperation'), {
          description: response.data.message,
        });
        console.log(response.data);
      }
    } catch (error) {
      toast.error(t('validateChallengeDialog.errorOperation'));
      console.error('Error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{mode === "validate" ? t('validateChallengeDialog.validate') : t('validateChallengeDialog.reject')} {t('validateChallengeDialog.desafio')}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-red-500 mt-4 ">
        {t('validateChallengeDialog.unaves')} {mode === "validate" ? t('validateChallengeDialog.validado') : t('validateChallengeDialog.rechazado')} {t('validateChallengeDialog.validationWarning')}
        </p>
        {mode === "decline" && (
          <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium">
            {t('validateChallengeDialog.rejectReasonLabel')}
            </label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 block w-full rounded-md sm:text-sm"
              rows={3}
            />
          </div>
        )}
        <DialogFooter>
          {mode === "validate" && (
            <Button type="submit" onClick={validarDesafio}>
              {t('validateChallengeDialog.buttons.validate')}
            </Button>
          )}
          {mode === "decline" && (
            <Button type="submit" onClick={rechazarDesafio}>
              {t('validateChallengeDialog.buttons.reject')}
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={onClose}>
          {t('validateChallengeDialog.buttons.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
  