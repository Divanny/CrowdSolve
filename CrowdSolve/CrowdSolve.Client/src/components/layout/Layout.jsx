import { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
    SidebarInset,
    SidebarProvider
} from "@/components/ui/sidebar"
import { useSelector, useDispatch } from 'react-redux';
import { setLanguage } from '@/redux/slices/languageSlice';
import { setTheme } from '@/redux/slices/themeSlice';
import GetLogo from "@/helpers/get-logo";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuPortal,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import ProfileDropdownMenuContent from '@/components/layout/ProfileDropdownMenuContent';
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge"
import { ChevronsUpDown, X, Check, Moon, Sun, MonitorSmartphone } from "lucide-react"
import { useTranslation } from 'react-i18next';
import flags from "react-phone-number-input/flags";

const Layout = () => {
    const { t } = useTranslation();

    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const user = useSelector((state) => state.user.user);
    const theme = useSelector((state) => state.theme.theme);
    const language = useSelector((state) => state.language.language);
    const dispatch = useDispatch();

    const CrowdSolveLogo = GetLogo();

    const handleTheme = (theme) => {
        dispatch(setTheme(theme));
    }

    const handleLanguage = (language) => {
        dispatch(setLanguage(language));
    }

    const sidebarItems = [
        {
            title: null,
            url: "#",
            items: [
                {
                    title: t('navbar.links.aboutUs'),
                    url: "/about-us",
                    icon: "Users",
                },
                {
                    title: t('navbar.links.challenges'),
                    url: "/challenges",
                    icon: "Puzzle",
                },
                {
                    title: t('navbar.links.companies'),
                    url: "/companies",
                    icon: "Building2",
                },
                {
                    title: t('navbar.links.contactUs'),
                    url: "/contact-us",
                    icon: "Send",
                },
            ],
        }
    ]

    return (
        <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen} alwaysSheet={true}>
            <SidebarInset>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex flex-col flex-grow">
                        <Outlet />
                    </main>
                    <Footer />
                </div>
            </SidebarInset>
            <Sidebar side="right">
                <SidebarHeader>
                    <div className="flex items-center gap-2">
                        <Link to="/">
                            <img src={CrowdSolveLogo} style={{ height: '40px' }} alt="CrowdSolve Logo" />
                        </Link>
                        <Button variant="ghost" className="ml-auto" size="icon" onClick={() => setSidebarOpen(false)}>
                            <X />
                        </Button>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    {sidebarItems.map((item) => (
                        <SidebarGroup key={item.title}>
                            {item.title && <SidebarGroupLabel>{item.title}</SidebarGroupLabel>}
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {item.items.map((item) => (
                                        <SidebarMenuItem key={item.title} onSelect={() => navigate('/')}>
                                            <SidebarMenuButton isActive={item.url == location.pathname} asChild>
                                                <Link variant="secondary" className="w-full flex justify-start items-center gap-2" to={item.url}>
                                                    {(item.icon != "" && item.icon != null) && <Icon name={item.icon} />}
                                                    {item.title}
                                                    {item.pending && <Badge variant="outline" className="ml-auto">{item.pending}</Badge>}
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}
                </SidebarContent>
                <SidebarFooter>
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full h-auto px-2 py-1">
                                    <div className='flex items-center justify-between w-full'>
                                        <div className='flex items-center '>
                                            <Avatar className="bg-accent" size="1">
                                                <AvatarImage src={(user) ? `/api/Account/GetAvatar/${user.idUsuario}` : `https://robohash.org/${user.nombreUsuario}`} />
                                                <AvatarFallback>{user.nombreUsuario[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className='flex flex-col ml-2 text-left'>
                                                <span className='text-x font-semibold'>{user.nombreUsuario}</span>
                                                {!user.informacionParticipante && <span className='text-xs text-muted-foreground font-light'>{user.nombrePerfil}</span>}
                                                {user.informacionParticipante && <span className='text-xs text-muted-foreground'>{`${user.informacionParticipante.nombres} ${user.informacionParticipante.apellidos}`}</span>}
                                            </div>
                                        </div>
                                        <ChevronsUpDown className='h-4 w-4' />
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <ProfileDropdownMenuContent user={user} showHeader={false} />
                        </DropdownMenu>
                    ) : (
                        <div className='flex flex-col gap-2'>
                            <div className='flex justify-between items-center'>
                            <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <div className="flex items-center">
                                                {
                                                    theme == 'system' ? (
                                                        <MonitorSmartphone className="mr-2" size={16} />
                                                    ) : theme == 'light' ? (
                                                        <Sun className="mr-2" size={16} />
                                                    ) : (
                                                        <Moon className="mr-2" size={16} />
                                                    )
                                                }
                                                <span>{t('ProfileDropdownMenuContent.appearance')}</span>
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuContent className="w-36 mr-2">
                                            <DropdownMenuItem onSelect={() => handleTheme('system')}>
                                                <MonitorSmartphone className="mr-2" size={16} />
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
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <div className="flex items-center">
                                                <FlagComponent country={language == 'es' ? 'ES' : 'US'} countryName={language.toUpperCase()} />
                                                <span>{t('ProfileDropdownMenuContent.language')}</span>
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuContent className="w-36 mr-2">
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
                            <Button variant="outline" onClick={() => navigate('/sign-in')}>{t('navbar.auth.signIn')}</Button>
                            <Button onClick={() => navigate('/sign-up')}>{t('navbar.auth.signUp')}</Button>
                        </div>
                    )}
                </SidebarFooter>
            </Sidebar>
        </SidebarProvider>
    );
};

const FlagComponent = ({ country, countryName }) => {
    const Flag = flags[country];

    return (
        <div className="bg-foreground/20 flex h-4 w-6 overflow-hidden rounded-sm mr-2">
            {Flag && <Flag title={countryName} />}
        </div>
    );
};
FlagComponent.displayName = "FlagComponent";

export default Layout;