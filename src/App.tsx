import React, { lazy, Suspense, useState, useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import './styles/global.css';
import './App.css';

const SimulatorPage = lazy(() => import('./pages/SimulatorPage').then(page => ({ default: page.SimulatorPage })));
const SubstanceCatalogPage = lazy(() => import('./pages/SubstanceCatalogPage').then(page => ({ default: page.SubstanceCatalogPage })));
const ReactionGuidePage = lazy(() => import('./pages/ReactionGuidePage').then(page => ({ default: page.ReactionGuidePage })));
const ChallengesPage = lazy(() => import('./pages/ChallengesPage').then(page => ({ default: page.ChallengesPage })));
const PeriodicTablePage = lazy(() => import('./pages/PeriodicTablePage').then(page => ({ default: page.PeriodicTablePage })));

const ScrollToPageStart = () => {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('quimlab-theme');
    return saved === 'dark' || saved === 'light' ? saved : 'light';
  });

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('quimlab-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <BrowserRouter>
      <ScrollToPageStart />
      <div className="app-layout">
        <a className="skip-link" href="#main-content">Pular para o conteúdo principal</a>
        <Navbar theme={theme} onToggleTheme={toggleTheme} />

        <main id="main-content" className="main-content" tabIndex={-1}>
          <Suspense fallback={<div className="route-loading" role="status">Carregando o laboratório...</div>}>
            <Routes>
              <Route path="/" element={<SimulatorPage />} />
              <Route path="/periodic-table" element={<PeriodicTablePage />} />
              <Route path="/substances" element={<SubstanceCatalogPage />} />
              <Route path="/reactions" element={<ReactionGuidePage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route
                path="*"
                element={(
                  <section className="not-found container" aria-labelledby="not-found-title">
                    <span className="not-found-code">404</span>
                    <h1 id="not-found-title">Esta página não existe</h1>
                    <p>O endereço pode ter mudado ou não fazer parte do QuimLab.</p>
                    <Link className="btn btn-primary" to="/">Voltar ao laboratório</Link>
                  </section>
                )}
              />
            </Routes>
          </Suspense>
        </main>

        <footer className="app-footer">
          <div className="container footer-container">
            <div className="footer-brand">
              <strong>QuimLab</strong>
              <span>Laboratório escolar de reações químicas</span>
            </div>
            <nav className="footer-nav" aria-label="Rodapé">
              <Link to="/">Laboratório</Link>
              <Link to="/periodic-table">Tabela periódica</Link>
              <Link to="/substances">Substâncias</Link>
              <Link to="/reactions">Tipos de reação</Link>
              <Link to="/challenges">Desafios</Link>
            </nav>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
