import AvatarDropdown from '@/components/common/Header/Avatar'
import LanguageSwitcher from '@/components/common/Header/LanguageSwitcher'
import { Link, Outlet } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Layout() {
  const { t } = useTranslation()
  return (
    <div className="app-background min-h-[100dvh]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-blue-600 focus:p-3 focus:text-white"
      >
        {t('ui.skipContent')}
      </a>
      <header className="border-b border-slate-700/60 bg-slate-950/40">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/debt"
            className="flex min-h-11 items-center gap-3 rounded-lg text-white"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 shadow-lg shadow-blue-950/30">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              {t('debt.title')}
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher />
            <AvatarDropdown />
          </div>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="px-4 pb-12 sm:px-6 lg:px-8"
      >
        <Outlet />
      </main>
    </div>
  )
}
