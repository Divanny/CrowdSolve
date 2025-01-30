import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, Loader, CheckCircle, XCircle, Award, SearchCheck, BadgeAlert, Ban, Trash2, FileCheck2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const challengeStatuses = [
    { status: "Desafío en progreso", description: "El desafío está actualmente en curso.", icon: Loader },
    { status: "Desafío en evaluación", description: "El desafío está siendo evaluado.", icon: SearchCheck },
    { status: "Desafío en espera de entrega de premios", description: "El desafío está esperando la entrega de premios.", icon: Award },
    { status: "Desafío finalizado", description: "El desafío ha finalizado.", icon: CheckCircle },
    { status: "Desafío cancelado", description: "El desafío ha sido cancelado.", icon: XCircle },
    { status: "Desafío sin validar", description: "El desafío aún no ha sido validado por la administración.", icon: BadgeAlert },
    { status: "Desafío rechazado", description: "El desafío ha sido rechazado.", icon: Ban },
    { status: "Desafío descartado", description: "El desafío ha sido descartado.", icon: Trash2 },
    { status: "Desafío en validación de soluciones", description: "El desafío está en proceso de validación de soluciones.", icon: FileCheck2 },
];

export default function PostNewChallenge() {
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{t('helpCenter.postNewChallenge.title')}</h1>

            <p className="text-lg mb-6">
                {t('helpCenter.postNewChallenge.description')}
            </p>

            <h2 className="text-2xl font-semibold mb-4">{t('helpCenter.postNewChallenge.statusesTitle')}</h2>
            <Table className="mb-8">
                <TableHeader>
                    <TableRow>
                        <TableHead>{t('helpCenter.postNewChallenge.statusesTitle')}</TableHead>
                        <TableHead>{t('helpCenter.postNewChallenge.description')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {challengeStatuses.map((status) => (
                        <TableRow key={status.status}>
                            <TableCell className="font-medium flex items-center gap-2">
                                <status.icon className="h-5 w-5 text-primary" />
                                {status.status}
                            </TableCell>
                            <TableCell>{status.description}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>{t('helpCenter.postNewChallenge.importantInfoTitle')}</AlertTitle>
                <AlertDescription>
                    {t('helpCenter.postNewChallenge.importantInfoDescription')}
                </AlertDescription>
            </Alert>

            <h2 className="text-2xl font-semibold mt-12 mb-4">{t('helpCenter.postNewChallenge.faqTitle')}</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium mb-2">{t('helpCenter.postNewChallenge.howToPostTitle')}</h3>
                    <p>{t('helpCenter.postNewChallenge.howToPostSteps')}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t('helpCenter.postNewChallenge.steps', { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                        <ul className="list-disc list-inside ml-4 mt-2">
                            {t('helpCenter.postNewChallenge.details', { returnObjects: true }).map((detail, index) => (
                                <li key={index}>{detail}</li>
                            ))}
                        </ul>
                    </ol>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">{t('helpCenter.postNewChallenge.problemsTitle')}</h3>
                    <p>{t('helpCenter.postNewChallenge.problemsDescription')}</p>
                </div>
            </div>
        </div>
    );
}

