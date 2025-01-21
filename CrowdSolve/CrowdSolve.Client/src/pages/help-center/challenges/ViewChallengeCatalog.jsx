import { useTranslation } from "react-i18next"

export default function ViewChallengeCatalog() {
    const { t } = useTranslation()
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{t("helpCenter.viewChallengeCatalog.title")}</h1>

            <p className="text-lg mb-6">{t("helpCenter.viewChallengeCatalog.description")}</p>

            <h2 className="text-2xl font-semibold mb-4">{t("helpCenter.viewChallengeCatalog.featuresTitle")}</h2>
            <ul className="list-disc list-inside mb-6">
                <li>{t("helpCenter.viewChallengeCatalog.feature1")}</li>
                <li>{t("helpCenter.viewChallengeCatalog.feature2")}</li>
                <li>{t("helpCenter.viewChallengeCatalog.feature3")}</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-12 mb-4">{t("helpCenter.viewChallengeCatalog.howToUseTitle")}</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.viewChallengeCatalog.searchingTitle")}</h3>
                    <p>{t("helpCenter.viewChallengeCatalog.searchingSteps")}</p>
                    <ol className="list-decimal list-inside ml-4 mt-2">
                        {t("helpCenter.viewChallengeCatalog.searchSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.viewChallengeCatalog.filteringTitle")}</h3>
                    <p>{t("helpCenter.viewChallengeCatalog.filteringSteps")}</p>
                    <ul className="list-disc list-inside ml-4 mt-2">
                        {t("helpCenter.viewChallengeCatalog.filterSteps", { returnObjects: true }).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">{t("helpCenter.viewChallengeCatalog.sortingTitle")}</h3>
                    <p>{t("helpCenter.viewChallengeCatalog.sortingDescription")}</p>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mt-12 mb-4">{t("helpCenter.viewChallengeCatalog.challengeCardTitle")}</h2>
            <p>{t("helpCenter.viewChallengeCatalog.challengeCardDescription")}</p>
            <ul className="list-disc list-inside ml-4 mt-2">
                {t("helpCenter.viewChallengeCatalog.challengeCardInfo", { returnObjects: true }).map((info, index) => (
                    <li key={index}>{info}</li>
                ))}
            </ul>

            <h2 className="text-2xl font-semibold mt-12 mb-4">{t("helpCenter.viewChallengeCatalog.troubleshootingTitle")}</h2>
            <p>{t("helpCenter.viewChallengeCatalog.troubleshootingDescription")}</p>
            <ol className="list-decimal list-inside ml-4 mt-2">
                {t("helpCenter.viewChallengeCatalog.troubleshootingSteps", { returnObjects: true }).map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
        </div>
    )
}