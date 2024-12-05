"use client"

import React, { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Save } from "lucide-react"
import { toast } from "sonner"
import useAxios from "@/hooks/use-axios";
import { useTranslation } from 'react-i18next';

export default function RolesAndPermissions() {
    const { t } = useTranslation();
    const { api } = useAxios();
    const [perfiles, setPerfiles] = useState([])
    const [vistasDisponibles, setVistasDisponibles] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const saveChanges = async () => {
        try {
            const response = await api.put("/api/Perfiles", perfiles);

            if (response.data.success) {
                toast.success(t('RoleAndPermissions.saveChanges.success.title'), {
                    description: response.data.message
                })
                await fetchData();
            }
            else {
                toast.warning(t('RoleAndPermissions.saveChanges.failure.title'), {
                    description: response.data.message
                })
            }
        }
        catch (error) {
            console.error("Error saving changes:", error)
            toast.error(t('RoleAndPermissions.saveChanges.error.title'), {
                description: t('RoleAndPermissions.saveChanges.error.description'),
            })
        }
    }

    const fetchData = async () => {
        try {
            const [perfilesResponse, permisosResponse] =
                await Promise.all([
                    api.get("/api/Perfiles", { requireLoading: false }),
                    api.get("/api/Perfiles/GetPermisos", { requireLoading: false }),
                ]);

            setPerfiles(perfilesResponse.data);
            setVistasDisponibles(permisosResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const togglePermission = (perfilId, vistaId) => {
        setPerfiles(currentPerfiles =>
            currentPerfiles.map(perfil => {
                if (perfil.idPerfil !== perfilId) return perfil

                const hasPermission = perfil.vistas.some(v => v.idVista === vistaId)
                const vista = vistasDisponibles.find(v => v.idVista === vistaId)

                if (!vista) return perfil

                return {
                    ...perfil,
                    vistas: hasPermission
                        ? perfil.vistas.filter(v => v.idVista !== vistaId)
                        : [...perfil.vistas, vista]
                }
            })
        )
    }

    const renderVista = (vista, level = 0) => {
        const childVistas = vistasDisponibles.filter(v => v.idVistaPadre === vista.idVista)

        return (
            <>
                <TableRow key={vista.idVista}>
                    <TableCell className="font-medium w-1/2" style={{ paddingLeft: level !== 0 ? `${level * 20}px` : undefined }}>
                        <div className="flex items-center">
                            {vista.nombre}
                        </div>
                        <p className="font-mono text-xs text-muted-foreground mt-1">
                            {vista.url}
                        </p>
                    </TableCell>
                    {perfiles.map(perfil => (
                        <TableCell key={perfil.idPerfil}>
                            <Switch
                                checked={perfil.vistas.some(v => v.idVista === vista.idVista)}
                                onCheckedChange={() => togglePermission(perfil.idPerfil, vista.idVista)}
                            />
                        </TableCell>
                    ))}
                </TableRow>
                {childVistas.map((childVista) => (
                    <React.Fragment key={`child-vista-${childVista.idVista}`}>
                        {renderVista(childVista, level + 1)}
                    </React.Fragment>
                ))}
            </>
        )
    }

    const renderSkeletonRows = () => {
        return Array(5)
            .fill(0)
            .map((_, index) => (
                <TableRow key={index}>
                    <TableCell className="w-1/2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2 mt-1" />
                    </TableCell>
                    {Array(3)
                        .fill(0)
                        .map((_, i) => (
                            <TableCell key={`skeleton-cell-${i}`}>
                                <Skeleton className="h-6 w-10" />
                            </TableCell>
                        ))}
                </TableRow>
            ))
    }

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-primary">{t('RoleAndPermissions.title')}</h1>
                    <p className="text-sm text-muted-foreground">
                    {t('RoleAndPermissions.description')}
                    </p>
                </div>
                <Button onClick={() => saveChanges()}>
                    <Save className="w-6 h-6 mr-1" /> {t('RoleAndPermissions.saveChanges2')}
                </Button>
            </div>

            <Card className="flex-1 overflow-hidden">
                <ScrollArea className="h-[calc(100vh-150px)] w-full">
                    <div className="min-w-max">
                        <Table>
                            <TableHeader className="sticky top-0 bg-background z-10">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[250px]">{t('RoleAndPermissions.permission')}</TableHead>
                                    {isLoading
                                        ? Array(3)
                                            .fill(0)
                                            .map((_, i) => (
                                                <TableHead key={i} className="w-[100px]">
                                                    <Skeleton className="h-4 w-20" />
                                                </TableHead>
                                            ))
                                        : perfiles.map((perfil) => (
                                            <TableHead key={perfil.idPerfil} className="w-[100px]">
                                                {perfil.nombre}
                                            </TableHead>
                                        ))}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {isLoading
                                    ? renderSkeletonRows()
                                    : vistasDisponibles
                                        .filter((vista) => vista.idVistaPadre === null)
                                        .map((vista) => renderVista(vista))}
                            </TableBody>
                        </Table>
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </Card>
        </div>
    )
}
