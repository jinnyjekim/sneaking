import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { InstagramDmPage } from './InstagramDmPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InstagramDmPage />
  </StrictMode>,
)
