import { useTranslation } from "react-i18next";

const SendMessage = () => {
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{t("helpCenter.sendMessage.title")}</h1>

            <p className="text-lg mb-6">{t("helpCenter.sendMessage.description")}</p>

            <h2 className="text-2xl font-semibold mb-4">{t("helpCenter.sendMessage.requirementsTitle")}</h2>
            <ul className="list-disc list-inside mb-6">
                <li>{t("helpCenter.sendMessage.requirement1")}</li>
                <li>{t("helpCenter.sendMessage.requirement2")}</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">{t("helpCenter.sendMessage.stepsTitle")}</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.sendMessage.accessContactUsTitle")}</h3>
                    <p>{t("helpCenter.sendMessage.accessContactUsDescription")}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t("helpCenter.sendMessage.accessContactUsSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.sendMessage.fillFormTitle")}</h3>
                    <p>{t("helpCenter.sendMessage.fillFormDescription")}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t("helpCenter.sendMessage.fillFormSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.sendMessage.submitFormTitle")}</h3>
                    <p>{t("helpCenter.sendMessage.submitFormDescription")}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t("helpCenter.sendMessage.submitFormSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mt-12 mb-4">{t("helpCenter.sendMessage.responseTitle")}</h2>
            <p>{t("helpCenter.sendMessage.responseDescription")}</p>
            <ol className="list-decimal list-inside ml-4 mt-2">
                {t("helpCenter.sendMessage.responseSteps", { returnObjects: true }).map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
        </div>
    );
};

export default SendMessage;
