import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FlaskConical, BookOpen, Layers, Award, Moon, Sun, Compass } from 'lucide-react';
import './Navbar.css';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme }) => {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Laboratório', icon: FlaskConical },
    { to: '/periodic-table', label: 'Tabela Periódica', icon: Compass },
    { to: '/substances', label: 'Substâncias', icon: BookOpen },
    { to: '/reactions', label: 'Tipos de Reação', icon: Layers },
    { to: '/challenges', label: 'Desafios', icon: Award }
  ];

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo-icon">
            <FlaskConical size={22} className="flask-icon" />
          </div>
          <div className="navbar-brand-text">
            <span className="brand-name">Quim<span className="brand-accent">Lab</span></span>
            <span className="brand-tag">Simulador</span>
          </div>
        </Link>

        <nav className="navbar-nav">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${isActive ? 'active' : ''}`}
                aria-label={link.label}
                title={link.label}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="navbar-actions">
          <button
            onClick={onToggleTheme}
            className="theme-toggle-btn"
            title={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
          >
            {theme === 'dark' ? <Sun size={20} className="sun-icon" /> : <Moon size={20} className="moon-icon" />}
          </button>
        </div>
      </div>
    </header>
  );
};
