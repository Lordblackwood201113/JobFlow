import { useState, useEffect } from 'react';

/**
 * Hook pour debouncer une valeur
 * @param {*} value - La valeur à debouncer
 * @param {number} delay - Le délai en millisecondes (par défaut 300ms)
 * @returns {*} La valeur debouncée
 */
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Créer un timer qui met à jour la valeur debouncée après le délai
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: annuler le timer si la valeur change avant la fin du délai
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
