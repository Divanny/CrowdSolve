import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

import { DiplomaIcon } from "hugeicons-react";
import { IdentityCardIcon } from "hugeicons-react";

const RegistroEmpresa = () => {
    const [openWelcomeDialog, setOpenWelcomeDialog] = useState(true);

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        paginaWeb: '',
        sector: '',
        tamanoEmpresa: '',
        direccion: '',
        descripcion: '',
        personaContacto: '',
        emailContacto: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos del participante:", formData);
        navigate("/perfil-participante");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la empresa</Label>
                <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" name="telefono" type="tel" value={formData.telefono} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="paginaWeb">Página web</Label>
                <Input id="paginaWeb" name="paginaWeb" type="url" value={formData.paginaWeb} onChange={handleChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Input id="sector" name="sector" value={formData.sector} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="tamanoEmpresa">Tamaño de la empresa</Label>
                <Select onValueChange={(value) => handleSelectChange('tamanoEmpresa', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tamaño de la empresa" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="micro">Micro (1-9 empleados)</SelectItem>
                        <SelectItem value="pequena">Pequeña (10-49 empleados)</SelectItem>
                        <SelectItem value="mediana">Mediana (50-249 empleados)</SelectItem>
                        <SelectItem value="grande">Grande (250+ empleados)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Textarea id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} rows={3} />
            </div>
            <Button type="submit" className="w-full">
                Registrarse
            </Button>

            <Dialog open={openWelcomeDialog} onOpenChange={setOpenWelcomeDialog}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl">Bienvenido a CrowdSolve</DialogTitle>
                        <DialogDescription className="text-center">
                            Un par de cosas clave que debe saber antes de crear su cuenta de empresa:
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 my-4 sm:px-2 gap-6">
                        <div className="text-center sm:px-4">
                            <DiplomaIcon className="mx-auto h-14 w-14 text-primary" />
                            <h2 className="font-semibold my-2">Moderamos todos los desafíos antes de su publicación.</h2>
                            <p className="text-xs text-center">
                                Nuestro equipo editorial revisa manualmente cada desafío y puede realizar cambios en su bandeja de desafíos antes de aprobar la publicación.
                            </p>
                        </div>
                        <div className="text-center sm:px-4">
                            <IdentityCardIcon className="mx-auto h-14 w-14 text-primary" />
                            <h2 className="font-semibold my-2">Tu empresa será verificada antes de la activación de la cuenta.</h2>
                            <p className="text-xs text-center">
                                Después de crear la cuenta, verificaremos la autenticidad de la información proporcionada sobre tu empresa. Este proceso es necesario para garantizar la validez de los datos.
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-center">
                        <DialogClose asChild>
                            <Button type="button">
                            ¡Perfecto!, continuar
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </form>
    );
};

export default RegistroEmpresa;
