import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import Pages from '@/pages'

function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Pages.LoginView />} />
      <Route path="*" element={<Pages.NotFoundView />} />
    </Routes>
  )
}

export default App
