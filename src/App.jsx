import { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider, useLang } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import OurModel from './pages/OurModel';
import Solutions from './pages/Solutions';
import Impact from './pages/Impact';
import Contact from './pages/Contact';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
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
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/model" element={<OurModel />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
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
