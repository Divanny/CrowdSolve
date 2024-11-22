import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from "@/components/layout/AppSidebar"
import {
    SidebarInset,
    SidebarProvider
} from "@/components/ui/sidebar"

const Layout = () => {
    return (
        <SidebarProvider defaultOpen={false}>
            <SidebarInset>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex flex-col flex-grow">
                        <Outlet />
                    </main>
                    <Footer />
                </div>
            </SidebarInset>
            <AppSidebar side="right" />
        </SidebarProvider>
    );
};

export default Layout;