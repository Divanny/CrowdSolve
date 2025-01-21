import { useTranslation } from "react-i18next";

const CreateParticipantUser = () => {
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{t("helpCenter.createParticipantUser.title")}</h1>

            <p className="text-lg mb-6">{t("helpCenter.createParticipantUser.description")}</p>

            <h2 className="text-2xl font-semibold mb-4">{t("helpCenter.createParticipantUser.requirementsTitle")}</h2>
            <ul className="list-disc list-inside mb-6">
                <li>{t("helpCenter.createParticipantUser.requirement1")}</li>
                <li>{t("helpCenter.createParticipantUser.requirement2")}</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">{t("helpCenter.createParticipantUser.stepsTitle")}</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.createParticipantUser.signUpTitle")}</h3>
                    <p>{t("helpCenter.createParticipantUser.signUpDescription")}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t("helpCenter.createParticipantUser.signUpSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.createParticipantUser.roleSelectionTitle")}</h3>
                    <p>{t("helpCenter.createParticipantUser.roleSelectionDescription")}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t("helpCenter.createParticipantUser.roleSelectionSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.createParticipantUser.completeSignUpTitle")}</h3>
                    <p>{t("helpCenter.createParticipantUser.completeSignUpDescription")}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t("helpCenter.createParticipantUser.completeSignUpSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mt-12 mb-4">{t("helpCenter.createParticipantUser.troubleshootingTitle")}</h2>
            <p>{t("helpCenter.createParticipantUser.troubleshootingDescription")}</p>
            <ol className="list-decimal list-inside ml-4 mt-2">
                {t("helpCenter.createParticipantUser.troubleshootingSteps", { returnObjects: true }).map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
        </div>
    );
};

export default CreateParticipantUser;
