import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PageLoader from '@/components/PageLoader';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';
import PermisosEnum from './enums/PermisosEnum';

// Lazy load components
const Home = lazy(() => import('@/pages/Home'));
const AboutUs = lazy(() => import('@/pages/AboutUs'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const UsagePolicy = lazy(() => import('@/pages/UsagePolicy'));
const ContactUs = lazy(() => import('@/pages/ContactUs'));
const SignIn = lazy(() => import('@/pages/auth/SignIn'));
const SignUp = lazy(() => import('@/pages/auth/SignUp'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const CompleteSignUp = lazy(() => import('@/pages/auth/CompleteSignUp'));
const RoleSelection = lazy(() => import('@/pages/auth/RoleSelection'));
const VerificationPending = lazy(() => import('@/pages/company/VerificationPending'));
const AccessDenied = lazy(() => import('@/pages/AccessDenied'));
const CompanyListing = lazy(() => import('@/pages/CompanyListing'));
const ChallengeCatalog = lazy(() => import('@/pages/ChallengeCatalog'));
const Participants = lazy(() => import('@/pages/admin/participants/Participants'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const ChallengeForm = lazy(() => import('@/pages/company/ChallengeForm'));
const RolesAndPermissions = lazy(() => import('@/pages/admin/RolesAndPermissions'));

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
      <Route path="/contact-us" element={<LazyComponent component={ChallengeCatalog} />} />
      <Route path="/companies" element={<LazyComponent component={CompanyListing} />} />
      <Route path="*" element={<LazyComponent component={NotFound} />} />
    </Route>
    <Route path="/sign-in" element={<LazyComponent component={SignIn} />} />
    <Route path="/sign-up" element={<LazyComponent component={SignUp} />} />
    <Route path="/forgot-password" element={<LazyComponent component={ForgotPassword} />} />
    <Route path="/terms-of-service" element={<LazyComponent component={TermsOfService} />} />
    <Route path="/privacy-policy" element={<LazyComponent component={PrivacyPolicy} />} />
    <Route path="/usage-policy" element={<LazyComponent component={UsagePolicy} />} />
    <Route path="/access-denied" element={<LazyComponent component={AccessDenied} />} />
    <Route path="/404" element={<LazyComponent component={NotFound} />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/sign-up/complete" element={<LazyComponent component={RoleSelection} />} handle={{ permission: () => PermisosEnum.Seleccionar_Rol}} />
      <Route path="/sign-up/complete/:role" element={<LazyComponent component={CompleteSignUp} />} handle={{ permission: () => PermisosEnum.Completar_Registro}} />
      <Route path="/company/pending-verification" element={<LazyComponent component={VerificationPending} />} handle={{ permission: () => PermisosEnum.Empresa_Pendiente_Verificacion}} />
      {/* Administration */}
      <Route path="/admin" element={<AdminLayout />} >
        <Route index element={<div>Admin Dashboard</div>} handle={{ permission: () => PermisosEnum.Administrador_Dashboard}} />
        <Route path="participants" element={<LazyComponent component={Participants} />} handle={{ permission: () => PermisosEnum.Administrar_Participantes}} />
        <Route path="permissions" element={<LazyComponent component={RolesAndPermissions} />} handle={{ permission: () => PermisosEnum.Administrar_Roles_y_Permisos}} />
        <Route path="*" element={<LazyComponent component={NotFound} />} />
      </Route>
      {/* Company */}
      <Route path="/company" element={<Layout />} >
        <Route index element={<div>Company Dashboard</div>} handle={{ permission: () => PermisosEnum.Empresa_Dashboard}} />
        <Route path="challenges" element={<div>Company Challenges</div>} handle={{ permission: () => PermisosEnum.Empresa_Desafios}} />
        <Route path="challenge/new" element={<LazyComponent component={ChallengeForm} />} handle={{ permission: () => PermisosEnum.Empresa_Crear_Desafio}} />
        <Route path="challenge/:challengeId" element={<div>Company Challenge</div>} handle={{ permission: () => PermisosEnum.Empresa_Ver_Desafio}} />
        <Route path="challenge/:challengeId/edit" element={<LazyComponent component={ChallengeForm} />} handle={{ permission: () => PermisosEnum.Empresa_Editar_Desafio}} />
        <Route path="challenge/:challengeId/solutions" element={<div>Company Solutions</div>} handle={{ permission: () => PermisosEnum.Empresa_Ver_Soluciones_Desafio}} />
        <Route path="challenge/:challengeId/solution/:solutionId" element={<div>Company Solution</div>} handle={{ permission: () => PermisosEnum.Empresa_Ver_Solucion_Desafio}} />
      </Route>
      {/* Participant */}
      <Route element={<Layout />}>
        <Route path="/my-profile" element={<div>My profile</div>} handle={{ permission: () => PermisosEnum.Mi_perfil}} />
        <Route path="/my-solutions" element={<div>My solutions</div>} handle={{ permission: () => PermisosEnum.Mis_Soluciones}}/>
      </Route>
    </Route>
  </Routes>
);

export default AppRoutes;