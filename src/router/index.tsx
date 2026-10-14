import { createBrowserRouter } from 'react-router-dom'
import Pages from '@/pages'
import DebtWorkspace from '@/pages/debt/DebtWorkspace'
import PersonDebtView from '@/pages/debt/PersonDebtView'
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
            element: <DebtWorkspace />,
            children: [
              { index: true, element: <Pages.DebtView /> },
              { path: 'debt', element: <Pages.DebtView /> },
              { path: 'debt/person/:personId', element: <PersonDebtView /> },
            ],
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
