import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{t("helpCenter.forgotPassword.title")}</h1>

            <p className="text-lg mb-6">{t("helpCenter.forgotPassword.description")}</p>

            <h2 className="text-2xl font-semibold mb-4">{t("helpCenter.forgotPassword.requirementsTitle")}</h2>
            <ul className="list-disc list-inside mb-6">
                <li>{t("helpCenter.forgotPassword.requirement1")}</li>
                <li>{t("helpCenter.forgotPassword.requirement2")}</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">{t("helpCenter.forgotPassword.stepsTitle")}</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.forgotPassword.accessForgotPasswordTitle")}</h3>
                    <p>{t("helpCenter.forgotPassword.accessForgotPasswordDescription")}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t("helpCenter.forgotPassword.accessForgotPasswordSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.forgotPassword.enterEmailTitle")}</h3>
                    <p>{t("helpCenter.forgotPassword.enterEmailDescription")}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t("helpCenter.forgotPassword.enterEmailSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.forgotPassword.enterCodeTitle")}</h3>
                    <p>{t("helpCenter.forgotPassword.enterCodeDescription")}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t("helpCenter.forgotPassword.enterCodeSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.forgotPassword.setNewPasswordTitle")}</h3>
                    <p>{t("helpCenter.forgotPassword.setNewPasswordDescription")}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t("helpCenter.forgotPassword.setNewPasswordSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mt-12 mb-4">{t("helpCenter.forgotPassword.troubleshootingTitle")}</h2>
            <p>{t("helpCenter.forgotPassword.troubleshootingDescription")}</p>
            <ol className="list-decimal list-inside ml-4 mt-2">
                {t("helpCenter.forgotPassword.troubleshootingSteps", { returnObjects: true }).map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
        </div>
    );
};

export default ForgotPassword;
