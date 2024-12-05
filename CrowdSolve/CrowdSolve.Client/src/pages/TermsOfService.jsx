import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { useTranslation } from 'react-i18next';

function TermOfService() {
    const { t } = useTranslation();
  return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mt-8 mb-8 md:mb-16 md:mt-16">
          {t('Termsofservice.title')}
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <p className="text-lg mb-2 md:mb-0">{t('Termsofservice.effectiveDate')}</p>
          </div>

          <div className="space-y-6 text-lg">

              <p className="font-medium">
              {t('Termsofservice.intro')}
              </p>

              <p>
              {t('Termsofservice.overview')}
              </p>

              <p>
              {t('Termsofservice.readPls')}{" "}
                    <Link
                        to="/privacy-policy"
                        className="text-primary hover:text-primary/80 transition-colors"
                    >
                        {t('Termsofservice.privacyPolicyLink.text')}
                    </Link>
                    {t('Termsofservice.readPlsDesc')}
              </p>

              <div className="border-t pt-6 mt-8">
                  <h2 className="text-2xl font-bold mb-4">{t('Termsofservice.sections.0.title')}</h2>
                  <p>
                  {t('Termsofservice.sections.0.content')}
                  </p>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">{t('Termsofservice.sections.1.title')}</h2>
                  <p>
                  {t('Termsofservice.sections.1.content')}
                  </p>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">{t('Termsofservice.sections.2.title')}</h2>
                  <p>
                  {t('Termsofservice.sections.2.content')}
                  </p>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">{t('Termsofservice.sections.3.title')}</h2>
                  <p>
                  {t('Termsofservice.sections.3.content')}
                  </p>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">{t('Termsofservice.sections.4.title')}</h2>
                  <p>
                  {t('Termsofservice.sections.4.content')}
                  </p>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">{t('Termsofservice.sections.5.title')}</h2>
                  <p>
                  {t('Termsofservice.sections.5.content')}
                  </p>
              </div>

              <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4">{t('Termsofservice.sections.6.title')}</h2>
                  <p>
                  {t('Termsofservice.sections.6.content')}
                  </p>
              </div>

              <div className="border-t pt-6 mt-8">
                  <p className="font-medium">
                  {t('Termsofservice.byUsing')}{" "}
                      <a href="mailto:soporte@crowdsolve.site" className="text-primary hover:text-primary/80 transition-colors">
                          soporte@crowdsolve.site
                      </a>
                      .
                  </p>
              </div>

              <div className="mt-8 space-x-4">
                  <Button asChild>
                      <Link to="/usage-policy">
                      {t('Termsofservice.buttons.0.text')}
                      </Link>
                  </Button>
                  <Button asChild variant="outline">
                      <Link to="/privacy-policy">
                      {t('Termsofservice.buttons.1.text')}
                      </Link>
                  </Button>
              </div>
          </div>
      </div>
  );
}

export default TermOfService;