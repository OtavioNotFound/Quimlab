import { useId, useRef, useState, type InputHTMLAttributes } from 'react';
import { CornerDownLeft } from 'lucide-react';
import { formatFormulaDisplay } from '../chemistry/formulaParser';
import { completeFormula, findFormulaSuggestions, getFormulaToken } from '../utils/formulaSuggestions';
import './FormulaAutocomplete.css';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string;
  onValueChange: (value: string) => void;
  equation?: boolean;
}

export function FormulaAutocomplete({ value, onValueChange, equation = false, onKeyDown, onFocus, onBlur, ...props }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [caret, setCaret] = useState(value.length);
  const [active, setActive] = useState(0);
  const token = getFormulaToken(value, caret, equation);
  const suggestions = focused && !dismissed && token ? findFormulaSuggestions(token.query) : [];
  const expanded = suggestions.length > 0;
  const activeIndex = Math.min(active, Math.max(0, suggestions.length - 1));

  function choose(formula: string) {
    if (!token) return;
    const next = completeFormula(value, token, formula);
    onValueChange(next.value);
    setDismissed(true);
    setCaret(next.caret);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(next.caret, next.caret);
    });
  }

  return (
    <div className="formula-autocomplete">
      <input {...props} ref={inputRef} value={value} autoComplete="off" autoCapitalize="off" spellCheck={false}
        role="combobox" aria-autocomplete="list" aria-expanded={expanded}
        aria-controls={expanded ? `${id}-list` : undefined}
        aria-activedescendant={expanded ? `${id}-option-${activeIndex}` : undefined}
        onFocus={event => { setFocused(true); setCaret(event.currentTarget.selectionStart ?? value.length); onFocus?.(event); }}
        onBlur={event => { setFocused(false); onBlur?.(event); }}
        onSelect={event => setCaret(event.currentTarget.selectionStart ?? value.length)}
        onChange={event => {
          setCaret(event.currentTarget.selectionStart ?? event.target.value.length);
          setActive(0);
          setDismissed(false);
          onValueChange(event.target.value);
        }}
        onKeyDown={event => {
          if (event.nativeEvent.isComposing) return;
          if (expanded && ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(event.key)) {
            event.preventDefault();
            if (event.key === 'Escape') setDismissed(true);
            else if (event.key === 'Enter') choose(suggestions[activeIndex].formula);
            else setActive((activeIndex + (event.key === 'ArrowDown' ? 1 : -1) + suggestions.length) % suggestions.length);
            return;
          }
          if (!expanded && event.key === 'ArrowDown' && token) {
            event.preventDefault(); setDismissed(false); return;
          }
          onKeyDown?.(event);
        }}
      />
      {expanded && (
        <div className="formula-suggestions-panel">
          <div className="formula-suggestions-help">Escolha uma substância <span>↑ ↓ · Enter</span></div>
          <ul id={`${id}-list`} role="listbox" aria-label="Sugestões de substâncias">
            {suggestions.map((suggestion, index) => (
              <li key={suggestion.formula} id={`${id}-option-${index}`} role="option" aria-selected={index === activeIndex}
                onPointerDown={event => event.preventDefault()} onClick={() => choose(suggestion.formula)}>
                <strong>{formatFormulaDisplay(suggestion.formula)}</strong><span>{suggestion.name}</span>
                {index === activeIndex && <CornerDownLeft size={14} aria-hidden="true" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
