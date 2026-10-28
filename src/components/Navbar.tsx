import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FlaskConical, Moon, Sun, Menu, X, Grid2X2, Atom, BookOpen, Trophy, Library, ArrowUpRight } from 'lucide-react';
import './Navbar.css';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { to: '/', label: 'Laboratório', icon: FlaskConical },
    { to: '/periodic-table', label: 'Tabela periódica', icon: Grid2X2 },
    { to: '/substances', label: 'Substâncias', icon: Library },
    { to: '/molecules', label: 'Moléculas', icon: Atom },
    { to: '/reactions', label: 'Tipos de reação', icon: BookOpen },
    { to: '/challenges', label: 'Desafios', icon: Trophy }
  ];

  return (
    <header className={`masthead ${menuOpen ? 'menu-open' : ''}`} onKeyDown={event => { if (event.key === 'Escape') setMenuOpen(false); }}>
      <div className="masthead-inner">
        <div className="masthead-top">
          <Link to="/" className="wordmark" onClick={() => setMenuOpen(false)}>
            <FlaskConical className="wordmark-icon" size={27} strokeWidth={1.6} aria-hidden="true" />
            <span className="wordmark-name">QuimLab</span>
          </Link>
          <button type="button" className="mobile-menu-toggle" aria-label={menuOpen ? 'Fechar navegação' : 'Abrir navegação'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <span className="nav-context">Seu laboratório de química</span>
        <nav id="main-navigation" className="masthead-nav" aria-label="Principal">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)} className={`nav-link ${location.pathname === to ? 'active' : ''}`} aria-current={location.pathname === to ? 'page' : undefined}>
              <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link to="/challenges" className="sidebar-study" onClick={() => setMenuOpen(false)}><span>Da teoria à prática</span><strong>Teste seu equilíbrio <ArrowUpRight size={16} aria-hidden="true" /></strong></Link>
          <button onClick={onToggleTheme} className="theme-toggle-btn" aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}>
            {theme === 'dark' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
            <span>{theme === 'dark' ? 'Tema claro' : 'Tema escuro'}</span>
          </button>
          <span className="sidebar-footnote">Explore. Combine. Descubra.</span>
        </div>
      </div>
    </header>
  );
};
