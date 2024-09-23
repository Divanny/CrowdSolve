import { Routes, Route } from 'react-router-dom';
import NotFound from './components/NotFound';
import Home from '@/pages/Home';
import SignIn from '@/pages/SignIn';
import { Toaster } from "@/components/ui/sonner"

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/SignIn" element={<SignIn />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster richColors />
        </>
    );
}

export default App;