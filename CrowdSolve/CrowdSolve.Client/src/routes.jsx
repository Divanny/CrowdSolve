import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PageLoader from '@/components/PageLoader';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';
import HelpCenterLayout from './components/help-center/HelpCenterLayout';
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
const CompanyRequest = lazy(() => import('@/pages/admin/requests/CompanyRequests'));
const SupportRequest = lazy(() => import('@/pages/admin/requests/SupportRequests'));
const ChallengeEvaluation = lazy(() => import('@/pages/challenges/ChallengeEvaluation'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const CompanyDashboard = lazy(() => import('@/pages/company/CompanyDashboard'));
const CompanyChallenge = lazy(() => import('@/pages/company/CompanyChallenge'));
const MySolutions = lazy(() => import('@/pages/participant/MySolutions'));
const ChallengeRequest = lazy(() => import('@/pages/admin/Requests/ChallengeRequests'));
const MyProfile = lazy(() => import('@/pages/participant/MyProfile'));
const PublicProfile = lazy(() => import('@/pages/participant/PublicProfile'));
const Notifications = lazy(() => import('@/pages/Notifications'));
const AdminChallenges = lazy(() => import('@/pages/admin/challenges/AdminChallenges'));
const AdminChallengeDetails = lazy(() => import('@/pages/admin/challenges/AdminChallengeDetails'));
const UserManual = lazy(() => import('@/pages/admin/UserManual'));

const HelpCenter = lazy(() => import('@/pages/help-center/HelpCenter'));
const PostNewChallenge = lazy(() => import('@/pages/help-center/challenges/PostNewChallenge'));
const ViewChallengeCatalog = lazy(() => import('@/pages/help-center/challenges/ViewChallengeCatalog'));
const ParticipateInChallenge = lazy(() => import('@/pages/help-center/challenges/ParticipateInChallenge'));
const EvaluateChallenge = lazy(() => import('@/pages/help-center/challenges/EvaluateChallenge'));

const EditMyProfile = lazy(() => import('@/pages/help-center/user/EditMyProfile'));
const CreateParticipantUser = lazy(() => import('@/pages/help-center/user/CreateParticipantUser'));
const CreateCompanyUser = lazy(() => import('@/pages/help-center/user/CreateCompanyUser'));
const ForgotPasswordHelpCenter = lazy(() => import('@/pages/help-center/user/ForgotPassword'));

const ViewMySolutions = lazy(() => import('@/pages/help-center/solutions/ViewMySolutions'));
const ChangeSolutionPrivacy = lazy(() => import('@/pages/help-center/solutions/ChangeSolutionPrivacy'));

const SendMessage = lazy(() => import('@/pages/help-center/contact-us/SendMessage'));

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
      <Route path="/profile/:userName" element={<LazyComponent component={PublicProfile} />} />
    </Route>
    <Route path="/sign-in" element={<LazyComponent component={SignIn} />} />
    <Route path="/sign-up" element={<LazyComponent component={SignUp} />} />
    <Route path="/forgot-password" element={<LazyComponent component={ForgotPassword} />} />
    <Route path="/access-denied" element={<LazyComponent component={AccessDenied} />} />
    <Route path="/404" element={<LazyComponent component={NotFound} />} />
    <Route path="help-center" element={<HelpCenterLayout />} >
      <Route index element={<LazyComponent component={HelpCenter} />} />
      <Route path="challenges/post-new-challenge" element={<LazyComponent component={PostNewChallenge} />} />
      <Route path="challenges/view-challenge-catalog" element={<LazyComponent component={ViewChallengeCatalog} />} />
      <Route path="challenges/participate-in-challenge" element={<LazyComponent component={ParticipateInChallenge} />} />
      <Route path="challenges/evaluate-challenge" element={<LazyComponent component={EvaluateChallenge} />} />
      <Route path="user/edit-my-profile" element={<LazyComponent component={EditMyProfile} />} />
      <Route path="user/create-participant-user" element={<LazyComponent component={CreateParticipantUser} />} />
      <Route path="user/create-company-user" element={<LazyComponent component={CreateCompanyUser} />} />
      <Route path="user/forgot-password" element={<LazyComponent component={ForgotPasswordHelpCenter} />} />
      <Route path="solutions/view-my-solutions" element={<LazyComponent component={ViewMySolutions} />} />
      <Route path="solutions/change-solution-privacy" element={<LazyComponent component={ChangeSolutionPrivacy} />} />
      <Route path="contact-us/send-message" element={<LazyComponent component={SendMessage} />} />
      <Route path="legal/terms-and-conditions" element={<LazyComponent component={TermsOfService} />} />
      <Route path="legal/privacy-policy" element={<LazyComponent component={PrivacyPolicy} />} />
      <Route path="legal/usage-policy" element={<LazyComponent component={UsagePolicy} />} />
      <Route path="user-manual" element={<LazyComponent component={UserManual} />} />
    </Route>
    <Route element={<ProtectedRoute />}>
      <Route path="/sign-up/complete" element={<LazyComponent component={RoleSelection} />} handle={{ permission: () => PermisosEnum.Seleccionar_Rol }} />
      <Route path="/sign-up/complete/:role" element={<LazyComponent component={CompleteSignUp} />} handle={{ permission: () => PermisosEnum.Completar_Registro }} />
      <Route path="/company/pending-verification" element={<LazyComponent component={VerificationPending} />} handle={{ permission: () => PermisosEnum.Empresa_Pendiente_Verificacion }} />
      {/* Administration */}
      <Route path="/admin" element={<AdminLayout />} >
        <Route index element={<LazyComponent component={AdminDashboard} />} handle={{ permission: () => PermisosEnum.Administrador_Dashboard }} />
        <Route path="participants" element={<LazyComponent component={Participants} />} handle={{ permission: () => PermisosEnum.Administrar_Participantes }} />
        <Route path="categories" element={<LazyComponent component={Categories} />} handle={{ permission: () => PermisosEnum.Administrar_Categorias }} />
        <Route path="challenges-requests" element={<LazyComponent component={ChallengeRequest} />} handle={{ permission: () => PermisosEnum.Solicitudes_Desafíos }} />
        <Route path="company-requests" element={<LazyComponent component={CompanyRequest} />} handle={{ permission: () => PermisosEnum.Solicitudes_Empresas }} />
        <Route path="support-requests" element={<LazyComponent component={SupportRequest} />} handle={{ permission: () => PermisosEnum.Solicitudes_Soportes }} />
        <Route path="challenges" element={<LazyComponent component={AdminChallenges} />} handle={{ permission: () => PermisosEnum.Administrar_Desafíos }} />
        <Route path="challenge/:challengeId" element={<LazyComponent component={AdminChallengeDetails} />} handle={{ permission: () => PermisosEnum.Administrador_Ver_Desafíos }} />
        <Route path="companies" element={<LazyComponent component={Companies} />} handle={{ permission: () => PermisosEnum.Administrar_Empresas }} />
        <Route path="administrators" element={<LazyComponent component={Administrators} />} handle={{ permission: () => PermisosEnum.Administrar_Administradores }} />
        <Route path="permissions" element={<LazyComponent component={RolesAndPermissions} />} handle={{ permission: () => PermisosEnum.Administrar_Roles_y_Permisos }} />
        <Route path="user-manual" element={<LazyComponent component={UserManual} />} handle={{ permission: () => PermisosEnum.Administrador_Manual_Usuario }} />
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
        <Route path="/notifications" element={<LazyComponent component={Notifications} />} handle={{ permission: () => PermisosEnum.Notificaciones }} />
        <Route path="/challenge/:challengeId/evaluate" element={<LazyComponent component={ChallengeEvaluation} />} handle={{ permission: () => PermisosEnum.Evaluar_Desafío }} />
      </Route>
    </Route>
  </Routes>
);

export default AppRoutes;