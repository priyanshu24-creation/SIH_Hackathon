import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { RecordsProvider } from './context/RecordsContext.jsx'
import { UIProvider } from './context/UIContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UIProvider>
        <RecordsProvider>
          <App />
        </RecordsProvider>
      </UIProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
