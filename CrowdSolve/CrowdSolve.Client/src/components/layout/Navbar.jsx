import CrowdSolveLogoLight from '@/assets/CrowdSolveLogo_light.svg';
import CrowdSolveLogoDark from '@/assets/CrowdSolveLogo_dark.svg';
import { HamburgerMenuIcon } from "@radix-ui/react-icons"
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
        <nav className="relative flex w-full max-w-screen flex-wrap items-center justify-between py-2 lg:py-2">
            <div className="flex w-full flex-wrap items-center justify-between px-3">
                <div>
                    <Link className="mx-2 my-1 flex items-center lg:mb-0 lg:mt-0">
                        <img className="me-2" src={CrowdSolveLogo} style={{ height: '50px' }} alt="CrowdSolve Logo" />
                    </Link>
                </div>
                <Button variant="ghost" size="icon" className="flex lg:hidden">
                    <HamburgerMenuIcon className='h-5 w-5'/>
                </Button>
                <div className="hidden lg:flex flex-grow items-center justify-end gap-8">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost">Sobre nosotros</Button>
                        <Button variant="ghost">Desafíos</Button>
                        <Button variant="ghost">Empresas</Button>
                        <Button variant="ghost">Contacto</Button>
                    </div>

                    {user ? (
                        <div className="flex items-center mx-2">
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
                    ) : (<div className='flex items-center mx-2'>
                        <Button className="mx-1 my-1 text-sm" variant="secondary" onClick={() => navigate('/sign-in')}>Iniciar sesión</Button>
                        <Button className="mx-1 my-1 text-sm" onClick={() => navigate('/sign-up')}>Registrarse</Button>
                    </div>)}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;