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
import { Textarea } from "@/components/ui/textarea"
import useAxios from "@/hooks/use-axios"
import { toast } from "sonner";
import AvatarPicker from "@/components/ui/avatar-picker";

export function CategoryFormDialog({ isOpen, onClose, onSaved, category, mode  }) {
  const { api } = useAxios();
  const [editedCategory, setEditedCategory] = useState(category)

  useEffect(() => {
    console.log(category);
    setEditedCategory(category)
  }, [category])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedCategory((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()

    const formDataToSend = new FormData();
    Object.keys(editedCategory).forEach(key => {
      formDataToSend.append(key, editedCategory[key]);
    });

    const response = await api.put(`/api/Categorias`, formDataToSend, {
      headers: {
        'Content-Type': 'application/json'
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
      console.log(response);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Editar" : "Ver"} Categoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-2">
          <div className="space-y-2">
            <AvatarPicker avatar={editedCategory.icono} onAvatarChange={(value) => setEditedCategory((prevData) => ({ ...prevData, avatar: value }))} disabled={mode === "view"} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Categoria</Label>
              <Input
                id="nombre"
                name="nombre"
                value={editedCategory.nombre}
                onChange={handleInputChange}
                disabled={mode === "view"}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              placeholder="Ingrese una descripción"
              value={editedCategory.descripcion}
              onChange={handleInputChange}
              rows={4}
              autoComplete="off"
              disabled={mode === "view"}
            />
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