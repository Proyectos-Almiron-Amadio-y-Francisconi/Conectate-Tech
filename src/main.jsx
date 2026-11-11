import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ProductsProvider } from './context/ProductsContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { PedidosProvider } from './context/PedidosContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProductsProvider>
          <PedidosProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </PedidosProvider>
        </ProductsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
