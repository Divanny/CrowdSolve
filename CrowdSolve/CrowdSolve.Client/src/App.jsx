import { Routes, Route } from 'react-router-dom';
import NotFound from './components/NotFound';
import Home from '@/pages/Home';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import CompleteSignUp from '@/pages/CompleteSignUp';
import CompleteSignUpForm from '@/pages/CompleteSignUpForm';
import { Toaster } from "@/components/ui/sonner"

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/SignIn" element={<SignIn />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/SignUp/Complete" element={<CompleteSignUp />} />
                <Route path="/SignUp/Complete/:Role" element={<CompleteSignUpForm />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster richColors toastOptions={{}} theme="light" />
        </>
    );
}

export default App;