import React, { useEffect, useState, useMemo } from 'react';
import { SUBSTANCE_CATALOG } from '../chemistry/substanceCatalog';
import { SubstanceDetailCard } from '../components/SubstanceDetailCard';
import { Search, Filter } from 'lucide-react';
import './SubstanceCatalogPage.css';

const ORGANIC_TYPE_KEYWORDS = [
  'orgânic',
  'hidrocarboneto',
  'álcool',
  'aldeído',
  'cetona',
  'éter',
  'éster',
  'amina',
  'amida',
  'fenol',
  'carboidrato',
  'aminoácido',
  'alcaloide',
  'ácido carboxílico',
  'heterocíclico',
  'diol',
  'triol'
];

export const SubstanceCatalogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');
  const [visibleCount, setVisibleCount] = useState(60);

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
        if (selectedFilter === 'orgânico' && !ORGANIC_TYPE_KEYWORDS.some(keyword => typeLower.includes(keyword))) return false;
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

  useEffect(() => {
    setVisibleCount(60);
  }, [searchQuery, selectedFilter]);

  const visibleSubstances = filteredSubstances.slice(0, visibleCount);

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
        <span>
          Exibindo <strong>{visibleSubstances.length}</strong> de <strong>{filteredSubstances.length}</strong> substâncias
        </span>
      </div>

      <div className="catalog-grid">
        {visibleSubstances.map(sub => (
          <SubstanceDetailCard
            key={sub.id ?? `${sub.formula}-${sub.preferredName}`}
            formula={sub.formula}
            catalogData={sub}
          />
        ))}
      </div>

      {visibleCount < filteredSubstances.length && (
        <button
          type="button"
          className="btn btn-secondary catalog-load-more"
          onClick={() => setVisibleCount(count => count + 60)}
        >
          Mostrar mais substâncias
        </button>
      )}
    </div>
  );
};
