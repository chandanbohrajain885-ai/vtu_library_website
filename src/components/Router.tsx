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
import PublisherCornerPage from '@/components/pages/PublisherCornerPage';
import LibrarianCornerPage from '@/components/pages/LibrarianCornerPage';
import AboutPage from '@/components/pages/AboutPage';
import LibrarianAccountsChecker from '@/components/pages/LibrarianAccountsChecker';
import { AuthProvider } from '@/components/auth/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
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
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "admin",
        element: <AdminDashboard />,
      },
      {
        path: "publisher",
        element: <PublisherCornerPage />,
      },
      {
        path: "librarian",
        element: <LibrarianCornerPage />,
      },
      {
        path: "librarian-accounts-check",
        element: <LibrarianAccountsChecker />,
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
    <LanguageProvider>
      <AuthProvider>
        <MemberProvider>
          <RouterProvider router={router} />
        </MemberProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
