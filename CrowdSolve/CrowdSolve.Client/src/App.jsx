import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner"
import { useSelector } from 'react-redux';
import NotFound from '@/pages/NotFound';
import PageLoader from '@/components/PageLoader';
import Home from '@/pages/Home';
import AboutUs from '@/pages/AboutUs';
import ContactUs from '@/pages/ContactUs'
import SignIn from '@/pages/auth/SignIn';
import SignUp from '@/pages/auth/SignUp';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import CompleteSignUp from '@/pages/auth/CompleteSignUp';
import RoleSelection from '@/pages/auth/RoleSelection';
import VerificationPending from '@/pages/company/VerificationPending';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import AccessDenied from '@/pages/AccessDenied';
import CompanyListing from './pages/CompanyListing';
import Participants from './pages/admin/Participants';

function App() {
    const isLoading = useSelector((state) => state.loading.isLoading);
    const theme = useSelector((state) => state.theme.theme);

    useEffect(() => {
        if (theme == 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.add(systemPrefersDark ? 'dark' : 'light');
            document.documentElement.style.colorScheme = systemPrefersDark ? 'dark' : 'light';
        }
        else {
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(theme);
            document.documentElement.style.colorScheme = theme;
        }
    }, [theme]);

    return (
        <>
            {isLoading && <PageLoader />}
            <Routes>
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/about-us" element={<Layout><AboutUs /></Layout>} />
                <Route path="/contact-us" element={<Layout><ContactUs /></Layout>} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/sign-up/complete" element={<ProtectedRoute><RoleSelection /></ProtectedRoute>} />
                <Route path="/sign-up/complete/:Role" element={<ProtectedRoute><CompleteSignUp /></ProtectedRoute>} />
                <Route path="/company/pending-verification" element={<ProtectedRoute><VerificationPending /></ProtectedRoute>} />
                <Route path="/companies" element={<Layout><CompanyListing /></Layout>} />
                <Route path="/forgot-password" element={<ForgotPassword/>} />
                <Route path="/access-denied" element={<AccessDenied />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="/admin" element={<ProtectedRoute><AdminLayout></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/participants" element={<ProtectedRoute><AdminLayout><Participants /></AdminLayout></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
        </>
    );
}

export default App;