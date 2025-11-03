import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import ResourcesPage from '@/components/pages/ResourcesPage';
import ResourceDetailPage from '@/components/pages/ResourceDetailPage';
import JournalsPage from '@/components/pages/JournalsPage';
import NewsPage from '@/components/pages/NewsPage';
import UserGuidePage from '@/components/pages/UserGuidePage';

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
        path: "resources/:id",
        element: <ResourceDetailPage />,
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
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
