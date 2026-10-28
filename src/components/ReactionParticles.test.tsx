import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseEquation } from '../chemistry/equationParser';
import { ReactionParticles } from './ReactionParticles';

function render(equation: string) {
  const parsed = parseEquation(equation);
  expect(parsed.isValid).toBe(true);
  return renderToStaticMarkup(<ReactionParticles reactants={parsed.reactants} products={parsed.products} originalReactants={parsed.reactants} originalProducts={parsed.products} />);
}

describe('ReactionParticles scientific representation', () => {
  it('uses coefficients in conservation totals without drawing duplicate units', () => {
    const html = render('2 H2 + O2 -> 2 H2O');
    expect(html).toContain('Conservado');
    expect(html).toContain('2 × H2O');
    expect(html.match(/<circle /g)).toHaveLength(7);
    expect(html.match(/<strong>4<\/strong>/g)).toHaveLength(2);
  });

  it('reports an imbalance instead of implying the input is conserved', () => {
    const html = render('H2 + O2 -> H2O');
    expect(html).toContain('Não conservado');
  });

  it('bounds large formulas and coefficients while retaining exact counts', () => {
    const html = render('1000 C100H202 + 1000 O2 -> 1000 CO2 + 1000 H2O');
    expect(html.match(/<circle /g)?.length).toBeLessThanOrEqual(48);
    expect(html).toContain('+290 átomos por unidade');
    expect(html).toContain('<strong>202000</strong>');
  });
});
