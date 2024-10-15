import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner"
import { useDispatch, useSelector } from 'react-redux';
import NotFound from '@/components/NotFound';
import PageLoader from '@/components/PageLoader';
import Home from '@/pages/Home';
import AboutUs from '@/pages/AboutUs';
import SignIn from '@/pages/auth/SignIn';
import SignUp from '@/pages/auth/SignUp';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import CompleteSignUp from '@/pages/auth/CompleteSignUp';
import RoleSelection from '@/pages/auth/RoleSelection';
import VerificationPending from '@/pages/company/VerificationPending';
import ProtectedRoute from '@/components/ProtectedRoute';
import useAxios from './hooks/use-axios';
import { setUser } from '@/redux/slices/userSlice';
import Layout from './components/layout/Layout';

function App() {
    const { api } = useAxios();
    const dispatch = useDispatch();

    const isLoading = useSelector((state) => state.loading.isLoading);
    const theme = useSelector((state) => state.theme.theme);

    useEffect(() => {
        if (theme == 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.add(systemPrefersDark ? 'dark' : 'light');
        }
        else {
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(theme);
        }
    }, [theme]);

    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        const loadUser = async () => {
            if (!token) return;

            const response = await api.get('api/Account');

            dispatch(setUser({
                user: response.data.usuario,
                token: token,
                views: Array.isArray(response.data.vistas) ? response.data.vistas : []
            }));
        }

        loadUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, window.location.pathname]);

    return (
        <>
            {isLoading && <PageLoader />}
            <Routes>
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/about-us" element={<Layout><AboutUs /></Layout>} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/sign-up/complete" element={<ProtectedRoute><RoleSelection /></ProtectedRoute>} />
                <Route path="/sign-up/complete/:Role" element={<ProtectedRoute><CompleteSignUp /></ProtectedRoute>} />
                <Route path="/company/pending-verification" element={<ProtectedRoute><VerificationPending /></ProtectedRoute>} />
                <Route path="/forgot-password" element={<ForgotPassword/>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
        </>
    );
}

export default App;