import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "@/hooks/use-axios";
import { toast } from "sonner";
import { useSelector, useDispatch } from 'react-redux';
import { selectToken } from '@/redux/selectors/userSelectors';
import { setUser } from '@/redux/slices/userSlice';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import { PhoneInput } from "@/components/ui/phone-input";

import { DiplomaIcon } from "hugeicons-react";
import { IdentityCardIcon } from "hugeicons-react";
import AvatarPicker from "@/components/ui/avatar-picker";
import { useTranslation } from 'react-i18next';

const RegistroEmpresa = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { api } = useAxios();
    const { user } = useSelector((state) => state.user);
    const token = useSelector(selectToken);

    const [relationalObjects, setRelationalObjects] = useState({});

    const [formData, setFormData] = useState({
        idUsuario: user.idUsuario,
        nombre: '',
        telefono: '',
        paginaWeb: '',
        idSector: '',
        idTamañoEmpresa: '',
        direccion: '',
        descripcion: '',
        personaContacto: '',
        emailContacto: '',
        avatar: '',
    })

    useEffect(() => {
        const loadRelationalObjects = async () => {
            try {
                const response = await api.get("api/Empresas/GetRelationalObjects");
                setRelationalObjects(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        loadRelationalObjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [openWelcomeDialog, setOpenWelcomeDialog] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nombre || !formData.telefono || !formData.idSector || !formData.idTamañoEmpresa || !formData.direccion) {
            toast.warning("Operación fallida", {
                description: "Por favor, complete todos los campos",
            });
            return;
        }

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            const response = await api.post("api/Empresas", formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                navigate("/company/pending-verification");
                
                const { data } = await api.get("/api/Account");

                if (data) {
                    dispatch(setUser({
                        user: { ...data.usuario },
                        token: token,
                        views: Array.isArray(data.vistas) ? data.vistas : []
                    }));
                }

                toast.success("Operación exitosa", {
                    description: response.data.message,
                });
            } else {
                toast.warning("Operación fallida", {
                    description: response.data.message,
                });
            }
        }
        catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <div className="space-y-2">
                <AvatarPicker avatar={formData.avatar} onAvatarChange={(value) => setFormData((prevData) => ({ ...prevData, avatar: value }))} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="nombre">{t('RegistroEmpresa.companyName')}</Label>
                <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Ingrese el nombre de la empresa" autoComplete="organization" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="direccion">{t('RegistroEmpresa.companyDescription')}</Label>
                <Textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} rows={2} required placeholder="Ingrese una descripcion breve de la empresa" autoComplete="description" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="telefono">{t('RegistroEmpresa.phone')}</Label>
                    <PhoneInput
                        placeholder="Ingrese el teléfono de la empresa"
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={(value) => setFormData((prevData) => ({ ...prevData, telefono: value }))}
                        autoComplete="tel"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sector">{t('RegistroEmpresa.sector')}</Label>
                    <Select
                        id="sector"
                        onValueChange={(value) => handleSelectChange("idSector", value)}
                        value={formData.idSector}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione">{formData.idSector ? relationalObjects.sectores.find((ne) => ne.idSector == formData.idSector).nombre : "Seleccione un sector"}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {relationalObjects.sectores && relationalObjects.sectores.map((ne) => (
                                <SelectItem key={ne.idSector} value={ne.idSector}>
                                    {ne.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="paginaWeb">{t('RegistroEmpresa.website')}</Label>
                <Input id="paginaWeb" name="paginaWeb" type="url" value={formData.paginaWeb} onChange={handleChange} placeholder="Ingrese la página web de la empresa" autoComplete="url" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="tamanoEmpresa">{t('RegistroEmpresa.companySize')}</Label>
                <Select
                    id="tamanoEmpresa"
                    onValueChange={(value) => handleSelectChange("idTamañoEmpresa", value)}
                    value={formData.idTamañoEmpresa}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione">{formData.idTamañoEmpresa ? relationalObjects.tamañosEmpresa.find((ne) => ne.idTamañoEmpresa == formData.idTamañoEmpresa).nombre : "Seleccione un tamaño de empresa"}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {relationalObjects.tamañosEmpresa && relationalObjects.tamañosEmpresa.map((ne) => (
                            <SelectItem key={ne.idTamañoEmpresa} value={ne.idTamañoEmpresa}>
                                {ne.descripcion}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="direccion">{t('RegistroEmpresa.address')}</Label>
                <Textarea id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} rows={3} placeholder="Ingrese la dirección de la empresa" autoComplete="street-address" />
            </div>
            <Button type="submit" className="w-full">
            {t('RegistroEmpresa.register')}
            </Button>

            <Dialog open={openWelcomeDialog} onOpenChange={setOpenWelcomeDialog}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl">{t('RegistroEmpresaEntry.welcomeTitle')}</DialogTitle>
                        <DialogDescription className="text-center">
                        {t('RegistroEmpresaEntry.welcomeDescription')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 my-4 sm:px-2 gap-6">
                        <div className="text-center sm:px-4">
                            <DiplomaIcon className="mx-auto h-14 w-14 text-primary" />
                            <h2 className="font-semibold my-2">{t('RegistroEmpresaEntry.moderationTitle')}</h2>
                            <p className="text-xs text-center">
                            {t('RegistroEmpresaEntry.moderationDescription')}
                            </p>
                        </div>
                        <div className="text-center sm:px-4">
                            <IdentityCardIcon className="mx-auto h-14 w-14 text-primary" />
                            <h2 className="font-semibold my-2">{t('RegistroEmpresaEntry.verificationTitle')}</h2>
                            <p className="text-xs text-center">
                            {t('RegistroEmpresaEntry.verificationDescription')}
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-center">
                        <DialogClose asChild>
                            <Button type="button">
                            {t('RegistroEmpresaEntry.continueButton')}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </form>
    );
};

export default RegistroEmpresa;
