import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Product from './pages/Product'
import About from './pages/About'
import Contact from './pages/Contact'
import Faq from './pages/Faq'
import Footer from './components/Footer'
import PrivacyPolicy from './pages/PrivacyPolicy'
import ScrollToTop from './components/ScrollToTop'
import RouteSeo from './components/RouteSeo'

// El router se aporta desde fuera: BrowserRouter en el
// navegador (main.jsx) y StaticRouter al prerenderizar
// (entry-server.jsx).
function App() {
  return (
    <>

      <ScrollToTop />

      <RouteSeo />

      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coleccion" element={<Collection />} />
        <Route path="/producto/:id" element={<Product />} />
        <Route path="/sobre-mi" element={<About />} />
        <Route path="/preguntas-frecuentes" element={<Faq />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/politica-privacidad" element={<PrivacyPolicy />} />
      </Routes>

      <Footer />

    </>
  )
}

export default App
