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

import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { PhoneInput } from "@/components/ui/phone-input";
import { useTranslation } from 'react-i18next';
import AvatarPicker from "@/components/ui/avatar-picker";

const RegistroParticipante = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { api } = useAxios();
    const { user } = useSelector((state) => state.user);
    const token = useSelector(selectToken);

    const [relationalObjects, setRelationalObjects] = useState({});

    const [formData, setFormData] = useState({
        idUsuario: user.idUsuario,
        nombres: "",
        apellidos: "",
        fechaNacimiento: null,
        telefono: "",
        descripcionPersonal: "",
        idNivelEducativo: 0,
        avatar: null,
    });

    useEffect(() => {
        const loadRelationalObjects = async () => {
            try {
                const response = await api.get("api/Participantes/GetRelationalObjects");
                setRelationalObjects(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        loadRelationalObjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nombres || !formData.apellidos || !formData.fechaNacimiento || !formData.telefono || !formData.idNivelEducativo || !formData.descripcionPersonal) {
            toast.warning(t('RegistroParticipante.failedOperation'), {
                description: t('RegistroParticipante.failedOpeDescription'),
            });
            return;
        }

        formData.fechaNacimiento = format(formData.fechaNacimiento, "yyyy-MM-dd");

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            const response = await api.post("api/Participantes", formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                navigate("/");

                const { data } = await api.get("/api/Account");

                if (data) {
                    dispatch(setUser({
                        user: { ...data.usuario },
                        token: token,
                        views: Array.isArray(data.vistas) ? data.vistas : []
                    }));
                }

                toast.success(t('RegistroParticipante.successfulOperation'), {
                    description: response.data.message,
                });
            } else {
                toast.warning(t('RegistroParticipante.failedOperation'), {
                    description: response.data.message,
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <div className="space-y-2">
                <AvatarPicker avatar={formData.avatar} onAvatarChange={(value) => setFormData((prevData) => ({ ...prevData, avatar: value }))} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="nombres">{t('RegistroParticipante.nombres')}</Label>
                    <Input
                        id="nombres"
                        name="nombres"
                        placeholder="Ingrese sus nombres"
                        value={formData.nombres}
                        onChange={handleChange}
                        required
                        autoComplete="given-name"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="apellidos">{t('RegistroParticipante.apellidos')}</Label>
                    <Input
                        id="apellidos"
                        name="apellidos"
                        placeholder="Ingrese sus apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        required
                        autoComplete="family-name"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fechaNacimiento">{t('RegistroParticipante.fechaNacimiento')}</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="fechaNacimiento"
                                name="fechaNacimiento"
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !formData.fechaNacimiento && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.fechaNacimiento ? format(formData.fechaNacimiento, "PPP") : <span>{t('RegistroParticipante.selectDate')}</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                captionLayout="dropdown-buttons"
                                selected={formData.fechaNacimiento}
                                onSelect={(date) => setFormData((prevData) => ({ ...prevData, fechaNacimiento: date }))}
                                autoFocus
                                fromYear={1960}
                                toYear={new Date().getFullYear()}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="telefono">{t('RegistroParticipante.telefono')}</Label>
                    <PhoneInput
                        placeholder="Ingrese su teléfono"
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={(value) => setFormData((prevData) => ({ ...prevData, telefono: value }))}
                        autoComplete="tel"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="nivelEducativo">{t('RegistroParticipante.nivelEducativo')}</Label>
                <Select
                    onValueChange={(value) => handleSelectChange("idNivelEducativo", value)}
                    value={formData.idNivelEducativo}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione">{formData.idNivelEducativo ? relationalObjects.nivelesEducativos.find((ne) => ne.idNivelEducativo == formData.idNivelEducativo).nombre : "Seleccione un nivel educativo"}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {relationalObjects.nivelesEducativos && relationalObjects.nivelesEducativos.map((ne) => (
                            <SelectItem key={ne.idNivelEducativo} value={ne.idNivelEducativo}>
                                {ne.nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="descripcionPersonal">{t('RegistroParticipante.descripcionPersonal')}</Label>
                <Textarea
                    id="descripcionPersonal"
                    name="descripcionPersonal"
                    placeholder="Ingrese una descripción personal"
                    value={formData.descripcionPersonal}
                    onChange={handleChange}
                    rows={4}
                    autoComplete="off"
                />
            </div>
            <Button
                type="submit"
                className="w-full"
            >
                {t('RegistroParticipante.registrarse')}
            </Button>
        </form>
    );
};

export default RegistroParticipante;
