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
const ChallengeCatalog = lazy(() => import('@/pages/challenges/ChallengeCatalog'));
const Challenge = lazy(() => import('@/pages/challenges/Challenge'));
const Participants = lazy(() => import('@/pages/admin/participants/Participants'));
const Categories = lazy(() => import('@/pages/admin/categories/Categories'));
const Companies = lazy(() => import('@/pages/admin/companies/Companies'));
const Administrators = lazy(() => import('@/pages/admin/administrators/Administrators'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const ChallengeForm = lazy(() => import('@/pages/company/ChallengeForm'));
const RolesAndPermissions = lazy(() => import('@/pages/admin/RolesAndPermissions'));
const CompanyRequest = lazy(() => import('@/pages/admin/Requests/CompanyRequests'));
const SupportRequest = lazy(() => import('@/pages/admin/Requests/SupportRequests'));
const ChallengeEvaluation = lazy(() => import('@/pages/challenges/ChallengeEvaluation'));
const CompanyDashboard = lazy(() => import('@/pages/company/CompanyDashboard'));
const CompanyChallenge = lazy(() => import('@/pages/company/CompanyChallenge'));
const MySolutions = lazy(() => import('@/pages/participant/MySolutions'));
const ChallengeRequest = lazy(() => import('@/pages/admin/challenges-requests/ChallengeRequests'));
const MyProfile = lazy(() => import('@/pages/participant/MyProfile'));

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
      <Route path="/challenges/:search?" element={<LazyComponent component={ChallengeCatalog} />} />
      <Route path="/challenge/:challengeId" element={<LazyComponent component={Challenge} />} />
      <Route path="/companies" element={<LazyComponent component={CompanyListing} />} />
      <Route path="/terms-of-service" element={<LazyComponent component={TermsOfService} />} />
      <Route path="/privacy-policy" element={<LazyComponent component={PrivacyPolicy} />} />
      <Route path="/usage-policy" element={<LazyComponent component={UsagePolicy} />} />
      <Route path="*" element={<LazyComponent component={NotFound} />} />
    </Route>
    <Route path="/sign-in" element={<LazyComponent component={SignIn} />} />
    <Route path="/sign-up" element={<LazyComponent component={SignUp} />} />
    <Route path="/forgot-password" element={<LazyComponent component={ForgotPassword} />} />
    <Route path="/access-denied" element={<LazyComponent component={AccessDenied} />} />
    <Route path="/404" element={<LazyComponent component={NotFound} />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/sign-up/complete" element={<LazyComponent component={RoleSelection} />} handle={{ permission: () => PermisosEnum.Seleccionar_Rol }} />
      <Route path="/sign-up/complete/:role" element={<LazyComponent component={CompleteSignUp} />} handle={{ permission: () => PermisosEnum.Completar_Registro }} />
      <Route path="/company/pending-verification" element={<LazyComponent component={VerificationPending} />} handle={{ permission: () => PermisosEnum.Empresa_Pendiente_Verificacion }} />
      {/* Administration */}
      <Route path="/admin" element={<AdminLayout />} >
        <Route index element={<div>Admin Dashboard</div>} handle={{ permission: () => PermisosEnum.Administrador_Dashboard}} />
        <Route path="participants" element={<LazyComponent component={Participants} />} handle={{ permission: () => PermisosEnum.Administrar_Participantes}} />
        <Route path="categories" element={<LazyComponent component={Categories} />} handle={{ permission: () => PermisosEnum.Administrar_Categorias}} />
        <Route path="challenges" element={<LazyComponent component={ChallengeRequest} />} handle={{ permission: () => PermisosEnum.Solicitudes_Desafíos}} />
        <Route path="company-requests" element={<LazyComponent component={CompanyRequest} />} handle={{ permission: () => PermisosEnum.Solicitudes_Empresas}} />
        <Route path="support-requests" element={<LazyComponent component={SupportRequest} />} handle={{ permission: () => PermisosEnum.Solicitudes_Soportes}} />
        <Route path="companies" element={<LazyComponent component={Companies} />} handle={{ permission: () => PermisosEnum.Administrar_Empresas}} />
        <Route path="administrators" element={<LazyComponent component={Administrators} />} handle={{ permission: () => PermisosEnum.Administrar_Administradores}} />
        <Route path="permissions" element={<LazyComponent component={RolesAndPermissions} />} handle={{ permission: () => PermisosEnum.Administrar_Roles_y_Permisos}} />
        <Route path="*" element={<LazyComponent component={NotFound} />} />
      </Route>
      {/* Company */}
      <Route path="/company" element={<Layout />} >
        <Route index element={<LazyComponent component={CompanyDashboard} />} handle={{ permission: () => PermisosEnum.Empresa_Dashboard }} />
        <Route path="challenge/new" element={<LazyComponent component={ChallengeForm} />} handle={{ permission: () => PermisosEnum.Empresa_Crear_Desafio }} />
        <Route path="challenge/:challengeId" element={<LazyComponent component={CompanyChallenge} />} handle={{ permission: () => PermisosEnum.Empresa_Ver_Desafio }} />
        <Route path="challenge/:challengeId/edit" element={<LazyComponent component={ChallengeForm} />} handle={{ permission: () => PermisosEnum.Empresa_Editar_Desafio }} />
      </Route>
      {/* Participant */}
      <Route element={<Layout />}>
        <Route path="/my-profile" element={<LazyComponent component={MyProfile} />} handle={{ permission: () => PermisosEnum.Mi_perfil }} />
        <Route path="/my-solutions" element={<LazyComponent component={MySolutions} />} handle={{ permission: () => PermisosEnum.Mis_Soluciones }} />
        <Route path="/challenge/:challengeId/evaluate" element={<LazyComponent component={ChallengeEvaluation} />} handle={{ permission: () => PermisosEnum.Evaluar_Desafío }} />
      </Route>
    </Route>
  </Routes>
);

export default AppRoutes;