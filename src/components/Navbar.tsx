import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme }) => {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Laboratório' },
    { to: '/periodic-table', label: 'Tabela periódica' },
    { to: '/substances', label: 'Substâncias' },
    { to: '/reactions', label: 'Tipos de reação' },
    { to: '/challenges', label: 'Desafios' }
  ];

  return (
    <header className="masthead">
      <div className="container masthead-inner">
        <div className="masthead-top">
          <Link to="/" className="wordmark">
            <span className="wordmark-name">QuimLab</span>
            <span className="wordmark-tag">Simulador de reações</span>
          </Link>
          <button
            onClick={onToggleTheme}
            className="theme-toggle-btn"
            title={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
          >
            {theme === 'dark' ? 'Claro' : 'Escuro'}
          </button>
        </div>

        <nav className="masthead-nav" aria-label="Principal">
          {navLinks.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
