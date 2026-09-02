import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Product from './pages/Product'
import About from './pages/About'
import Contact from './pages/Contact'
import Footer from './components/Footer'
import PrivacyPolicy from './pages/PrivacyPolicy'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <BrowserRouter>

      <ScrollToTop />

      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coleccion" element={<Collection />} />
        <Route path="/producto/:id" element={<Product />} />
        <Route path="/sobre-mi" element={<About />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/politica-privacidad" element={<PrivacyPolicy />} />
      </Routes>

      <Footer />

    </BrowserRouter>
  )
}

export default App