import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

export default function ParticipateInChallenge() {
    const { t } = useTranslation();

    return (
        <div className="mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{t("helpCenter.participateInChallenge.title")}</h1>

            <p className="text-lg mb-6">{t("helpCenter.participateInChallenge.description")}</p>

            <h2 className="text-2xl font-semibold mb-4">{t("helpCenter.participateInChallenge.requirementsTitle")}</h2>
            <ul className="list-disc list-inside mb-6">
                <li>{t("helpCenter.participateInChallenge.requirement1")}</li>
                <li>{t("helpCenter.participateInChallenge.requirement2")}</li>
                <li>{t("helpCenter.participateInChallenge.requirement3")}</li>
            </ul>

            <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>{t("helpCenter.evaluateChallenge.importantInfoTitle")}</AlertTitle>
                <AlertDescription>{t("helpCenter.evaluateChallenge.importantInfoDescription")}</AlertDescription>
            </Alert>

            <h2 className="text-2xl font-semibold mt-12 mb-4">{t("helpCenter.participateInChallenge.stepsTitle")}</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.participateInChallenge.loginTitle")}</h3>
                    <p>{t("helpCenter.participateInChallenge.loginDescription")}</p>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.participateInChallenge.submitTitle")}</h3>
                    <p>{t("helpCenter.participateInChallenge.submitDescription")}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t("helpCenter.participateInChallenge.submitSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.participateInChallenge.uploadTitle")}</h3>
                    <p>{t("helpCenter.participateInChallenge.uploadDescription")}</p>
                    <ul className="list-disc list-inside ml-4 mt-2">
                        {t("helpCenter.participateInChallenge.uploadSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mt-12 mb-4">{t("helpCenter.participateInChallenge.troubleshootingTitle")}</h2>
            <p>{t("helpCenter.participateInChallenge.troubleshootingDescription")}</p>
            <ol className="list-decimal list-inside ml-4 mt-2">
                {t("helpCenter.participateInChallenge.troubleshootingSteps", { returnObjects: true }).map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
        </div>
    );
}
