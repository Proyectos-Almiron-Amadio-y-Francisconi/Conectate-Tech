import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import Home from './pages/Home.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Login from './pages/Login.jsx'
import Admin from './pages/Admin.jsx'
import ProductForm from './pages/ProductForm.jsx'
import RutaAdmin from './components/RutaAdmin.jsx'
import MisPedidos from './pages/MisPedidos.jsx'
import AdminPedidos from './pages/AdminPedidos.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  const { pathname } = useLocation()

  // Al cambiar de página, volver arriba de todo (si no, queda el scroll de la página anterior)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="layout">
      <Navbar />
      <main className="layout__main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<RutaAdmin><Admin /></RutaAdmin>} />
          <Route path="/admin/nuevo" element={<RutaAdmin><ProductForm /></RutaAdmin>} />
          <Route path="/admin/editar/:id" element={<RutaAdmin><ProductForm /></RutaAdmin>} />
          <Route path="/mis-pedidos" element={<MisPedidos />} />
          <Route path="/admin/pedidos" element={<RutaAdmin><AdminPedidos /></RutaAdmin>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />0
      <CartDrawer />
    </div>
  )
}

export default App
