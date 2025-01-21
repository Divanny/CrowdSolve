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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslation } from "react-i18next";

export function ParticipantFormDialog({
  isOpen,
  onClose,
  onSaved,
  participant,
  mode,
  relationalObjects,
}) {
  const { t } = useTranslation();
  const { api } = useAxios();
  const [editedParticipant, setEditedParticipant] = useState(participant);

  useEffect(() => {
    setEditedParticipant(participant);
  }, [participant]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedParticipant((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setEditedParticipant((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(editedParticipant).forEach((key) => {
      formDataToSend.append(key, editedParticipant[key]);
    });

    const response = await api.put(
      `/api/Participantes/${editedParticipant.idParticipante}`,
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.success) {
      toast.success(t("ParticipantFormDialog.successOperation"), {
        description: response.data.message,
      });
      onSaved();
      onClose();
    } else {
      toast.warning(t("ParticipantFormDialog.failedOperation"), {
        description: response.data.message,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {mode === "edit"
              ? t("ParticipantFormDialog.title_edit")
              : t("ParticipantFormDialog.title_view")}{" "}
            {t("ParticipantFormDialog.participant")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-2">
          <div className="space-y-2">
            {mode === "edit" ? (
              <AvatarPicker
                avatarURL={`/api/Account/GetAvatar/${editedParticipant.idUsuario}`}
                onAvatarChange={(value) =>
                  setEditedParticipant((prevData) => ({
                    ...prevData,
                    avatar: value,
                  }))
                }
                disabled={mode === "view"}
              />
            ) : (
              <Avatar className="w-32 h-32 mx-auto">
                <AvatarImage
                  src={`/api/Account/GetAvatar/${editedParticipant.idUsuario}`}
                  alt={editedParticipant.nombreUsuario}
                />
                <AvatarFallback>
                  {editedParticipant.nombreUsuario.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombreUsuario">
                {t("ParticipantFormDialog.username_label")}
              </Label>
              <Input
                id="nombreUsuario"
                name="nombreUsuario"
                value={editedParticipant.nombreUsuario}
                onChange={handleInputChange}
                disabled={mode === "view"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="correoElectronico">
                {t("ParticipantFormDialog.email_label")}
              </Label>
              <Input
                type="email"
                id="correoElectronico"
                name="correoElectronico"
                value={editedParticipant.correoElectronico}
                onChange={handleInputChange}
                disabled={mode === "view"}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombres">
                {t("ParticipantFormDialog.first_name_label")}
              </Label>
              <Input
                id="nombres"
                name="nombres"
                value={editedParticipant.nombres}
                onChange={handleInputChange}
                disabled={mode === "view"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellidos">
                {t("ParticipantFormDialog.last_name_label")}
              </Label>
              <Input
                id="apellidos"
                name="apellidos"
                value={editedParticipant.apellidos}
                onChange={handleInputChange}
                disabled={mode === "view"}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="perfilUsuario">
                {t("ParticipantFormDialog.user_profile_label")}
              </Label>
              <Select
                id="perfilUsuario"
                onValueChange={(value) => handleSelectChange("idPerfil", value)}
                value={editedParticipant.idPerfil}
                disabled={mode === "view"}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("ParticipantFormDialog.select")}>
                    {editedParticipant.idPerfil
                      ? relationalObjects.perfilesUsuarios.find(
                          (ne) => ne.idPerfil == editedParticipant.idPerfil
                        ).nombre
                      : t("ParticipantFormDialog.user_profile_placeholder")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {relationalObjects.perfilesUsuarios &&
                    relationalObjects.perfilesUsuarios.map((ne) => (
                      <SelectItem key={ne.idPerfil} value={ne.idPerfil}>
                        {ne.nombre}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaNacimiento">
                {t("ParticipantFormDialog.birthdate_label")}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editedParticipant.fechaNacimiento &&
                        "text-muted-foreground"
                    )}
                    disabled={mode === "view"}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editedParticipant.fechaNacimiento ? (
                      format(editedParticipant.fechaNacimiento, "PPP")
                    ) : (
                      <span>
                        {t("ParticipantFormDialog.birthdate_placeholder")}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown-buttons"
                    selected={editedParticipant.fechaNacimiento}
                    onSelect={(date) =>
                      setEditedParticipant((prevData) => ({
                        ...prevData,
                        fechaNacimiento: date,
                      }))
                    }
                    autoFocus
                    fromYear={1960}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefono">
                {t("ParticipantFormDialog.phone_label")}
              </Label>
              <PhoneInput
                placeholder="Ingrese su teléfono"
                id="telefono"
                name="telefono"
                type="tel"
                value={editedParticipant.telefono}
                onChange={(value) =>
                  setEditedParticipant((prevData) => ({
                    ...prevData,
                    telefono: value,
                  }))
                }
                autoComplete="tel"
                disabled={mode === "view"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nivelEducativo">
                {t("ParticipantFormDialog.education_level_label")}
              </Label>
              <Select
                id="nivelEducativo"
                onValueChange={(value) =>
                  handleSelectChange("idNivelEducativo", value)
                }
                value={editedParticipant.idNivelEducativo}
                disabled={mode === "view"}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("ParticipantFormDialog.select")}>
                    {editedParticipant.idNivelEducativo
                      ? relationalObjects.nivelesEducativos.find(
                          (ne) =>
                            ne.idNivelEducativo ==
                            editedParticipant.idNivelEducativo
                        ).nombre
                      : t("ParticipantFormDialog.education_level_placeholder")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {relationalObjects.nivelesEducativos &&
                    relationalObjects.nivelesEducativos.map((ne) => (
                      <SelectItem
                        key={ne.idNivelEducativo}
                        value={ne.idNivelEducativo}
                      >
                        {ne.nombre}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estatusUsuario">
                {t("ParticipantFormDialog.user_status_label")}
              </Label>
              <Select
                id="estatusUsuario"
                onValueChange={(value) =>
                  handleSelectChange("idEstatusUsuario", value)
                }
                value={editedParticipant.idEstatusUsuario}
                disabled={mode === "view"}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("ParticipantFormDialog.select")}>
                    {editedParticipant.idEstatusUsuario
                      ? relationalObjects.estatusUsuarios.find(
                          (eu) =>
                            eu.idEstatusUsuario ==
                            editedParticipant.idEstatusUsuario
                        ).nombre
                      : t("ParticipantFormDialog.user_status_placeholder")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {relationalObjects.estatusUsuarios &&
                    relationalObjects.estatusUsuarios.map((eu) => (
                      <SelectItem
                        key={eu.idEstatusUsuario}
                        value={eu.idEstatusUsuario}
                      >
                        {eu.nombre}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcionPersonal">
              {t("ParticipantFormDialog.description_label")}
            </Label>
            <Textarea
              id="descripcionPersonal"
              name="descripcionPersonal"
              placeholder={t("ParticipantFormDialog.description_placeholder")}
              value={editedParticipant.descripcionPersonal}
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
              {t("ParticipantFormDialog.button_save_changes")}
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={onClose}>
            {t("ParticipantFormDialog.button_close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
