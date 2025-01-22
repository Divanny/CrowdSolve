import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

export default function EvaluateChallenge() {
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{t("helpCenter.evaluateChallenge.title")}</h1>

            <p className="text-lg mb-6">{t("helpCenter.evaluateChallenge.description")}</p>

            <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>{t("helpCenter.evaluateChallenge.importantInfoTitle")}</AlertTitle>
                <AlertDescription>{t("helpCenter.evaluateChallenge.importantInfoDescription")}</AlertDescription>
            </Alert>

            <h2 className="text-2xl font-semibold mt-12 mb-4">{t("helpCenter.evaluateChallenge.stepsTitle")}</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.evaluateChallenge.companyEvaluationTitle")}</h3>
                    <p>{t("helpCenter.evaluateChallenge.companyEvaluationDescription")}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t("helpCenter.evaluateChallenge.companyEvaluationSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.evaluateChallenge.participantEvaluationTitle")}</h3>
                    <p>{t("helpCenter.evaluateChallenge.participantEvaluationDescription")}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t("helpCenter.evaluateChallenge.participantEvaluationSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
}
