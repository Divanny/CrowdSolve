import { useTranslation } from "react-i18next";

const CreateCompanyUser = () => {
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{t("helpCenter.createCompanyUser.title")}</h1>

            <p className="text-lg mb-6">{t("helpCenter.createCompanyUser.description")}</p>

            <h2 className="text-2xl font-semibold mb-4">{t("helpCenter.createCompanyUser.requirementsTitle")}</h2>
            <ul className="list-disc list-inside mb-6">
                <li>{t("helpCenter.createCompanyUser.requirement1")}</li>
                <li>{t("helpCenter.createCompanyUser.requirement2")}</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">{t("helpCenter.createCompanyUser.stepsTitle")}</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.createCompanyUser.signUpTitle")}</h3>
                    <p>{t("helpCenter.createCompanyUser.signUpDescription")}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t("helpCenter.createCompanyUser.signUpSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.createCompanyUser.roleSelectionTitle")}</h3>
                    <p>{t("helpCenter.createCompanyUser.roleSelectionDescription")}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t("helpCenter.createCompanyUser.roleSelectionSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.createCompanyUser.completeSignUpTitle")}</h3>
                    <p>{t("helpCenter.createCompanyUser.completeSignUpDescription")}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t("helpCenter.createCompanyUser.completeSignUpSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.createCompanyUser.verificationPendingTitle")}</h3>
                    <p>{t("helpCenter.createCompanyUser.verificationPendingDescription")}</p>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mt-12 mb-4">{t("helpCenter.createCompanyUser.troubleshootingTitle")}</h2>
            <p>{t("helpCenter.createCompanyUser.troubleshootingDescription")}</p>
            <ol className="list-decimal list-inside ml-4 mt-2">
                {t("helpCenter.createCompanyUser.troubleshootingSteps", { returnObjects: true }).map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
        </div>
    );
};

export default CreateCompanyUser;
