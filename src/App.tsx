import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { FlaskConical } from 'lucide-react';
import './styles/global.css';
import './App.css';

const SimulatorPage = lazy(() => import('./pages/SimulatorPage').then(page => ({ default: page.SimulatorPage })));
const SubstanceCatalogPage = lazy(() => import('./pages/SubstanceCatalogPage').then(page => ({ default: page.SubstanceCatalogPage })));
const ReactionGuidePage = lazy(() => import('./pages/ReactionGuidePage').then(page => ({ default: page.ReactionGuidePage })));
const ChallengesPage = lazy(() => import('./pages/ChallengesPage').then(page => ({ default: page.ChallengesPage })));
const PeriodicTablePage = lazy(() => import('./pages/PeriodicTablePage').then(page => ({ default: page.PeriodicTablePage })));

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('quimlab-theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('quimlab-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar theme={theme} onToggleTheme={toggleTheme} />

        <main className="main-content">
          <Suspense fallback={<div className="route-loading" role="status">Carregando...</div>}>
            <Routes>
              <Route path="/" element={<SimulatorPage />} />
              <Route path="/periodic-table" element={<PeriodicTablePage />} />
              <Route path="/substances" element={<SubstanceCatalogPage />} />
              <Route path="/reactions" element={<ReactionGuidePage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="app-footer">
          <div className="container footer-container">
            <div className="footer-left">
              <FlaskConical size={18} className="footer-icon" />
              <span>
                <strong>QuimLab</strong> — Simulador Interativo & Didático de Reações Químicas
              </span>
            </div>
            <div className="footer-right">
              <span>Desenvolvido com precisão matemática e científica</span>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
