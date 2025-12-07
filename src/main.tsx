import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import '@/lang/index'
import '@/assets/index.css'
import App from '@/App'
import { AuthProvider } from '@/providers'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <Suspense>
        <App />
      </Suspense>
    </AuthProvider>
  </React.StrictMode>,
)
