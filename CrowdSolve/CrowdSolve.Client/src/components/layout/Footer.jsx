import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import CrowdSolveLogoLight from '@/assets/CrowdSolveLogo_light.svg';
import CrowdSolveLogoDark from '@/assets/CrowdSolveLogo_dark.svg';
import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react"
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const theme = useSelector((state) => state.theme.theme);
    const { t } = useTranslation();

    const CrowdSolveLogo = theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? CrowdSolveLogoDark : CrowdSolveLogoLight) : (theme === 'dark' ? CrowdSolveLogoDark : CrowdSolveLogoLight);

    return (
        <footer className="container bg-background text-foreground py-12 px-4 md:px-6">
            <div className="flex flex-col lg:flex-row justify-between">
                <div className="mb-8 lg:mb-0 lg:w-1/3">
                    <img
                        src={CrowdSolveLogo}
                        alt="CrowdSolve Logo"
                        width={180}
                        height={54}
                        className="mb-4"
                    />
                    <p className="text-muted-foreground mb-4 text-sm">
                    {t('footer.description')}
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            <Instagram className="w-5 h-5" />
                            <span className="sr-only">Instagram</span>
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            <Facebook className="w-5 h-5" />
                            <span className="sr-only">Facebook</span>
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            <Twitter className="w-5 h-5" />
                            <span className="sr-only">Twitter</span>
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            <Linkedin className="w-5 h-5" />
                            <span className="sr-only">LinkedIn</span>
                        </a>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end lg:w-2/3 space-y-8 sm:space-y-0 sm:space-x-12 lg:space-x-24">
                    <div>
                        <h3 className="font-semibold mb-4">{t('footer.sections.product.title')}</h3>
                        <ul className="space-y-2">
                            <li><Link to="/como-funciona" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.sections.product.links.howItWorks')}</Link></li>
                            <li><Link to="/desafios" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.sections.product.links.challenges')}</Link></li>
                            <li><Link to="/empresas-registradas" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.sections.product.links.registeredCompanies')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">{t('footer.sections.company.title')}</h3>
                        <ul className="space-y-2">
                            <li><Link to="/about-us" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.sections.company.links.aboutUs')}</Link></li>
                            <li><Link to="/equipo" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.sections.company.links.team')}</Link></li>
                            <li><Link to="/contact-us" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.sections.company.links.contact')}</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="border-t border-muted-foreground/20 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-xs text-muted-foreground mb-4 sm:mb-0">
                    {new Date().getFullYear()} {t('footer.copyright')}
                </p>
                <nav className="flex flex-wrap justify-center sm:justify-end gap-4">
                    <Link to="/terms-of-service" className="text-xs text-muted-foreground hover:text-primary transition-colors">{t('footer.terms')}</Link>
                    <Link to="/privacy-policy" className="text-xs text-muted-foreground hover:text-primary transition-colors">{t('footer.privacy')}</Link>
                </nav>
            </div>
        </footer>
    )
}