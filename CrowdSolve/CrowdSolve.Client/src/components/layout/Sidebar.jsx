import { useEffect, useState } from 'react';
import CrowdSolveLogoLight from '@/assets/CrowdSolveLogo_light.svg';
import CrowdSolveLogoDark from '@/assets/CrowdSolveLogo_dark.svg';
import { useSelector } from 'react-redux';
import { HamburgerMenuIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import ProfileDropdownMenuContent from './ProfileDropdownMenuContent';
import { ChevronsUpDown, Info, Flag, Building, Mail } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);

    const theme = useSelector((state) => state.theme.theme);
    const CrowdSolveLogo = theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? CrowdSolveLogoDark : CrowdSolveLogoLight) : (theme === 'dark' ? CrowdSolveLogoDark : CrowdSolveLogoLight);

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024 && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen]);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="flex lg:hidden">
                    <HamburgerMenuIcon className='h-5 w-5' />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full max-w-[290px] sm:max-w-[290px] flex flex-col">
                <SheetHeader>
                    <Link className="flex items-center">
                        <img className="me-2" src={CrowdSolveLogo} style={{ height: '40px' }} alt="CrowdSolve Logo" />
                    </Link>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/about-us')}>
                        <Info className="mr-2 h-4 w-4" /> Sobre nosotros
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/challenges')}>
                        <Flag className="mr-2 h-4 w-4" /> Desafíos
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/companies')}>
                        <Building className="mr-2 h-4 w-4" /> Empresas
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/contact')}>
                        <Mail className="mr-2 h-4 w-4" /> Contacto
                    </Button>
                </div>
                <SheetFooter className="mt-auto">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full h-auto" onClick={() => navigate('/sign-in')}>
                                    <div className='flex items-center justify-between w-full'>
                                        <div className='flex items-center '>
                                            <Avatar className="bg-accent" size="1">
                                                <AvatarImage src={`https://robohash.org/${user.nombreUsuario}`} />
                                                <AvatarFallback>{user[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className='flex flex-col ml-2 text-left'>
                                                <span className='text-x font-semibold'>{user.nombreUsuario}</span>
                                                {!user.informacionParticipante && <span className='text-xs text-muted-foreground font-light'>{user.nombrePerfil}</span>}
                                                {user.informacionParticipante && <span className='text-xs text-muted-foreground'>{`${user.informacionParticipante.nombres} ${user.informacionParticipante.apellidos}`}</span>}
                                            </div>
                                        </div>
                                        <ChevronsUpDown className='h-4 w-4'/>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <ProfileDropdownMenuContent user={user} showHeader={false}/>
                        </DropdownMenu>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                            <Button variant="secondary" onClick={() => navigate('/sign-in')}>Iniciar sesión</Button>
                            <Button  onClick={() => navigate('/sign-up')}>Registrarse</Button>
                        </div>
                    )}
                </SheetFooter>
            </SheetContent>
        </Sheet>

    );
};

export default Sidebar;