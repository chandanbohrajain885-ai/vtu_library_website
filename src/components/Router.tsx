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
import ApprovedFilesPage from '@/components/pages/ApprovedFilesPage';
import MemberCollegesPage from '@/components/pages/MemberCollegesPage';
import { AuthProvider } from '@/components/auth/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import DebugUploads from '@/debug-uploads';
import MemberCollegesDataChecker from '@/components/debug/MemberCollegesDataChecker';
import Check2014Data from '@/check-2014-15-data';
import Check2015Data from '@/check-2015-16-data';
import Add2014Data from '@/add-2014-15-data';
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
        path: "approved-files/:uploadType",
        element: <ApprovedFilesPage />,
      },
      {
        path: "member-colleges",
        element: <MemberCollegesPage />,
      },
      {
        path: "librarian-accounts-check",
        element: <LibrarianAccountsChecker />,
      },
      {
        path: "debug-uploads",
        element: <DebugUploads />,
      },
      {
        path: "debug-member-colleges",
        element: <MemberCollegesDataChecker />,
      },
      {
        path: "check-2014-15-data",
        element: <Check2014Data />,
      },
      {
        path: "check-2015-16-data",
        element: <Check2015Data />,
      },
      {
        path: "add-2014-15-data",
        element: <Add2014Data />,
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
