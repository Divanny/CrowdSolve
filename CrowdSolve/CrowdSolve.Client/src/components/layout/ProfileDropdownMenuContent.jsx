import { useSelector, useDispatch } from 'react-redux';
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { clearUser } from '@/redux/slices/userSlice';
import { setTheme } from '@/redux/slices/themeSlice';
import { setLanguage } from '@/redux/slices/languageSlice';
import {
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import { User, Send, Settings, BellRing, SunMoon, Globe, LogOut, Check, Moon, Sun, MonitorSmartphone, ShieldEllipsis } from 'lucide-react';
import flags from "react-phone-number-input/flags";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProfileDropdownMenuContent = ({ user, showHeader = true }) => {
    const { t } = useTranslation();
    const theme = useSelector((state) => state.theme.theme);
    const language = useSelector((state) => state.language.language);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(clearUser());
        toast.success(t('ProfileDropdownMenuContent.toastMessageTitle'), {
            description: t('ProfileDropdownMenuContent.toastMessageDescription')
        });
    }

    const handleTheme = (theme) => {
        dispatch(setTheme(theme));
    }

    const handleLanguage = (language) => {
        dispatch(setLanguage(language));
    }

    return (
        <DropdownMenuContent className="w-56 mr-2">
            { showHeader && <DropdownMenuLabel>
                <div className='flex items-center'>
                    <Avatar className="bg-accent" size="1">
                        <AvatarImage src={(user.avatarBlobURL) ? user.avatarBlobURL : `https://robohash.org/${user.nombreUsuario}`} />
                        <AvatarFallback>{user[0]}</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col ml-2'>
                        <span className='text-sm font-semibold'>{user.nombreUsuario}</span>
                        {!user.informacionParticipante && <span className='text-xs text-muted-foreground font-light'>{user.nombrePerfil}</span>}
                        {user.informacionParticipante && <span className='text-xs text-muted-foreground'>{`${user.informacionParticipante.nombres} ${user.informacionParticipante.apellidos}`}</span>}
                    </div>
                </div>
            </DropdownMenuLabel> }
            { showHeader && <DropdownMenuSeparator /> }
            <DropdownMenuGroup>
                <DropdownMenuItem>
                    <User className="mr-2" size={16} />
                    {t('ProfileDropdownMenuContent.profile')}
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Send className="mr-2" size={16} />
                    {t('ProfileDropdownMenuContent.solutions')}
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings className="mr-2" size={16} />
                    {t('ProfileDropdownMenuContent.settings')}
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <BellRing className="mr-2" size={16} />
                    {t('ProfileDropdownMenuContent.notifications')}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate('/admin')}>
                    <ShieldEllipsis className="mr-2" size={16} />
                    {t('ProfileDropdownMenuContent.admin')}
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <SunMoon className="mr-2" size={16} />
                        <span>{t('ProfileDropdownMenuContent.appearance')}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent className="w-36 mr-2">
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
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Globe className="mr-2" size={16} />
                        <span>{t('ProfileDropdownMenuContent.language')}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent className="w-36 mr-2">
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
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout}>
                <LogOut className="mr-2" size={16} />
                {t('ProfileDropdownMenuContent.logout')}
            </DropdownMenuItem>
        </DropdownMenuContent>
    );
}

const FlagComponent = ({ country, countryName }) => {
    const Flag = flags[country];

    return (
        <span className="bg-foreground/20 flex h-4 w-6 overflow-hidden rounded-sm mr-2">
            {Flag && <Flag title={countryName} />}
        </span>
    );
};
FlagComponent.displayName = "FlagComponent";

export default ProfileDropdownMenuContent;