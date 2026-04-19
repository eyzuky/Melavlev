import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider, useLang } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import OurModel from './pages/OurModel';
import Solutions from './pages/Solutions';
import SolutionDetail from './pages/SolutionDetail';
import Projects from './pages/Impact';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/model" element={<OurModel />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/solutions/:slug" element={<SolutionDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/impact" element={<Navigate to="/projects" replace />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function AppContent() {
  const { lang } = useLang();

  useEffect(() => {
    document.getElementById('root').classList.add('lang-transition');
    const timer = setTimeout(() => document.getElementById('root').classList.remove('lang-transition'), 300);
    return () => clearTimeout(timer);
  }, [lang]);

  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </HashRouter>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
