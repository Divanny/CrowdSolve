import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PageLoader from '@/components/PageLoader';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';


// Lazy load components
const Home = lazy(() => import('@/pages/Home'));
const AboutUs = lazy(() => import('@/pages/AboutUs'));
const ContactUs = lazy(() => import('@/pages/ContactUs'));
const ChallengeCatalog= lazy(()=>import ('@/pages/ChallengeCatalog'));
const SignIn = lazy(() => import('@/pages/auth/SignIn'));
const SignUp = lazy(() => import('@/pages/auth/SignUp'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const CompleteSignUp = lazy(() => import('@/pages/auth/CompleteSignUp'));
const RoleSelection = lazy(() => import('@/pages/auth/RoleSelection'));
const VerificationPending = lazy(() => import('@/pages/company/VerificationPending'));
const AccessDenied = lazy(() => import('@/pages/AccessDenied'));
const CompanyListing = lazy(() => import('@/pages/CompanyListing'));
const Participants = lazy(() => import('@/pages/admin/participants/Participants'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const LazyComponent = ({ component: Component, ...props }) => (
  <Suspense fallback={<PageLoader />}>
    <Component {...props} />
  </Suspense>
);

const AppRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<LazyComponent component={Home} />} />
      <Route path="/about-us" element={<LazyComponent component={AboutUs} />} />
      <Route path="/contact-us" element={<LazyComponent component={ContactUs} />} />
      <Route path="/challenges" element={<LazyComponent component={ChallengeCatalog} />} />
      <Route path="/companies" element={<LazyComponent component={CompanyListing} />} />
    </Route>
    <Route path="/sign-in" element={<LazyComponent component={SignIn} />} />
    <Route path="/sign-up" element={<LazyComponent component={SignUp} />} />
    <Route path="/forgot-password" element={<LazyComponent component={ForgotPassword} />} />
    <Route path="/access-denied" element={<LazyComponent component={AccessDenied} />} />
    <Route path="/404" element={<LazyComponent component={NotFound} />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/sign-up/complete" element={<LazyComponent component={RoleSelection} />} />
      <Route path="/sign-up/complete/:Role" element={<LazyComponent component={CompleteSignUp} />} />
      <Route path="/company/pending-verification" element={<LazyComponent component={VerificationPending} />} />
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<div>Admin Dashboard</div>} />
        <Route path="/admin/participants" element={<LazyComponent component={Participants} />} />
      </Route>
    </Route>
    <Route path="*" element={<LazyComponent component={NotFound} />} />
  </Routes>
);

export default AppRoutes;