import React from 'react';
import { ReactionTypeClassification } from '../chemistry/types';
import { Sparkles, Info } from 'lucide-react';
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

  const getBadgeClass = (category: string) => {
    switch (category) {
      case 'synthesis':
        return 'badge-primary';
      case 'decomposition':
        return 'badge-purple';
      case 'combustion':
        return 'badge-warning';
      case 'neutralization':
        return 'badge-cyan';
      case 'single_replacement':
      case 'double_replacement':
        return 'badge-primary';
      case 'precipitation':
        return 'badge-success';
      case 'redox':
        return 'badge-rose';
      default:
        return 'badge-primary';
    }
  };

  return (
    <div className="reaction-classification-container">
      <div className="reaction-badges-list">
        {classifications.map((item, idx) => (
          <div key={idx} className={`reaction-tag-item ${getBadgeClass(item.category)}`}>
            <Sparkles size={14} className="tag-sparkle" />
            <span className="tag-name">{item.name}</span>
          </div>
        ))}
      </div>

      <div className="reaction-definition-box">
        {classifications.map((item, idx) => (
          <div key={idx} className="definition-row">
            <span className="definition-name">{item.name}:</span>
            <span className="definition-text">{item.definition}</span>
          </div>
        ))}

        {characteristics.length > 0 && (
          <div className="characteristics-row">
            <Info size={15} className="info-icon" />
            <span>{characteristics.join(' ')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
