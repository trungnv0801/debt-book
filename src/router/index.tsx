import { createBrowserRouter } from 'react-router-dom'
import Pages from '@/pages'
import { MainLayout, PublicLayout, PrivateLayout } from '@/layouts'

const router = createBrowserRouter([
  {
    element: <PrivateLayout />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Pages.DebtView />,
          },
        ],
      },
    ],
  },
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/login',
        element: <Pages.LoginView />,
      },
      {
        path: '/forgot-password',
        element: <Pages.ForgotPasswordView />,
      },
      {
        path: '/reset-password',
        element: <Pages.ResetPasswordView />,
      },
    ],
  },
  {
    path: '*',
    element: <Pages.NotFoundView />,
  },
])

export default router
