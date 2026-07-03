// Guarda o tema visual da aplicacao.
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Usa o tema salvo ou comeca no modo claro.
  const [theme, setTheme] = useState(() => localStorage.getItem('expense-theme') || 'light');

  // Aplica o tema no HTML e no body.
  useEffect(() => {
    localStorage.setItem('expense-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Alterna entre claro e escuro.
  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  // Entrega o tema para os componentes filhos.
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Facilita o acesso ao contexto de tema.
export function useTheme() {
  return useContext(ThemeContext);
}
