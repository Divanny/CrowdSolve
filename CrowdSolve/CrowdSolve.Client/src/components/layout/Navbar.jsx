import CrowdSolveLogoLight from '@/assets/CrowdSolveLogo_light.svg';
import CrowdSolveLogoDark from '@/assets/CrowdSolveLogo_dark.svg';
import Sidebar from './Sidebar';
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import ProfileDropdownMenuContent from './ProfileDropdownMenuContent';

const Navbar = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);

    const theme = useSelector((state) => state.theme.theme);
    const CrowdSolveLogo = theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? CrowdSolveLogoDark : CrowdSolveLogoLight) : (theme === 'dark' ? CrowdSolveLogoDark : CrowdSolveLogoLight);

    return (
        <nav className="container relative flex flex-wrap items-center justify-between py-2 lg:py-2 px-4 md:px-6">
            <div className="flex w-full flex-wrap items-center justify-between">
                <div>
                    <Link to="/" className="flex items-center">
                        <img className="me-2" src={CrowdSolveLogo} style={{ height: '50px' }} alt="CrowdSolve Logo" />
                    </Link>
                </div>
                <Sidebar />
                <div className="hidden lg:flex flex-grow items-center justify-end gap-8">
                    <div className="flex items-center gap-2">
                        <Button onClick={() => navigate('/about-us')} variant="ghost">Sobre nosotros</Button>
                        <Button onClick={() => navigate('/callenges')} variant="ghost">Desafíos</Button>
                        <Button onClick={() => navigate('/companies')} variant="ghost">Empresas</Button>
                        <Button onClick={() => navigate('/contact')} variant="ghost">Contacto</Button>
                    </div>

                    {user ? (
                        <div className="flex items-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="cursor-pointer bg-accent" size="1">
                                        <AvatarImage src={`https://robohash.org/${user.nombreUsuario}`} />
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
        </nav>
    );
};

export default Navbar;