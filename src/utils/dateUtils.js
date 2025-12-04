/**
 * Retourne la date du jour au format YYYY-MM-DD en tenant compte du fuseau horaire local
 * @returns {string} Date formatted as YYYY-MM-DD
 */
export const getTodayString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formate une date pour l'affichage
 * @param {string|Date} date - La date à formater
 * @param {object} options - Options de formatage Intl.DateTimeFormat
 * @returns {string} Date formatée
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  const d = new Date(date);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options
  }).format(d);
};

