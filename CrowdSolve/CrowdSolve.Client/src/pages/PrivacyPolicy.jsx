import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { useTranslation } from 'react-i18next';

function PrivacyPolicy() {
    const { t } = useTranslation();
  return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mt-8 mb-8 md:mb-16 md:mt-16">
          {t('privacyPolicy.title')}
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <p className="text-lg mb-2 md:mb-0">{t('privacyPolicy.effectiveDate')}</p>
          </div>

          <div className="space-y-6 text-lg">
              <p>
              {t('privacyPolicy.intro')}
              </p>

              <div className="border-t pt-6 mt-8">
                  <h2 className="text-2xl font-bold mb-4">{t('privacyPolicy.sections.informationCollected.title')}</h2>
                  <p>
                  {t('privacyPolicy.sections.informationCollected.description')}
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>{t('privacyPolicy.sections.informationCollected.list.infoCollect1')}</li>
                      <li>{t('privacyPolicy.sections.informationCollected.list.infoCollect2')}</li>
                      <li>{t('privacyPolicy.sections.informationCollected.list.infoCollect3')}</li>
                      <li>{t('privacyPolicy.sections.informationCollected.list.infoCollect4')}</li>
                      <li>{t('privacyPolicy.sections.informationCollected.list.infoCollect5')}</li>
                  </ul>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">{t('privacyPolicy.sections.informationUsage.title')}</h2>
                  <p>
                  {t('privacyPolicy.sections.informationUsage.description')}
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>{t('privacyPolicy.sections.informationUsage.list.infoUsage1')}</li>
                      <li>{t('privacyPolicy.sections.informationUsage.list.infoUsage2')}</li>
                      <li>{t('privacyPolicy.sections.informationUsage.list.infoUsage3')}</li>
                      <li>{t('privacyPolicy.sections.informationUsage.list.infoUsage4')}</li>
                  </ul>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">{t('privacyPolicy.sections.informationSharing.title')}</h2>
                  <p>
                  {t('privacyPolicy.sections.informationSharing.description')}
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>{t('privacyPolicy.sections.informationSharing.list.infoSharing1')}</li>
                      <li>{t('privacyPolicy.sections.informationSharing.list.infoSharing2')}</li>
                      <li>{t('privacyPolicy.sections.informationSharing.list.infoSharing3')}</li>
                  </ul>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">{t('privacyPolicy.sections.dataSecurity.title')}</h2>
                  <p>
                  {t('privacyPolicy.sections.dataSecurity.description')}
                  </p>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">{t('privacyPolicy.sections.userRights.title')}</h2>
                  <p>
                  {t('privacyPolicy.sections.userRights.description')}
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>{t('privacyPolicy.sections.userRights.list.uRights1')}</li>
                      <li>{t('privacyPolicy.sections.userRights.list.uRights2')}</li>
                      <li>{t('privacyPolicy.sections.userRights.list.uRights3')}</li>
                      <li>{t('privacyPolicy.sections.userRights.list.uRights4')}</li>
                      <li>{t('privacyPolicy.sections.userRights.list.uRights5')}</li>
                  </ul>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">{t('privacyPolicy.sections.cookies.title')}</h2>
                  <p>
                  {t('privacyPolicy.sections.cookies.description')}
                  </p>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">{t('privacyPolicy.sections.policyChanges.title')}</h2>
                  <p>
                  {t('privacyPolicy.sections.policyChanges.description')}
                  </p>
              </div>

              <div className="border-t pt-6 mt-8">
                  <p className="font-medium">
                  {t('privacyPolicy.sections.contact.description')}{" "}
                      <a href="mailto:soporte@crowdsolve.site" className="text-primary hover:text-primary/80 transition-colors">
                      {t('privacyPolicy.sections.contact.email')}
                      </a>
                      .
                  </p>
              </div>

              <div className="mt-8 space-x-4">
                  <Button asChild>
                      <Link to="/terms-of-service">
                      {t('privacyPolicy.buttons.termsOfService')}
                      </Link>
                  </Button>
                  <Button asChild variant="outline">
                      <Link to="/usage-policy">
                      {t('privacyPolicy.buttons.usagePolicy')}
                      </Link>
                  </Button>
              </div>
          </div>
      </div>
  );
}

export default PrivacyPolicy;