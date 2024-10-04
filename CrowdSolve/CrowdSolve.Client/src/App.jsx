import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner"
import { useSelector, useDispatch } from 'react-redux';
import NotFound from './components/NotFound';
import PageLoader from './components/PageLoader';
import Home from '@/pages/Home';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import CompleteSignUp from '@/pages/CompleteSignUp';
import CompleteSignUpForm from '@/pages/CompleteSignUpForm';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const isLoading = useSelector((state) => state.loading.isLoading);
    const isDarkMode = useSelector((state) => state.darkMode.isDarkMode);

    useEffect(() => {
        document.body.className = isDarkMode ? 'dark' : 'light';
    }, [isDarkMode]);

    return (
        <>
            {isLoading && <PageLoader />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/SignIn" element={<SignIn />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/SignUp/Complete" element={<ProtectedRoute><CompleteSignUp /></ProtectedRoute>} />
                <Route path="/SignUp/Complete/:Role" element={<ProtectedRoute><CompleteSignUpForm /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster richColors toastOptions={{}} theme={isDarkMode ? 'dark' : 'light'} />
        </>
    );
}

export default App;