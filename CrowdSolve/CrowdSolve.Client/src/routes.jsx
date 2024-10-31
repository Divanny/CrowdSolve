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
const ChallengeForm = lazy(() => import('@/pages/company/ChallengeForm'));

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
      {/* Administration */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<div>Admin Dashboard</div>} />
        <Route path="/admin/participants" element={<LazyComponent component={Participants} />} />
      </Route>
      {/* Company */}
      <Route element={<Layout />}>
        <Route path="/company" element={<div>Company Dashboard</div>} />
        <Route path="/company/challenges" element={<div>Company Challenges</div>} />
        <Route path="/company/challenge/create" element={<LazyComponent component={ChallengeForm} />} />
        <Route path="/company/challenge/:id" element={<div>Company Challenge</div>} />
        <Route path="/company/challenge/:id/edit" element={<LazyComponent component={ChallengeForm} />} />
        <Route path="/company/challenge/:id/solutions" element={<div>Company Solutions</div>} />
        <Route path="/company/challenge/:id/solution/:solutionId" element={<div>Company Solution</div>} />
      </Route>
      {/* Participant */}
      <Route element={<Layout />}>
        <Route path="/my-profile" element={<div>My profile</div>} />
        <Route path="/my-solutions" element={<div>My solutions</div>} />
        <Route path="/my-solutions/:id" element={<div>My solution</div>} />
      </Route>
    </Route>
    <Route path="*" element={<LazyComponent component={NotFound} />} />
  </Routes>
);

export default AppRoutes;