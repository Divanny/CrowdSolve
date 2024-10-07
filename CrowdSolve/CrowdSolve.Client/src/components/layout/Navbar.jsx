import CrowdSolveLogo from '@/assets/CrowdSolveLogo_light.svg';
import { HamburgerMenuIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '@/redux/slices/userSlice';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner";
import { setTheme } from '@/redux/slices/themeSlice';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Check, Moon, Sun } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const theme = useSelector((state) => state.theme.theme);

    const handleLogout = () => {
        dispatch(clearUser());
        toast.success("Operación exitosa", {
            description: "Has cerrado sesión exitosamente"
        });
    };

    const handleTheme = (value) => {
        dispatch(setTheme(value));
    };

    return (
        <nav className="relative flex w-full max-w-screen flex-wrap items-center justify-between py-2 lg:py-2">
            <div className="flex w-full flex-wrap items-center justify-between px-3">
                <div>
                    <Link className="mx-2 my-1 flex items-center lg:mb-0 lg:mt-0">
                        <img className="me-2" src={CrowdSolveLogo} style={{ height: '50px' }} alt="CrowdSolve Logo" />
                    </Link>
                </div>
                <Button variant="outline" size="icon" className="flex md:hidden">
                    <HamburgerMenuIcon className="h-4 w-4" />
                </Button>
                <div className="hidden md:flex flex-grow items-center justify-end gap-8">
                    <a className="my-1 text-sm" href="#">Sobre nosotros</a>
                    <a className="my-1 text-sm" href="#">Desafíos</a>
                    <a className="my-1 text-sm" href="#">Empresas</a>

                    {user ? (
                        <div className="flex items-center mx-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="cursor-pointer bg-accent" size="1">
                                        <AvatarImage src={`https://robohash.org/${user.nombreUsuario}`} />
                                        <AvatarFallback>{user[0]}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 mr-2">
                                    <DropdownMenuLabel>
                                        <div className='flex items-center'>
                                            <Avatar className="bg-accent" size="1">
                                                <AvatarImage src={`https://robohash.org/${user.nombreUsuario}`} />
                                                <AvatarFallback>{user[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className='flex flex-col ml-2'>
                                                <span className='text-sm font-semibold'>{user.nombreUsuario}</span>
                                                {!user.informacionParticipante && <span className='text-xs text-muted-foreground font-light'>{user.nombrePerfil}</span>}
                                                {user.informacionParticipante && <span className='text-xs text-muted-foreground'>{`${user.nombres} ${user.apellidos}`}</span>}
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            Mi perfil
                                            <DropdownMenuShortcut>⇧P</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Mis soluciones
                                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Settings
                                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Keyboard shortcuts
                                            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>

                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>
                                                <span>Invite users</span>
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent className="w-36 mr-2">
                                                    <DropdownMenuItem onSelect={handleTheme('system')}>
                                                        <Sun className="mr-2 h-4 w-4" />
                                                        <span>Sistema</span>
                                                        { theme == 'system' && <Check className="ml-auto h-4 w-4" />}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={handleTheme('light')}>
                                                        <Sun className="mr-2 h-4 w-4" />
                                                        <span>Claro</span>
                                                        { theme == 'light' && <Check className="ml-auto h-4 w-4" />}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={handleTheme('dark')}>
                                                        <Moon className="mr-2 h-4 w-4" />
                                                        <span>Oscuro</span>
                                                        { theme == 'dark' && <Check className="ml-auto h-4 w-4" />}
                                                    </DropdownMenuItem>
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={handleLogout}>
                                        Log out
                                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </div>
                    ) : (<div className='flex items-center mx-2'>
                        <Button className="mx-1 my-1 text-sm" variant="secondary" onClick={() => navigate('/SignIn')}>Iniciar sesión</Button>
                        <Button className="mx-1 my-1 text-sm" onClick={() => navigate('/SignUp')}>Registrarse</Button>
                    </div>)}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;