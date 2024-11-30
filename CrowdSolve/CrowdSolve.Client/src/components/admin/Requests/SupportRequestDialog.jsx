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


export function SupportDialog({ isOpen, onClose, onSaved, support, mode  }) {
  const { api } = useAxios();
  const [supportRequest, setSupportRequest] = useState(support)



  useEffect(() => {
    console.log(support);
    setSupportRequest(support)
    console.log(supportRequest);
  }, [support])


  const FinalizarSoporte = async () => {
    try {
      const response = await api.put(`api/Soportes/Finalizar/${supportRequest}`,null, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(supportRequest);
  
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



  const DescartarSoporte = async () => {
    try {
      const response = await api.put(`api/Soportes/Finalizar/${supportRequest}`,null, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(supportRequest);
  
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
      {mode !="view" && (
      <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{mode === "closeSupport" ? "Finalizar" : "Descartar"} Solicitud de Soporte</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-red-500 mt-4 mb-6">
          Una vez {mode === "closeSupport" ? "Finalizada" : "Descartada"} la solicitud de soporte, no se podrá recuperar trabajará más en ella.
        </p>
        <DialogFooter>
          {mode === "closeSupport" && (
            <Button type="submit" onClick={FinalizarSoporte}>
              Finalizar Soporte
            </Button>
          )}
          {mode === "declineSupport" && (
            <Button type="submit" onClick={DescartarSoporte}>
              Descartar Soporte
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
      )}

      {mode=="view" && (
      <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle> Ver Solicitud Soporte</DialogTitle>
        </DialogHeader>
        <form className="space-y-2">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="usuarioAfectado">Usuario Afectado</Label>
              <Input
                id="usuarioAfectado"
                name="usuarioAfectado"
                value={supportRequest.nombreUsuario}
                disabled={mode === "view"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="titulo">Titulo</Label>
              <Input
                id="titulo"
                name="titulo"
                value={supportRequest.titulo}
                disabled={mode === "view"}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mensaje">Mensaje</Label>
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
              <Label htmlFor="soporte">Fecha Soporte</Label>
              <Input
                id="soporte"
                name="soporte"
                value={supportRequest.fecha}
                disabled={mode === "view"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombres">Nombres</Label>
              <Input
                id="nombres"
                name="nombres"
                value={supportRequest.nombres}
                disabled={mode === "view"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellidos">Apellidos</Label>
              <Input
                id="apellidos"
                name="apellidos"
                value={supportRequest.apellidos}
                disabled={mode === "view"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="correoElectronico">Correo Electronico</Label>
              <Input
                id="correoElectronico"
                name="correoElectronico"
                value={supportRequest.correoElectronico}
                disabled={mode === "view"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usuarioAsignado">Usuario Asignado</Label>
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
              Guardar cambios
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
      )}
    </Dialog>
  )
}