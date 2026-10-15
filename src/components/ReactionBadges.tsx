import React from 'react';
import { ReactionTypeClassification } from '../chemistry/types';
import './ReactionBadges.css';

interface ReactionBadgesProps {
  classifications: ReactionTypeClassification[];
  characteristics?: string[];
}

export const ReactionBadges: React.FC<ReactionBadgesProps> = ({
  classifications,
  characteristics = []
}) => {
  if (classifications.length === 0) return null;

  return (
    <section className="reaction-classification-container" aria-label="Classificação da reação">
      <p className="reaction-classification-label">Classificação</p>
      <ul className="reaction-classification-list">
        {classifications.map((item, idx) => (
          <li key={idx}>
            <strong>{item.name}</strong>
            <span>{item.definition}</span>
          </li>
        ))}
      </ul>

        {characteristics.length > 0 && (
          <p className="characteristics-row">
            <strong>Características:</strong> {characteristics.join(' ')}
          </p>
        )}
    </section>
  );
};
