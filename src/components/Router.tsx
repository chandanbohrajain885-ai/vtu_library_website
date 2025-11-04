import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import ResourcesPage from '@/components/pages/ResourcesPage';
import JournalsPage from '@/components/pages/JournalsPage';
import NewsPage from '@/components/pages/NewsPage';
import UserGuidePage from '@/components/pages/UserGuidePage';
import AdminDashboard from '@/components/pages/AdminDashboard';
import { AuthProvider } from '@/components/auth/AuthContext';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "resources",
        element: <ResourcesPage />,
      },
      {
        path: "resources/:year",
        element: <ResourcesPage />,
      },
      {
        path: "journals",
        element: <JournalsPage />,
      },
      {
        path: "news",
        element: <NewsPage />,
      },
      {
        path: "guide",
        element: <UserGuidePage />,
      },
      {
        path: "admin",
        element: <AdminDashboard />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <AuthProvider>
      <MemberProvider>
        <RouterProvider router={router} />
      </MemberProvider>
    </AuthProvider>
  );
}
