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

export function ValidateChallengeDialog({ isOpen, onClose, onSaved, estatusId, mode  }) {
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
        toast.success("Operación exitosa", {
          description: response.data.message,
        });

        onSaved();
        onClose();
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

  const rechazarDesafio = async () => {
    try {
      if (!reason) {
        toast.warning("Por favor, ingrese un motivo antes de rechazar el desafío.");
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
        toast.success("Operación exitosa", {
          description: response.data.message,
        });

        onSaved();
        onClose();
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
          <DialogTitle>{mode === "validate" ? "Validar" : "Rechazar"} Desafío</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-red-500 mt-4 ">
          Una vez {mode === "validate" ? "validado" : "rechazada"} el Desafío, no se podrá recuperar a menos que se solicite nuevamente.
        </p>
        {mode === "decline" && (
          <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium">
              Motivo del rechazo
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
              Validar Desafío
            </Button>
          )}
          {mode === "decline" && (
            <Button type="submit" onClick={rechazarDesafio}>
              Rechazar Desafío
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
  