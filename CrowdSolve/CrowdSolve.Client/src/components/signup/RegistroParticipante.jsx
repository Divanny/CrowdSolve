import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "@/hooks/use-axios";
import { toast } from "sonner";
import { useSelector } from 'react-redux';
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

const RegistroParticipante = () => {
    const navigate = useNavigate();
    const { api } = useAxios();
    const { user } = useSelector((state) => state.user);

    const [relationalObjects, setRelationalObjects] = useState({});

    const [formData, setFormData] = useState({
        nombres: "",
        apellidos: "",
        fechaNacimiento: null,
        email: "",
        telefono: "",
        nivelEducativo: 0,
        descripcionPersonal: "",
        idUsuario: user.idUsuario
    });

    useEffect(() => {
        const loadRelationalObjects = async () => {
            try {
                const response = await api.get("api/Participantes/GetRelationalObjects");
                setRelationalObjects(response.data);
            } catch (error) {
                toast.error("Operación fallida", {
                    description: error.message,
                });
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
        console.log(`Actualizando ${name} a`, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nombres || !formData.apellidos || !formData.fechaNacimiento || !formData.telefono || !formData.nivelEducativo || !formData.descripcionPersonal) {
            toast.warning("Operación fallida", {
                description: "Por favor, complete todos los campos",
            });
            return;
        }

        try {
            const response = await api.post("/api/Participantes", formData);

            if (response.data.success) {
                navigate("/");
                toast.success("Operación exitosa", {
                    description: response.data.message,
                });
            } else {
                toast.warning("Operación fallida", {
                    description: response.data.message,
                });
            }
        } catch (error) {
            toast.error("Operación fallida", {
                description: error.message,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="nombres">Nombres</Label>
                    <Input
                        id="nombres"
                        name="nombres"
                        placeholder="Ingrese sus nombres"
                        value={formData.nombres}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="apellidos">Apellidos</Label>
                    <Input
                        id="apellidos"
                        name="apellidos"
                        placeholder="Ingrese sus apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fechaNacimiento">Fecha de nacimiento</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="fechaNacimiento"
                                name="fechaNacimiento"
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal bg-accent",
                                    !formData.fechaNacimiento && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.fechaNacimiento ? format(formData.fechaNacimiento, "PPP") : <span>Seleccione una fecha</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={formData.fechaNacimiento}
                                onSelect={(date) => setFormData((prevData) => ({ ...prevData, fechaNacimiento: date }))}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <PhoneInput 
                        placeholder="Ingrese su teléfono" 
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={(value) => setFormData((prevData) => ({ ...prevData, telefono: value }))}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="nivelEducativo">Nivel educativo</Label>
                <Select
                    onValueChange={(value) => handleSelectChange("nivelEducativo", value)}
                    value={formData.nivelEducativo}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione">{formData.nivelEducativo ? relationalObjects.nivelesEducativos.find((ne) => ne.idNivelEducativo == formData.nivelEducativo).nombre : "Seleccione un nivel educativo"}</SelectValue>                        
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
                <Label htmlFor="descripcionPersonal">Descripción personal</Label>
                <Textarea
                    id="descripcionPersonal"
                    name="descripcionPersonal"
                    placeholder="Ingrese una descripción personal"
                    value={formData.descripcionPersonal}
                    onChange={handleChange}
                    rows={4}
                />
            </div>
            <Button
                type="submit"
                className="w-full"
            >
                Registrarse
            </Button>
        </form>
    );
};

export default RegistroParticipante;
