import CrowdSolveLogoLight from '@/assets/CrowdSolveLogo_light.svg';
import CrowdSolveLogoDark from '@/assets/CrowdSolveLogo_dark.svg';
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLanguage } from '@/redux/slices/languageSlice';
import { setTheme } from '@/redux/slices/themeSlice';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuPortal,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import ProfileDropdownMenuContent from './ProfileDropdownMenuContent';
import { useTranslation } from 'react-i18next';
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Check, Moon, Sun, SunMoon } from 'lucide-react';
import flags from "react-phone-number-input/flags";
import { useEffect, useState } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const user = useSelector((state) => state.user.user);
    const language = useSelector((state) => state.language.language);
    const theme = useSelector((state) => state.theme.theme);

    const CrowdSolveLogo = theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? CrowdSolveLogoDark : CrowdSolveLogoLight) : (theme === 'dark' ? CrowdSolveLogoDark : CrowdSolveLogoLight);

    const handleTheme = (theme) => {
        dispatch(setTheme(theme));
    }

    const handleLanguage = (language) => {
        dispatch(setLanguage(language));
    }

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 w-full ${isScrolled ? 'bg-background/50 backdrop-blur border-grid border-b' : 'bg-transparent'}`}>
            <div className="container relative flex flex-wrap items-center justify-between py-2 lg:py-2 px-4 md:px-6">
                <div className="flex w-full flex-wrap items-center justify-between">
                    <div>
                        <Link to="/" className="flex items-center">
                            <img className="me-2" src={CrowdSolveLogo} style={{ height: '50px' }} alt="CrowdSolve Logo" />
                        </Link>
                    </div>
                    <SidebarTrigger className="lg:hidden" />
                    <div className="hidden lg:flex flex-grow items-center justify-end gap-8">
                        <div className="flex items-center gap-2">
                            <Button onClick={() => navigate('/about-us')} variant="ghost">{t('navbar.links.aboutUs')}</Button>
                            <Button onClick={() => navigate('/challenges')} variant="ghost">{t('navbar.links.challenges')}</Button>
                            <Button onClick={() => navigate('/companies')} variant="ghost">{t('navbar.links.companies')}</Button>
                            <Button onClick={() => navigate('/contact-us')} variant="ghost">{t('navbar.links.contactUs')}</Button>
                        </div>

                        {user ? (
                            <div className="flex items-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Avatar className="cursor-pointer bg-accent" size="1">
                                            <AvatarImage src={(user) ? `/api/Account/GetAvatar/${user.idUsuario}` : `https://robohash.org/${user.nombreUsuario}`} />
                                            <AvatarFallback>{user.nombreUsuario[0]}</AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <ProfileDropdownMenuContent user={user} />
                                </DropdownMenu>
                            </div>
                        ) : (
                            <div className='flex items-center gap-4'>
                                <div className='flex items-center gap-4'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <Button variant="ghost" size="icon">
                                                {
                                                    theme == 'system' ? (
                                                        <SunMoon size={16} />
                                                    ) : theme == 'light' ? (
                                                        <Sun size={16} />
                                                    ) : (
                                                        <Moon size={16} />
                                                    )
                                                }
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuContent className="w-36 mr-2">
                                                <DropdownMenuLabel>{t('ProfileDropdownMenuContent.appearance')}</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onSelect={() => handleTheme('system')}>
                                                    <SunMoon className="mr-2" size={16} />
                                                    <span>{t('ProfileDropdownMenuContent.theme.system')}</span>
                                                    {theme == 'system' && <Check className="ml-auto" size={16} />}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => handleTheme('light')}>
                                                    <Sun className="mr-2" size={16} />
                                                    <span>{t('ProfileDropdownMenuContent.theme.light')}</span>
                                                    {theme == 'light' && <Check className="ml-auto" size={16} />}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => handleTheme('dark')}>
                                                    <Moon className="mr-2" size={16} />
                                                    <span>{t('ProfileDropdownMenuContent.theme.dark')}</span>
                                                    {theme == 'dark' && <Check className="ml-auto" size={16} />}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenu>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <div className="flex items-center cursor-pointer">
                                                <FlagComponent country={language == 'es' ? 'ES' : 'US'} countryName={language.toUpperCase()} />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuContent className="w-36 mr-2">
                                                <DropdownMenuLabel>{t('ProfileDropdownMenuContent.language')}</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onSelect={() => handleLanguage('es')}>
                                                    <FlagComponent country={'ES'} countryName={'Spain'} />
                                                    <span>{t('ProfileDropdownMenuContent.language_options.es')}</span>
                                                    {language == 'es' && <Check className="ml-auto" size={16} />}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => handleLanguage('en')}>
                                                    <FlagComponent country={'US'} countryName={'English'} />
                                                    <span>{t('ProfileDropdownMenuContent.language_options.en')}</span>
                                                    {language == 'en' && <Check className="ml-auto" size={16} />}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenu>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Button className="my-1 text-sm" variant="outline" onClick={() => navigate('/sign-in')}>{t('navbar.auth.signIn')}</Button>
                                    <Button className="my-1 text-sm" onClick={() => navigate('/sign-up')}>{t('navbar.auth.signUp')}</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav >
    );
};

const FlagComponent = ({ country, countryName }) => {
    const Flag = flags[country];

    return (
        <span className="bg-foreground/20 flex h-4 w-6 overflow-hidden rounded-sm mr-2">
            {Flag && <Flag title={countryName} />}
        </span>
    );
};
FlagComponent.displayName = "FlagComponent";

export default Navbar;