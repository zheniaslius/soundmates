import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { fetcher } from '@api';
import { SWRConfig } from 'swr';
import './globals.css';
import RootLayout from './layouts/RootLayout';
import DashboardLayout from './layouts/DashboardLayout';
import HomePage from '@pages/Home';
import LoginPage from '@pages/Login';
import { ThemeProvider } from '@components/theme-provider';
import { Toaster } from '@components/ui/toaster';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <DashboardLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          {
            path: '/finish-sign-in',
            element: <HomePage />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <SWRConfig>
      <RouterProvider router={router} />
      <Toaster />
    </SWRConfig>
  </ThemeProvider>
);
