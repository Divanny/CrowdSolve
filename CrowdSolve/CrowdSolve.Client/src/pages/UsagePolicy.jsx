import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function UsagePolicy() {
    const { t } = useTranslation();
  return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mt-8 mb-8 md:mb-16 md:mt-16">
          {t('UsagePolicy.title')}
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <p className="text-lg mb-2 md:mb-0">{t('UsagePolicy.effectiveDate')}</p>
          </div>

          <div className="space-y-6 text-lg">
              <p>
              {t('UsagePolicy.accpUP')}
              </p>

              <div className="border-t pt-6 mt-8">
                  <h2 className="text-2xl font-bold mb-4">{t('UsagePolicy.generalConduct.header')}</h2>
                  <p>
                  {t('UsagePolicy.generalConduct.header2')}
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>{t('UsagePolicy.generalConduct.content.gC1')}</li>
                      <li>{t('UsagePolicy.generalConduct.content.gC2')}</li>
                      <li>{t('UsagePolicy.generalConduct.content.gC3')}</li>
                      <li>{t('UsagePolicy.generalConduct.content.gC4')}</li>
                      <li>{t('UsagePolicy.generalConduct.content.gC5')}</li>
                  </ul>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">{t('UsagePolicy.prohibitedActivities.header')}</h2>
                  <p>
                  {t('UsagePolicy.prohibitedActivities.header2')}
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>{t('UsagePolicy.prohibitedActivities.content.pAc1')}</li>
                      <li>{t('UsagePolicy.prohibitedActivities.content.pAc2')}</li>
                      <li>{t('UsagePolicy.prohibitedActivities.content.pAc3')}</li>
                      <li>{t('UsagePolicy.prohibitedActivities.content.pAc4')}</li>
                      <li>{t('UsagePolicy.prohibitedActivities.content.pAc5')}</li>
                      <li>{t('UsagePolicy.prohibitedActivities.content.pAc6')}</li>
                      <li>{t('UsagePolicy.prohibitedActivities.content.pAc7')}</li>
                  </ul>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">{t('UsagePolicy.challengeContent.header')}</h2>
                  <p>
                  {t('UsagePolicy.challengeContent.header2')}
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>{t('UsagePolicy.challengeContent.content.chC1')}</li>
                      <li>{t('UsagePolicy.challengeContent.content.chC2')}</li>
                      <li>{t('UsagePolicy.challengeContent.content.chC3')}</li>
                      <li>{t('UsagePolicy.challengeContent.content.chC4')}</li>
                  </ul>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">{t('UsagePolicy.proposalsAndSolutions.header')}</h2>
                  <p>
                  {t('UsagePolicy.proposalsAndSolutions.header2')}
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>{t('UsagePolicy.proposalsAndSolutions.content.pASol')}</li>
                      <li>{t('UsagePolicy.proposalsAndSolutions.content.pASo2')}</li>
                      <li>{t('UsagePolicy.proposalsAndSolutions.content.pASo3')}</li>
                      <li>{t('UsagePolicy.proposalsAndSolutions.content.pASo4')}</li>
                  </ul>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">{t('UsagePolicy.platformUsage.header')}</h2>
                  <p>
                  {t('UsagePolicy.platformUsage.header2')}
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>{t('UsagePolicy.platformUsage.content.pU1')}</li>
                      <li>{t('UsagePolicy.platformUsage.content.pU2')}</li>
                      <li>{t('UsagePolicy.platformUsage.content.pU3')}</li>
                      <li>{t('UsagePolicy.platformUsage.content.pU4')}</li>
                  </ul>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">{t('UsagePolicy.nonComplianceConsequences.header')}</h2>
                  <p>
                  {t('UsagePolicy.nonComplianceConsequences.header2')}
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>{t('UsagePolicy.nonComplianceConsequences.content.nonCC1')}</li>
                      <li>{t('UsagePolicy.nonComplianceConsequences.content.nonCC2')}</li>
                      <li>{t('UsagePolicy.nonComplianceConsequences.content.nonCC3')}</li>
                      <li>{t('UsagePolicy.nonComplianceConsequences.content.nonCC4')}</li>
                  </ul>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">{t('UsagePolicy.reportingViolations.header')}</h2>
                  <p>
                  {t('UsagePolicy.reportingViolations.content')}
                  </p>
              </div>

              <div className="border-t pt-6 mt-8">
                  <p className="font-medium">
                  {t('UsagePolicy.contact.header')}{" "}
                      <a href="mailto:soporte@crowdsolve.site" className="text-primary hover:text-primary/80 transition-colors">
                      {t('UsagePolicy.contact.email')}
                      </a>
                      .
                  </p>
              </div>

              <div className="mt-8 space-x-4">
                  <Button asChild>
                      <Link to="/terms-of-service">
                      {t('UsagePolicy.buttons.termsOfService')}
                      </Link>
                  </Button>
                  <Button asChild variant="outline">
                      <Link to="/privacy-policy">
                      {t('UsagePolicy.buttons.privacyPolicy')}
                      </Link>
                  </Button>
              </div>
          </div>
      </div>
  );
}

export default UsagePolicy;