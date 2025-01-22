"use client"

import { Home, ChevronRight, ChevronsUpDown } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarGroup,
    SidebarGroupLabel
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GetLogo from "@/helpers/get-logo";
import Icon from "@/components/ui/icon";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import ProfileDropdownMenuContent from '@/components/layout/ProfileDropdownMenuContent';

export default function HelpCenterLayout() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const location = useLocation();

    const user = useSelector((state) => state.user.user);

    const sidebarItems = [
        {
            title: t('HelpCenterLayout.categories.Challenges'),
            icon: "Puzzle",
            items: [
                { title: t('HelpCenterLayout.items.PostNewChallenge'), url: "/help-center/challenges/post-new-challenge", isActive: location.pathname == "/help-center/challenges/post-new-challenge" },
                { title: t('HelpCenterLayout.items.ViewChallengeCatalog'), url: "/help-center/challenges/view-challenge-catalog", isActive: location.pathname == "/help-center/challenges/view-challenge-catalog" },
                { title: t('HelpCenterLayout.items.ParticipateInChallenge'), url: "/help-center/challenges/participate-in-challenge", isActive: location.pathname == "/help-center/challenges/participate-in-challenge" },
                { title: t('HelpCenterLayout.items.EvaluateChallenge'), url: "/help-center/challenges/evaluate-challenge", isActive: location.pathname == "/help-center/challenges/evaluate-challenge" },
            ],
        },
        {
            title: t('HelpCenterLayout.categories.Solutions'),
            icon: "Send",
            items: [
                { title: t('HelpCenterLayout.items.ViewMySolutions'), url: "/help-center/solutions/view-my-solutions", isActive: location.pathname == "/help-center/solutions/view-my-solutions" },
                { title: t('HelpCenterLayout.items.ChangeSolutionPrivacy'), url: "/help-center/solutions/change-solution-privacy", isActive: location.pathname == "/help-center/solutions/change-solution-privacy" },
            ],
        },
        {
            title: t('HelpCenterLayout.categories.User'),
            icon: "User",
            items: [
                { title: t('HelpCenterLayout.items.CreateCompanyUser'), url: "/help-center/user/create-company-user", isActive: location.pathname == "/help-center/user/create-company-user" },
                { title: t('HelpCenterLayout.items.CreateParticipantUser'), url: "/help-center/user/create-participant-user", isActive: location.pathname == "/help-center/user/create-participant-user" },
                { title: t('HelpCenterLayout.items.EditMyProfile'), url: "/help-center/user/edit-my-profile", isActive: location.pathname == "/help-center/user/edit-my-profile" },
                { title: t('HelpCenterLayout.items.ForgotPassword'), url: "/help-center/user/forgot-password", isActive: location.pathname == "/help-center/user/forgot-password" },
            ],
        },
        {
            title: t('HelpCenterLayout.categories.ContactUs'),
            icon: "Mail",
            items: [
                { title: t('HelpCenterLayout.items.SendMessage'), url: "/help-center/contact-us/send-message", isActive: location.pathname == "/help-center/contact-us/send-message" },
            ],
        },
        {
            title: t('HelpCenterLayout.categories.Legal'),
            icon: "Shield",
            items: [
                { title: t('HelpCenterLayout.items.TermsAndConditions'), url: "/help-center/legal/terms-and-conditions", isActive: location.pathname == "/help-center/legal/terms-and-conditions" },
                { title: t('HelpCenterLayout.items.PrivacyPolicy'), url: "/help-center/legal/privacy-policy", isActive: location.pathname == "/help-center/legal/privacy-policy" },
                { title: t('HelpCenterLayout.items.UsagePolicy'), url: "/help-center/legal/usage-policy", isActive: location.pathname == "/help-center/legal/usage-policy" },
            ],
        },
        {
            title: t('HelpCenterLayout.categories.UserManual'),
            icon: "FileText",
            items: [
                { title: t('HelpCenterLayout.items.UserManual'), url: "/help-center/user-manual", isActive: location.pathname == "/help-center/user-manual" },
            ],
        },
    ];

    const CrowdSolveLogo = GetLogo();

    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "19rem",
            }}
        >
            <Sidebar variant="floating">
                <SidebarHeader>
                    <div className="flex items-center gap-2">
                        <Link to="/help-center">
                            <img src={CrowdSolveLogo} style={{ height: '40px' }} alt="CrowdSolve Logo" />
                        </Link>
                        <Button variant="ghost" className="ml-auto" size="icon" tooltip="Volver al inicio" onClick={() => navigate('/')}>
                            <Home className='h-2 w-2' />
                        </Button>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>{t('HelpCenterLayout.title')}</SidebarGroupLabel>
                        <SidebarMenu>
                            {sidebarItems.map((item) => {
                                const isGroupOpen = item.items.some(subItem => subItem.url == location.pathname);
                                return (
                                    <Collapsible key={item.title} asChild defaultOpen={isGroupOpen} className="group/collapsible">
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={item.title} >
                                                    {item.icon && <Icon name={item.icon} />}
                                                    <span>{item.title}</span>
                                                    <ChevronRight className={`ml-auto transition-transform duration-200 ${isGroupOpen ? 'rotate-90' : ''}`} />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.items?.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild isActive={subItem.isActive} variant={subItem.isActive ? "primary" : undefined}>
                                                                <Link to={subItem.url} className={`flex items-center gap-2 ${subItem.isActive ? 'bg-primary text-primary-foreground' : ''}`}>
                                                                    <span>{subItem.title}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
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
                </header>
                <div className="flex flex-1 flex-col gap-4 p-2 sm:px-4 pt-0">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
