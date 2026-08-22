import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import '@/lang/index'
import '@/assets/index.css'
import App from '@/App'
import { AuthProvider } from '@/providers'

registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <Suspense>
        <App />
      </Suspense>
    </AuthProvider>
  </React.StrictMode>,
)
