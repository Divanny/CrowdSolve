import { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
    SidebarInset,
    SidebarProvider
} from "@/components/ui/sidebar"
import { useSelector } from 'react-redux';
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
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import ProfileDropdownMenuContent from '@/components/layout/ProfileDropdownMenuContent';
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge"
import { ChevronsUpDown, X } from "lucide-react"

const sidebarItems = [
    {
        title: null,
        url: "#",
        items: [
            {
                title: "Sobre nosotros",
                url: "/about-us",
                icon: "Users",
            },
            {
                title: "Desafíos",
                url: "/challenges",
                icon: "Puzzle",
            },
            {
                title: "Empresas",
                url: "/companies",
                icon: "Building2",
            },
            {
                title: "Contáctanos",
                url: "/contact-us",
                icon: "Send",
            },
        ],
    }
]


const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const user = useSelector((state) => state.user.user);

    const CrowdSolveLogo = GetLogo();

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
                                                <AvatarImage src={(user.avatarURL) ? user.avatarURL : `https://robohash.org/${user.nombreUsuario}`} />
                                                <AvatarFallback>{user[0]}</AvatarFallback>
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
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                            <Button variant="outline" onClick={() => navigate('/sign-in')}>Iniciar sesión</Button>
                            <Button onClick={() => navigate('/sign-up')}>Registrarse</Button>
                        </div>
                    )}
                </SidebarFooter>
            </Sidebar>
        </SidebarProvider>
    );
};

export default Layout;