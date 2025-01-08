"use client"

import { useEffect } from "react";
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
import ProfileDropdownMenuContent from '../layout/ProfileDropdownMenuContent';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import GetLogo from "@/helpers/get-logo";
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge"
import useAxios from "@/hooks/use-axios";
import { useTranslation } from 'react-i18next';


export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const user = useSelector((state) => state.user.user);

    const sidebarItems = [
        {
            title: null,
            url: "#",
            items: [
                { title: "Dashboard", url: "/admin", icon: "Gauge" },
            ],
        },
        {
            title: t('AdminLayout.sideBarAdm.AdmUser'),
            url: "#",
            items: [
                { title: t('AdminLayout.sideBarAdm.Participants'), url: "/admin/participants", icon: "Users" },
                { title: t('AdminLayout.sideBarAdm.Companies'), url: "/admin/companies", icon: "Building2" },
                { title: t('AdminLayout.sideBarAdm.Admins'), url: "/admin/administrators", icon: "ShieldCheck" },
                { title: t('AdminLayout.sideBarAdm.RolesPermissions'), url: "/admin/permissions", icon: "Key" },
            ],
        },
        {
            title: t('AdminLayout.sideBarAdm.AdmChallenges'),
            url: "#",
            items: [
                { title: t('AdminLayout.sideBarAdm.Challenges'), url: "/admin/challenges", icon: "Flag" },
                { title: t('AdminLayout.sideBarAdm.Solutions'), url: "/admin/solutions", icon: "Send" },
                { title: t('AdminLayout.sideBarAdm.Categories'), url: "/admin/categories", icon: "TableProperties" },
            ],
        },
        {
            title: t('AdminLayout.sideBarAdm.Requests'),
            url: "#",
            items: [
                { title: t('AdminLayout.sideBarAdm.CompanyRequests'), url: "/admin/company-requests", icon: "Building2", pending: 0 },
                { title: t('AdminLayout.sideBarAdm.SupportRequests'), url: "/admin/support-requests", icon: "Headset", pending: 0 },
            ],
        },
        {
            title: t('AdminLayout.sideBarAdm.Settings'),
            url: "#",
            items: [
                { title: t('AdminLayout.sideBarAdm.UserManual'), url: "/admin/user-manual", icon: "Book" },
            ],
        },
    ];

    const { api } = useAxios();

    const CrowdSolveLogo = GetLogo();

    const fetchData = async () => {
        try {
            const countRequestsResponse = await api.get("/api/Soportes/GetCantidadRegistros", { requireLoading: false })

            sidebarItems[3].items[0].pending = countRequestsResponse.data.cantidadEmpresas;
            sidebarItems[3].items[1].pending = countRequestsResponse.data.cantidadSoportes;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                                                    {(item.icon != "" && item.icon != null) && <Icon name={item.icon} />}
                                                    {item.title}
                                                    {(item.pending != null) && <Badge variant="outline secondary" className="ml-auto">{item.pending}</Badge>}
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
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                            <Button variant="outline" onClick={() => navigate('/sign-in')}>{t('AdminLayout.authAdminLayout.signIn')}</Button>
                            <Button onClick={() => navigate('/sign-up')}>{t('AdminLayout.authAdminLayout.signUp')}</Button>
                        </div>
                    )}
                </SidebarFooter>
            </Sidebar>
            <SidebarInset className="overflow-x-auto">
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
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}