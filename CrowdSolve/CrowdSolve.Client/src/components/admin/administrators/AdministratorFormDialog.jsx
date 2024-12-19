import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useAxios from "@/hooks/use-axios"
import { toast } from "sonner";
import AvatarPicker from "@/components/ui/avatar-picker";

export function AdministratorFormDialog({ isOpen, onClose, onSaved, admin, mode  }) {
  const { api } = useAxios();
  const [editedAdmin, setEditedAdmin] = useState(admin)

  useEffect(() => {
    setEditedAdmin(admin)
  }, [admin])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedAdmin((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()

    const formDataToSend = new FormData();
    Object.keys(editedAdmin).forEach(key => {
      formDataToSend.append(key, editedAdmin[key]);
    });

    const response = await api.put(`/api/Usuarios/${editedAdmin.idUsuario}`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

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
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Editar" : "Ver"} Participante</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-2">
          <div className="space-y-2">
            <AvatarPicker avatar={editedAdmin.avatar} onAvatarChange={(value) => setEditedAdmin((prevData) => ({ ...prevData, avatar: value }))} disabled={mode === "view"} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombreUsuario">Nombre de usuario</Label>
              <Input
                id="nombreUsuario"
                name="nombreUsuario"
                value={editedAdmin.nombreUsuario}
                onChange={handleInputChange}
                disabled={mode === "view"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="correoElectronico">Correo Electrónico</Label>
              <Input
                type="email"
                id="correoElectronico"
                name="correoElectronico"
                value={editedAdmin.correoElectronico}
                onChange={handleInputChange}
                disabled={mode === "view"}
              />
            </div>
          </div>
        </form>
        <DialogFooter>
          {mode === "edit" && (
            <Button type="submit" onClick={handleSave}>
              Guardar cambios
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