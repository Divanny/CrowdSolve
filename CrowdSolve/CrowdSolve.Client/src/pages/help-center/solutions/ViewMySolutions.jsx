import { useTranslation } from "react-i18next";

const ViewMySolutions = () => {
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{t("helpCenter.viewMySolutions.title")}</h1>

            <p className="text-lg mb-6">{t("helpCenter.viewMySolutions.description")}</p>

            <h2 className="text-2xl font-semibold mb-4">{t("helpCenter.viewMySolutions.requirementsTitle")}</h2>
            <ul className="list-disc list-inside mb-6">
                <li>{t("helpCenter.viewMySolutions.requirement1")}</li>
                <li>{t("helpCenter.viewMySolutions.requirement2")}</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">{t("helpCenter.viewMySolutions.stepsTitle")}</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.viewMySolutions.accessingTitle")}</h3>
                    <p>{t("helpCenter.viewMySolutions.accessingDescription")}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t("helpCenter.viewMySolutions.accessingSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.viewMySolutions.managingTitle")}</h3>
                    <p>{t("helpCenter.viewMySolutions.managingDescription")}</p>
                    <ul className="list-disc list-inside ml-4 mt-2">
                        {t("helpCenter.viewMySolutions.managingSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mt-12 mb-4">{t("helpCenter.viewMySolutions.troubleshootingTitle")}</h2>
            <p>{t("helpCenter.viewMySolutions.troubleshootingDescription")}</p>
            <ol className="list-decimal list-inside ml-4 mt-2">
                {t("helpCenter.viewMySolutions.troubleshootingSteps", { returnObjects: true }).map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
        </div>
    );
};

export default ViewMySolutions;
