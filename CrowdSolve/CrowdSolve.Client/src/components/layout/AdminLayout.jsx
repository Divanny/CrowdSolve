"use client"

import { ChevronsUpDown, Home } from "lucide-react"
import { useSelector } from 'react-redux';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarFooter,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import ProfileDropdownMenuContent from './ProfileDropdownMenuContent';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import GetLogo from "@/helpers/get-logo";
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge"

const sidebarItems = [
    {
        title: null,
        url: "#",
        items: [
            {
                title: "Dashboard",
                url: "/admin",
                icon: "Gauge",
            },
        ],
    },
    {
        title: "Administración de usuarios",
        url: "#",
        items: [
            {
                title: "Participantes",
                url: "/admin/participants",
                icon: "Users",
            },
            {
                title: "Empresas",
                url: "/admin/companies",
                icon: "Building2",
            },
            {
                title: "Administradores",
                url: "/admin/administrators",
                icon: "ShieldCheck",
            },
            {
                title: "Roles y permisos",
                url: "/admin/permissions",
                icon: "Key",
            },
        ],
    },
    {
        title: "Administración de desafíos",
        url: "#",
        items: [
            {
                title: "Desafíos",
                url: "/admin/challenges",
                icon: "Flag",
            },
            {
                title: "Soluciones",
                url: "/admin/solutions",
                icon: "Send",
            },
            {
                title: "Categorías",
                url: "/admin/categories",
                icon: "TableProperties",
            },
        ],
    },
    {
        title: "Solicitudes",
        url: "#",
        items: [
            {
                title: "Solicitudes de empresa",
                url: "/admin/company-requests",
                icon: "Building2",
                pending: 3,
            },
            {
                title: "Solicitudes de soporte",
                url: "/admin/support-requests",
                icon: "Headset",
                pending: 1,
            },
        ],
    },
    {
        title: "Configuración",
        url: "#",
        items: [
            {
                title: "Manual de usuario",
                url: "/admin/user-manual",
                icon: "Book",
            },
        ],
    },
]
export default function Component({ children }) {
    const location = useLocation();
    const navigate = useNavigate();

    const user = useSelector((state) => state.user.user);

    const CrowdSolveLogo = GetLogo();

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "19rem",
                }
            }
        >
            <Sidebar variant="floating">
                <SidebarHeader>
                    <div className="flex items-center gap-2">
                    <Link to="/admin">
                        <img src={CrowdSolveLogo} style={{ height: '40px' }} alt="CrowdSolve Logo" />
                    </Link>
                    <Button variant="ghost" className="ml-auto" size="icon" tooltip="Volver al inicio" onClick={() => navigate('/')}>
                        <Home className='h-2 w-2' />
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
                                                    {(item.icon != "" && item.icon != null) && <Icon name={item.icon} /> }
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
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {
                                        sidebarItems.map((item) => item.items.map((item) => item.url == location.pathname ? item.title : null))
                                    }
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}