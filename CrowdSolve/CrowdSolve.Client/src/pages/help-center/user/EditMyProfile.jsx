import { useTranslation } from "react-i18next";

const EditMyProfile = () => {
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{t("helpCenter.editMyProfile.title")}</h1>

            <p className="text-lg mb-6">{t("helpCenter.editMyProfile.description")}</p>

            <h2 className="text-2xl font-semibold mb-4">{t("helpCenter.editMyProfile.requirementsTitle")}</h2>
            <ul className="list-disc list-inside mb-6">
                <li>{t("helpCenter.editMyProfile.requirement1")}</li>
                <li>{t("helpCenter.editMyProfile.requirement2")}</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">{t("helpCenter.editMyProfile.stepsTitle")}</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.editMyProfile.accessProfileTitle")}</h3>
                    <p>{t("helpCenter.editMyProfile.accessProfileDescription")}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t("helpCenter.editMyProfile.accessProfileSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.editMyProfile.updateInfoTitle")}</h3>
                    <p>{t("helpCenter.editMyProfile.updateInfoDescription")}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t("helpCenter.editMyProfile.updateInfoSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.editMyProfile.saveChangesTitle")}</h3>
                    <p>{t("helpCenter.editMyProfile.saveChangesDescription")}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t("helpCenter.editMyProfile.saveChangesSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mt-12 mb-4">{t("helpCenter.editMyProfile.troubleshootingTitle")}</h2>
            <p>{t("helpCenter.editMyProfile.troubleshootingDescription")}</p>
            <ol className="list-decimal list-inside ml-4 mt-2">
                {t("helpCenter.editMyProfile.troubleshootingSteps", { returnObjects: true }).map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
        </div>
    );
};

export default EditMyProfile;
