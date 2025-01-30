import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IconoArchivo } from '@/components/IconoArchivo';
import { formatBytes } from "@/lib/utils"
import useAxios from '@/hooks/use-axios';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/redux/slices/loadingSlice';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from 'react-i18next'

import * as FileSaver from 'file-saver';

const PrizeEvidenceDialog = ({ children, evidence, challengeId, onFinalized }) => {
    const { t } = useTranslation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const { api } = useAxios();
    const dispatch = useDispatch();
    const [isConfirmed, setIsConfirmed] = useState(false); // New state for checkbox

    const finalizeChallenge = async () => {
        if (!isConfirmed) {
            toast.error(t('confirmBeforeFinalizing.confirmBeforeFinalizing'));
            return;
        }
        try {
            await api.put(`/api/Desafios/Finalizar/${challengeId}`);
            toast.success(t('confirmBeforeFinalizing.challengeFinalizedSuccess'));
            if (onFinalized) onFinalized();
            setIsConfirmDialogOpen(false);
            setIsDialogOpen(false);
        } catch (error) {
            toast.error(t('confirmBeforeFinalizing.errorFinalizingChallenge'), {
                description: error.response?.data?.message ?? error.message,
            });
        }
    };

    const downloadEvidence = async (evidence) => {
        dispatch(setLoading(true));
        try {
            const response = await api.get(`/api/Soluciones/DescargarAdjunto/${evidence.idAdjunto}`, { responseType: 'blob' })
            FileSaver.saveAs(response.data, evidence.nombre);
        } catch (error) {
            toast.error(t('confirmBeforeFinalizing.errorDownloadingEvidence'), {
                description: error.response?.data?.message ?? error.message,
            });
        }
        dispatch(setLoading(false));
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]" onOpenAutoFocus={(event) => event.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>{t('prizeEvidenceDialog.prizeEvidenceTitle')}</DialogTitle>
                    <DialogDescription>
                    {t('prizeEvidenceDialog.downloadEvidence')}
                    </DialogDescription>
                </DialogHeader>
                {evidence?.length > 0 && (
                    <div className='mt-2 flex justify-start flex-wrap items-center gap-2'>
                        {evidence.map((evidencia, index) => (
                            <Button
                                type="button"
                                variant="outline"
                                tooltip={t('prizeEvidenceDialog.placeholders.downloadTooltip')}
                                onClick={() => downloadEvidence(evidencia)}
                                className='h-auto'
                                key={index}
                            >
                                <div className='flex justify-start items-center'>
                                    <IconoArchivo tipo={evidencia.contentType} className='h-10 w-10' />
                                    <div className='ml-2 flex flex-col justify-start'>
                                        <p className='text-sm font-medium text-foreground/80 truncate w-full'>{evidencia.nombre}</p>
                                        <p className='text-xs text-muted-foreground text-left'>{formatBytes(evidencia.tamaño)}</p>
                                    </div>
                                </div>
                            </Button>
                        ))}
                    </div>
                )}
                <DialogFooter className="flex flex-col items-start gap-4">
                    <div className="flex items-center">
                        <Checkbox id="confirm-checkbox" checked={isConfirmed} onCheckedChange={setIsConfirmed} />
                        <label htmlFor="confirm-checkbox" className="ml-2 text-sm">{t('prizeEvidenceDialog.confirmationDialogTitle')}</label>
                    </div>
                    <Button onClick={() => setIsConfirmDialogOpen(true)} disabled={!isConfirmed} className="self-stretch">
                    {t('prizeEvidenceDialog.finalizeChallenge')}
                    </Button>
                </DialogFooter>
            </DialogContent>

            <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('prizeEvidenceDialog.confirmCheckbox')}</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                    {t('prizeEvidenceDialog.confirmationDialogDescription')}
                    </DialogDescription>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsConfirmDialogOpen(false)}>
                        {t('prizeEvidenceDialog.cancel')}
                        </Button>
                        <Button variant="destructive" onClick={finalizeChallenge}>
                        {t('prizeEvidenceDialog.finalize')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Dialog>
    );
};

export default PrizeEvidenceDialog;