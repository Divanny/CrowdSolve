import CrowdSolveLogoLight from '@/assets/CrowdSolveLogo_light.svg';
import CrowdSolveLogoDark from '@/assets/CrowdSolveLogo_dark.svg';
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import ProfileDropdownMenuContent from './ProfileDropdownMenuContent';
import { SidebarTrigger } from "@/components/ui/sidebar"

const Navbar = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);

    const theme = useSelector((state) => state.theme.theme);
    const CrowdSolveLogo = theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? CrowdSolveLogoDark : CrowdSolveLogoLight) : (theme === 'dark' ? CrowdSolveLogoDark : CrowdSolveLogoLight);

    return (
        <nav className="relative z-50"> {/* Changed to relative positioning with high z-index */}
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
                            <Button onClick={() => navigate('/about-us')} variant="ghost">Sobre nosotros</Button>
                            <Button onClick={() => navigate('/challenges')} variant="ghost">Desafíos</Button>
                            <Button onClick={() => navigate('/companies')} variant="ghost">Empresas</Button>
                            <Button onClick={() => navigate('/contact-us')} variant="ghost">Contáctanos</Button>
                        </div>

                        {user ? (
                            <div className="flex items-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Avatar className="cursor-pointer bg-accent" size="1">
                                            <AvatarImage src={(user.avatarURL) ? user.avatarURL : `https://robohash.org/${user.nombreUsuario}`} />
                                            <AvatarFallback>{user[0]}</AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <ProfileDropdownMenuContent user={user} />
                                </DropdownMenu>
                            </div>
                        ) : (<div className='flex items-center gap-2'>
                            <Button className="my-1 text-sm" variant="outline" onClick={() => navigate('/sign-in')}>Iniciar sesión</Button>
                            <Button className="my-1 text-sm" onClick={() => navigate('/sign-up')}>Registrarse</Button>
                        </div>)}
                    </div>
                </div>
            </div>
        </nav >
    );
};

export default Navbar;