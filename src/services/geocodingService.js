/**
 * Service de géocodage utilisant OpenStreetMap (Nominatim)
 * C'est une alternative gratuite à Google Places API qui ne nécessite pas de clé API pour les petits volumes.
 */

// Cache simple pour éviter de rappeler l'API pour la même ville
const geocodingCache = new Map();

const geocodingService = {
  /**
   * Trouve les coordonnées (lat, lon) d'une ville ou d'une adresse
   * @param {string} location - Le nom de la ville ou l'adresse
   * @returns {Promise<{lat: number, lng: number}|null>}
   */
  async getCoordinates(location) {
    if (!location) return null;

    // Nettoyage du nom de la ville (ex: "Paris (Hybride)" -> "Paris")
    const cleanLocation = location.split('(')[0].trim();

    // Vérifier le cache
    if (geocodingCache.has(cleanLocation)) {
      return geocodingCache.get(cleanLocation);
    }

    // Vérifier le sessionStorage pour persister entre les rechargements
    const cachedSession = sessionStorage.getItem(`geo_${cleanLocation}`);
    if (cachedSession) {
      const coords = JSON.parse(cachedSession);
      geocodingCache.set(cleanLocation, coords);
      return coords;
    }

    try {
      // Appel à l'API Nominatim d'OpenStreetMap
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanLocation)}`
      );
      
      const data = await response.json();

      if (data && data.length > 0) {
        const coords = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
        
        // Mettre en cache
        geocodingCache.set(cleanLocation, coords);
        sessionStorage.setItem(`geo_${cleanLocation}`, JSON.stringify(coords));
        
        return coords;
      }
      
      return null;
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      return null;
    }
  },

  /**
   * Enrichit une liste d'offres avec des coordonnées
   */
  async geocodeOffers(offers) {
    const geocodedOffers = await Promise.all(
      offers.map(async (offer) => {
        // Si c'est du télétravail complet, pas de coordonnées spécifiques
        if (offer.work_type === 'remote' || offer.location?.toLowerCase().includes('télétravail')) {
          return { ...offer, coordinates: null };
        }

        const coordinates = await this.getCoordinates(offer.location);
        return { ...offer, coordinates };
      })
    );

    return geocodedOffers;
  }
};

export default geocodingService;

