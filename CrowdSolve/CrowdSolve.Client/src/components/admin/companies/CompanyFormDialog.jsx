import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAxios from "@/hooks/use-axios";
import { toast } from "sonner";
import AvatarPicker from "@/components/ui/avatar-picker";
import { useTranslation } from 'react-i18next';

export function CompanyFormDialog({
  isOpen,
  onClose,
  onSaved,
  company,
  mode,
  relationalObjects,
}) {
  const { api } = useAxios();
  const [editedCompany, setEditedCompany] = useState(company);
  const { t } = useTranslation();

  useEffect(() => {
    console.log(company);
    setEditedCompany(company);
  }, [company]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setEditedCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(editedCompany).forEach((key) => {
      formDataToSend.append(key, editedCompany[key]);
    });

    const response = await api.put(
      `/api/Empresas/${editedCompany.idEmpresa}`,
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.success) {
      toast.success(t('CompanyFormDialog.messages.success'), {
        description: response.data.message,
      });
      onSaved();
      onClose();
    } else {
      toast.warning(t('CompanyFormDialog.messages.failure'), {
        description: response.data.message,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? t('CompanyFormDialog.title_edit') : t('CompanyFormDialog.title_view')} {t('CompanyFormDialog.company')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-2">
          <div className="space-y-2">
            <AvatarPicker
              avatar={editedCompany.avatar}
              onAvatarChange={(value) =>
                setEditedCompany((prevData) => ({ ...prevData, avatar: value }))
              }
              disabled={mode === "view"}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">{t('CompanyFormDialog.fields.name')}</Label>
              <Input
                id="nombre"
                name="nombre"
                value={editedCompany.nombre}
                onChange={handleInputChange}
                disabled={mode === "view"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion">{t('CompanyFormDialog.fields.description')}</Label>
              <Textarea
              id="descripcion"
              name="descripcion"
              placeholder={t('CompanyFormDialog.placeholders.description')}
              value={editedCompany.descripcion}
              onChange={handleInputChange}
              rows={4}
              autoComplete="off"
              disabled={mode === "view"}
            />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefono">{t('CompanyFormDialog.fields.phone')}</Label>
              <PhoneInput
                placeholder={t('CompanyFormDialog.placeholders.phone')}
                id="telefono"
                name="telefono"
                type="tel"
                value={editedCompany.telefono}
                onChange={(value) =>
                  setEditedCompany((prevData) => ({
                    ...prevData,
                    telefono: value,
                  }))
                }
                autoComplete="tel"
                disabled={mode === "view"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paginaWeb">{t('CompanyFormDialog.fields.website')}</Label>
              <Input
                id="paginaWeb"
                name="paginaWeb"
                value={editedCompany.paginaWeb}
                onChange={handleInputChange}
                disabled={mode === "view"}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tamañoEmpresa">{t('CompanyFormDialog.fields.company_size')}</Label>
              <Select
                id="tamañoEmpresa"
                onValueChange={(value) =>
                  handleSelectChange("idTamañoEmpresa", value)
                }
                value={editedCompany.idTamañoEmpresa}
                disabled={mode === "view"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione">
                    {editedCompany.idTamañoEmpresa
                      ? relationalObjects.tamanosEmpresas.find(
                          (ne) =>
                            ne.idTamañoEmpresa == editedCompany.idTamañoEmpresa
                        ).nombre
                      : t('CompanyFormDialog.placeholders.company_size')}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {relationalObjects.tamanosEmpresas &&
                    relationalObjects.tamanosEmpresas.map((ne) => (
                      <SelectItem
                        key={ne.idTamañoEmpresa}
                        value={ne.idTamañoEmpresa}
                      >
                        {ne.nombre}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sector">{t('CompanyFormDialog.fields.sector')}</Label>
              <Select
                id="sector"
                onValueChange={(value) =>
                  handleSelectChange("idSector", value)
                }
                value={editedCompany.idSector}
                disabled={mode === "view"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione">
                    {editedCompany.idSector
                      ? relationalObjects.sectores.find(
                          (ne) =>
                            ne.idSector == editedCompany.idSector
                        ).nombre
                      : t('CompanyFormDialog.placeholders.sector')}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {relationalObjects.sectores &&
                    relationalObjects.sectores.map((ne) => (
                      <SelectItem
                        key={ne.idSector}
                        value={ne.idSector}
                      >
                        {ne.nombre}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
        <DialogFooter>
          {mode === "edit" && (
            <Button type="submit" onClick={handleSave}>
             {t('CompanyFormDialog.buttons.save_changes')}
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={onClose}>
          {t('CompanyFormDialog.buttons.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
