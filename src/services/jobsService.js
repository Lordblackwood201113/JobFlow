import { supabase } from '../lib/supabaseClient';

/**
 * Service pour gérer les opérations CRUD sur les candidatures
 */
const jobsService = {
  /**
   * Récupérer toutes les candidatures de l'utilisateur
   */
  async getAllJobs(userId, options = {}) {
    try {
      let query = supabase
        .from('jobs')
        .select('*')
        .eq('user_id', userId)
        .eq('is_archived', false)
        .order('date_applied', { ascending: false });

      // Appliquer les filtres
      if (options.status) {
        query = query.eq('status', options.status);
      }
      if (options.contractType) {
        query = query.eq('contract_type', options.contractType);
      }
      if (options.workType) {
        query = query.eq('work_type', options.workType);
      }
      if (options.search) {
        query = query.or(
          `company_name.ilike.%${options.search}%,position_title.ilike.%${options.search}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur lors de la récupération des candidatures:', error);
      return { data: null, error };
    }
  },

  /**
   * Récupérer une candidature par son ID
   */
  async getJobById(jobId) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur lors de la récupération de la candidature:', error);
      return { data: null, error };
    }
  },

  /**
   * Créer une nouvelle candidature
   */
  async createJob(userId, jobData) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([
          {
            user_id: userId,
            ...jobData,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur lors de la création de la candidature:', error);
      return { data: null, error };
    }
  },

  /**
   * Mettre à jour une candidature
   */
  async updateJob(jobId, updates) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', jobId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la candidature:', error);
      return { data: null, error };
    }
  },

  /**
   * Supprimer une candidature
   */
  async deleteJob(jobId) {
    try {
      const { error } = await supabase.from('jobs').delete().eq('id', jobId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Erreur lors de la suppression de la candidature:', error);
      return { error };
    }
  },

  /**
   * Archiver une candidature
   */
  async archiveJob(jobId) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update({ is_archived: true })
        .eq('id', jobId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur lors de l\'archivage de la candidature:', error);
      return { data: null, error };
    }
  },

  /**
   * Marquer comme favori
   */
  async toggleFavorite(jobId, isFavorite) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update({ is_favorite: isFavorite })
        .eq('id', jobId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du favori:', error);
      return { data: null, error };
    }
  },

  /**
   * Récupérer les statistiques
   */
  async getStats(userId) {
    try {
      const { data, error } = await supabase
        .from('job_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // Si pas de stats (nouveau user), retourner des stats vides
      if (!data) {
        return {
          data: {
            total_applications: 0,
            sent_count: 0,
            interview_count: 0,
            offer_count: 0,
            rejection_count: 0,
            success_rate: 0,
            interview_rate: 0,
          },
          error: null,
        };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return { data: null, error };
    }
  },
};

export default jobsService;
