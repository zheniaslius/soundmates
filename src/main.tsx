import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { fetcher } from '@api';
import { SWRConfig } from 'swr';
import './globals.css';
import RootLayout from './layouts/RootLayout';
import DashboardLayout from './layouts/DashboardLayout';
import HomePage from '@pages/Home';
import LoginPage from '@pages/Login';
import FinishSignIn from '@pages/FinishSignIn';
import { ThemeProvider } from '@components/theme-provider';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <LoginPage /> },
      { path: '/sign-in/*', element: <LoginPage /> },
      {
        element: <DashboardLayout />,
        path: '/',
        children: [{ path: '/dashboard', element: <HomePage /> }],
      },
      {
        element: <DashboardLayout />,
        path: '/finish-sign-in',
        children: [{ path: '/finish-sign-in', element: <FinishSignIn /> }],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <SWRConfig>
      <RouterProvider router={router} />
    </SWRConfig>
  </ThemeProvider>
);
