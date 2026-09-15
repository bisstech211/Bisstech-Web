import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './lib/auth';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';

import Blogs from './pages/Blogs';
import Services from './pages/Services';
import Leads from './pages/Leads';
import Newsletter from './pages/Newsletter';
import Media from './pages/Media';
import Pages from './pages/Pages';
import Seo from './pages/Seo';
import Tracking from './pages/Tracking';
import Webhooks from './pages/Webhooks';
import Users from './pages/Users';
import Audit from './pages/Audit';
import Settings from './pages/Settings';

function Protected({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user || !localStorage.getItem('accessToken')) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="services" element={<Services />} />
        <Route path="leads" element={<Leads />} />
        <Route path="newsletter" element={<Newsletter />} />
        <Route path="media" element={<Media />} />
        <Route path="pages" element={<Pages />} />
        <Route path="seo" element={<Seo />} />
        <Route path="tracking" element={<Tracking />} />
        <Route path="webhooks" element={<Webhooks />} />
        <Route path="users" element={<Users />} />
        <Route path="audit" element={<Audit />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
