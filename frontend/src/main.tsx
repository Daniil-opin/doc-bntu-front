import './styles.css'
import './users.css'
import './select.css'
import './app-shell.css'
import './organization-detail.css'
import './organization-modal.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { App } from './app/App'
import { Providers } from './app/providers'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Providers>
        <App />
      </Providers>
    </BrowserRouter>
  </StrictMode>,
)
