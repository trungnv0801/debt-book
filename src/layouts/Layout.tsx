import AvatarDropdown from '@/components/common/Header/Avatar'
import LanguageSwitcher from '@/components/common/Header/LanguageSwitcher'
import { Outlet } from 'react-router-dom'

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <header className="flex items-center justify-between py-3 shadow">
        <LanguageSwitcher />
        <AvatarDropdown />
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
