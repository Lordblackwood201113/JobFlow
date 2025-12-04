import { supabase } from '../lib/supabaseClient';

const jobOffersService = {
  /**
   * Récupérer toutes les offres d'emploi actives
   */
  async getOffers() {
    try {
      const { data, error } = await supabase
        .from('job_offers')
        .select('*')
        .eq('is_active', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur récupération offres:', error);
      return { data: [], error };
    }
  },

  /**
   * Importer une offre dans mes candidatures
   */
  async importOffer(userId, offer) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([
          {
            user_id: userId,
            company_name: offer.company_name,
            position_title: offer.position_title,
            job_url: offer.job_url,
            location: offer.location,
            description: offer.description,
            requirements: offer.requirements,
            // work_type doit correspondre aux valeurs autorisées ('remote', 'hybrid', 'onsite')
            // On fait une correspondance simple ou on laisse vide si ça ne matche pas
            work_type: ['remote', 'hybrid', 'onsite'].includes(offer.work_type?.toLowerCase()) 
              ? offer.work_type.toLowerCase() 
              : null,
            contact_name: offer.contact_name,
            contact_email: offer.contact_email,
            contact_phone: offer.contact_phone,
            status: 'Brouillon', // Statut par défaut
            source: offer.source || 'Importé',
            date_applied: new Date().toISOString().split('T')[0]
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Erreur import offre:', error);
      return { data: null, error };
    }
  }
};

export default jobOffersService;
