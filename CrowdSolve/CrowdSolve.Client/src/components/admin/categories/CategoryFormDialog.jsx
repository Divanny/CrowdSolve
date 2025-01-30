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
import Icon from "@/components/ui/icon"
import { useTranslation } from 'react-i18next'

export function CategoryFormDialog({ isOpen, onClose, onSaved, mode, category  }) {
  const { api } = useAxios();
  const [editedCategory, setEditedCategory] = useState(category)
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEditedCategory(category || { nombre: '', descripcion: '', icono: '' });
  }, [category])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedCategory((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsLoading(true);

    const formDataToSend = new FormData();
    Object.keys(editedCategory).forEach(key => {
      formDataToSend.append(key, editedCategory[key]);
    });

    const requestMethod = mode === "create" ? api.post : api.put;

    const response = await requestMethod(`/api/Categorias`, formDataToSend, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    setIsLoading(false);

    if (response.data.success) {
      toast.success(t('CategoryFormdialog.operations.success'), {
        description: response.data.message,
      });

      onSaved()
      onClose()
    } else {
      toast.warning(t('CategoryFormdialog.operations.failure'), {
        description: response.data.message,
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? t('CategoryFormdialog.editTitle') : mode === "create" ? t('CategoryFormdialog.createTitle') : t('CategoryFormdialog.viewTitle')} {t('CategoryFormdialog.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-2">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">{t('CategoryFormdialog.nameLabel')}</Label>
              <Input
                id="nombre"
                name="nombre"
                value={editedCategory?.nombre || ''}
                onChange={handleInputChange}
                disabled={mode === "view"}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">{t('CategoryFormdialog.descriptionLabel')}</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              placeholder={t('CategoryFormdialog.descriptionPlaceholder')}
              value={editedCategory?.descripcion || ''}
              onChange={handleInputChange}
              rows={4}
              autoComplete="off"
              disabled={mode === "view"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icono">{t('Categories.table.columns.icono')}</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="icono"
                name="icono"
                placeholder={t('Categories.table.columns.icono')}
                value={editedCategory?.icono || ''}
                onChange={handleInputChange}
                rows={4}
                autoComplete="off"
                disabled={mode === "view"}
              />
              <div className="flex justify-center items-center space-x-2 rounded-full bg-primary/10 p-2">
                <Icon name={editedCategory?.icono || ''} size={24} className="text-primary" />
              </div>
            </div>
          </div>
        </form>
        <DialogFooter>
          {mode === "edit" || mode === "create" ? (
            <Button type="submit" onClick={handleSave} disabled={isLoading}>
              {isLoading ? t('CategoryFormdialog.loading') : t('CategoryFormdialog.saveChanges')}
            </Button>
          ) : null}
          <Button type="button" variant="secondary" onClick={onClose}>
            {t('CategoryFormdialog.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}