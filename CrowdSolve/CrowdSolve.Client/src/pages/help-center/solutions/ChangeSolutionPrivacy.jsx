import { useTranslation } from "react-i18next";

const ChangeSolutionPrivacy = () => {
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{t("helpCenter.changeSolutionPrivacy.title")}</h1>

            <p className="text-lg mb-6">{t("helpCenter.changeSolutionPrivacy.description")}</p>

            <h2 className="text-2xl font-semibold mb-4">{t("helpCenter.changeSolutionPrivacy.requirementsTitle")}</h2>
            <ul className="list-disc list-inside mb-6">
                <li>{t("helpCenter.changeSolutionPrivacy.requirement1")}</li>
                <li>{t("helpCenter.changeSolutionPrivacy.requirement2")}</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">{t("helpCenter.changeSolutionPrivacy.stepsTitle")}</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.changeSolutionPrivacy.accessingTitle")}</h3>
                    <p>{t("helpCenter.changeSolutionPrivacy.accessingDescription")}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t("helpCenter.changeSolutionPrivacy.accessingSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.changeSolutionPrivacy.managingTitle")}</h3>
                    <p>{t("helpCenter.changeSolutionPrivacy.managingDescription")}</p>
                    <ul className="list-disc list-inside ml-4 mt-2">
                        {t("helpCenter.changeSolutionPrivacy.managingSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mt-12 mb-4">{t("helpCenter.changeSolutionPrivacy.troubleshootingTitle")}</h2>
            <p>{t("helpCenter.changeSolutionPrivacy.troubleshootingDescription")}</p>
            <ol className="list-decimal list-inside ml-4 mt-2">
                {t("helpCenter.changeSolutionPrivacy.troubleshootingSteps", { returnObjects: true }).map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
        </div>
    );
};

export default ChangeSolutionPrivacy;
