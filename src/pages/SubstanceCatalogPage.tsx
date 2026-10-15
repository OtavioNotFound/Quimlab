import React, { useState, useMemo } from 'react';
import { SUBSTANCE_CATALOG } from '../chemistry/substanceCatalog';
import { SubstanceDetailCard } from '../components/SubstanceDetailCard';
import { Search, Filter } from 'lucide-react';
import './SubstanceCatalogPage.css';

export const SubstanceCatalogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');

  const filters = [
    { id: 'todos', label: 'Todas as Substâncias' },
    { id: 'ácido', label: 'Ácidos' },
    { id: 'base', label: 'Bases' },
    { id: 'sal', label: 'Sais' },
    { id: 'óxido', label: 'Óxidos' },
    { id: 'simples', label: 'Substâncias Simples' },
    { id: 'orgânico', label: 'Orgânicos' }
  ];

  const filteredSubstances = useMemo(() => {
    return SUBSTANCE_CATALOG.filter(sub => {
      // Filtro por categoria
      if (selectedFilter !== 'todos') {
        const typeLower = sub.substanceType.toLowerCase();
        if (selectedFilter === 'ácido' && !typeLower.includes('ácid')) return false;
        if (selectedFilter === 'base' && !typeLower.includes('base')) return false;
        if (selectedFilter === 'sal' && !typeLower.includes('sal')) return false;
        if (selectedFilter === 'óxido' && !typeLower.includes('óxid')) return false;
        if (selectedFilter === 'simples' && !typeLower.includes('simples')) return false;
        if (selectedFilter === 'orgânico' && !typeLower.includes('orgânic') && !typeLower.includes('hidrocarboneto') && !typeLower.includes('álcool')) return false;
      }

      // Filtro de busca textual
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      return (
        sub.formula.toLowerCase().includes(q) ||
        sub.preferredName.toLowerCase().includes(q) ||
        sub.commonNames.some(cn => cn.toLowerCase().includes(q)) ||
        sub.description.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedFilter]);

  return (
    <div className="substance-catalog-page container">
      <header className="folio-header">
        <div>
          <h1 className="catalog-title">Catálogo de substâncias</h1>
        </div>
        <p className="catalog-subtitle">
          Fórmulas, nomes IUPAC, denominações usuais, massas molares e a função química de cada entrada.
        </p>
      </header>

      <div className="catalog-search-bar">
        <div className="search-input-group">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            aria-label="Pesquisar substâncias"
            placeholder="Pesquisar por fórmula (ex: H2O, NaCl), nome (ex: ácido clorídrico) ou nome usual (ex: soda cáustica)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="catalog-filter-tabs">
          <Filter size={16} className="filter-icon" />
          <div className="filter-chips">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`filter-chip ${selectedFilter === f.id ? 'active' : ''}`}
                aria-pressed={selectedFilter === f.id}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="catalog-results-header">
        <span>Exibindo <strong>{filteredSubstances.length}</strong> substância(s)</span>
      </div>

      <div className="catalog-grid">
        {filteredSubstances.map(sub => (
          <SubstanceDetailCard
            key={sub.formula}
            formula={sub.formula}
            catalogData={sub}
          />
        ))}
      </div>
    </div>
  );
};
