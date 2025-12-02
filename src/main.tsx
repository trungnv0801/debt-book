import React, { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import '@/lang/index'
import '@/assets/index.css'
import App from '@/App'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>,
)
