import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex flex-col flex-grow">
            <Outlet />
        </main>
        <Footer />
    </div>
    );
};

export default Layout;