import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Layout from '@/layouts/Layout'
import Pages from '@/pages'
import PrivateRoute from '@/router/PrivateRouter'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <PrivateRoute>
                <Pages.DebtView />
              </PrivateRoute>
            }
          />
        </Route>

        <Route path="/login" element={<Pages.LoginView />} />
        <Route path="/forgot-password" element={<Pages.ForgotPasswordView />} />
        <Route path="/reset-password" element={<Pages.ResetPasswordView />} />
        <Route path="*" element={<Pages.NotFoundView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
