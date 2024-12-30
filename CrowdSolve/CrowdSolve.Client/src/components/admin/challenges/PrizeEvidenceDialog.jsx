import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IconoArchivo } from '@/components/IconoArchivo';
import { formatBytes } from "@/lib/utils"
import useAxios from '@/hooks/use-axios';
import { toast } from 'sonner';

const PrizeEvidenceDialog = ({ children, evidence, challengeId, onFinalized }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const { api } = useAxios();

    const finalizeChallenge = async () => {
        try {
            await api.put(`/api/Desafios/Finalizar/${challengeId}`);
            toast.success('Desafío finalizado exitosamente');
            onFinalized();
            setIsConfirmDialogOpen(false);
            setIsDialogOpen(false);
        } catch (error) {
            toast.error('Error al finalizar el desafío', {
                description: error.response?.data?.message ?? error.message,
            });
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]" onOpenAutoFocus={(event) => event.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Evidencia de Premios</DialogTitle>
                    <DialogDescription>
                        Descarga las evidencias de los premios y finaliza el desafío.
                    </DialogDescription>
                </DialogHeader>
                {evidence?.length > 0 && (
                    <div className='mt-2 flex justify-start flex-wrap items-center gap-2'>
                        {evidence.map((evidencia, index) => (
                            <Button
                                type="button"
                                variant="outline"
                                tooltip="Descargar"
                                onClick={() => downloadEvidence(evidence)}
                                className='h-auto'
                                key={index}
                            >
                                <div className='flex justify-start items-center'>
                                    <IconoArchivo tipo={evidencia.contentType} className='h-10 w-10' />
                                    <div className='ml-2 flex flex-col justify-start'>
                                        <p className='text-sm font-medium text-foreground/80'>{evidencia.nombre}</p>
                                        <p className='text-xs text-muted-foreground text-left'>{formatBytes(evidencia.tamaño)}</p>
                                    </div>
                                </div>
                            </Button>
                        ))}
                    </div>
                )}
                <DialogFooter>
                    <Button onClick={() => setIsConfirmDialogOpen(true)}>
                        Finalizar Desafío
                    </Button>
                </DialogFooter>
            </DialogContent>

            <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Finalización</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        ¿Está seguro de que desea finalizar el desafío? Esta acción no se puede deshacer.
                    </DialogDescription>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsConfirmDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={finalizeChallenge}>
                            Finalizar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Dialog>
    );
};

export default PrizeEvidenceDialog;