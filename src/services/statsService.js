import { supabase } from '../lib/supabaseClient';
import { startOfMonth, endOfMonth, format, subMonths } from 'date-fns';

/**
 * Service pour les statistiques avancées
 */
const statsService = {
  /**
   * Obtenir les statistiques de base depuis la vue
   */
  async getBasicStats(userId) {
    try {
      const { data, error } = await supabase
        .from('job_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        return {
          data: {
            total_applications: 0,
            draft_count: 0,
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
      console.error('Erreur lors de la récupération des stats:', error);
      return { data: null, error };
    }
  },

  /**
   * Distribution par statut (pour graphique camembert)
   */
  async getStatusDistribution(userId) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('status')
        .eq('user_id', userId)
        .eq('is_archived', false);

      if (error) throw error;

      // Compter les occurrences de chaque statut
      const distribution = data.reduce((acc, job) => {
        const status = job.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Transformer en format pour recharts
      const chartData = Object.entries(distribution).map(([name, value]) => ({
        name,
        value,
      }));

      return { data: chartData, error: null };
    } catch (error) {
      console.error('Erreur distribution par statut:', error);
      return { data: [], error };
    }
  },

  /**
   * Évolution des candidatures au fil du temps (6 derniers mois)
   */
  async getApplicationsTrend(userId, months = 6) {
    try {
      const endDate = new Date();
      const startDate = subMonths(endDate, months);

      const { data, error } = await supabase
        .from('jobs')
        .select('date_applied, status')
        .eq('user_id', userId)
        .eq('is_archived', false)
        .gte('date_applied', format(startDate, 'yyyy-MM-dd'))
        .order('date_applied', { ascending: true });

      if (error) throw error;

      // Grouper par mois
      const monthlyData = {};

      data.forEach((job) => {
        const monthKey = format(new Date(job.date_applied), 'MMM yyyy');

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthKey,
            total: 0,
            Envoyé: 0,
            Entretien: 0,
            Offre: 0,
            Refus: 0,
          };
        }

        monthlyData[monthKey].total += 1;
        if (job.status !== 'Brouillon') {
          monthlyData[monthKey][job.status] = (monthlyData[monthKey][job.status] || 0) + 1;
        }
      });

      const chartData = Object.values(monthlyData);

      return { data: chartData, error: null };
    } catch (error) {
      console.error('Erreur évolution candidatures:', error);
      return { data: [], error };
    }
  },

  /**
   * Statistiques par source
   */
  async getSourceStats(userId) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('source, status')
        .eq('user_id', userId)
        .eq('is_archived', false)
        .not('source', 'is', null);

      if (error) throw error;

      // Grouper par source
      const sourceStats = {};

      data.forEach((job) => {
        const source = job.source || 'Non spécifié';

        if (!sourceStats[source]) {
          sourceStats[source] = {
            name: source,
            total: 0,
            interviews: 0,
            offers: 0,
            interviewRate: 0,
            successRate: 0,
          };
        }

        sourceStats[source].total += 1;
        if (job.status === 'Entretien') sourceStats[source].interviews += 1;
        if (job.status === 'Offre') sourceStats[source].offers += 1;
      });

      // Calculer les taux
      Object.values(sourceStats).forEach((stat) => {
        stat.interviewRate = stat.total > 0
          ? Math.round((stat.interviews / stat.total) * 100)
          : 0;
        stat.successRate = stat.total > 0
          ? Math.round((stat.offers / stat.total) * 100)
          : 0;
      });

      const chartData = Object.values(sourceStats).sort((a, b) => b.total - a.total);

      return { data: chartData, error: null };
    } catch (error) {
      console.error('Erreur stats par source:', error);
      return { data: [], error };
    }
  },

  /**
   * Délai moyen entre candidature et réponse
   */
  async getAverageResponseTime(userId) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('date_applied, date_response, status')
        .eq('user_id', userId)
        .eq('is_archived', false)
        .not('date_response', 'is', null);

      if (error) throw error;

      if (data.length === 0) {
        return { data: { averageDays: 0, count: 0 }, error: null };
      }

      // Calculer les délais
      const delays = data.map((job) => {
        const applied = new Date(job.date_applied);
        const response = new Date(job.date_response);
        const diffTime = Math.abs(response - applied);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      });

      const averageDays = Math.round(
        delays.reduce((sum, days) => sum + days, 0) / delays.length
      );

      return {
        data: {
          averageDays,
          count: data.length,
        },
        error: null,
      };
    } catch (error) {
      console.error('Erreur délai moyen:', error);
      return { data: { averageDays: 0, count: 0 }, error };
    }
  },

  /**
   * Top 5 des entreprises avec le plus de candidatures
   */
  async getTopCompanies(userId, limit = 5) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('company_name, status')
        .eq('user_id', userId)
        .eq('is_archived', false);

      if (error) throw error;

      // Grouper par entreprise
      const companies = {};

      data.forEach((job) => {
        const company = job.company_name;

        if (!companies[company]) {
          companies[company] = {
            name: company,
            count: 0,
          };
        }

        companies[company].count += 1;
      });

      const topCompanies = Object.values(companies)
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

      return { data: topCompanies, error: null };
    } catch (error) {
      console.error('Erreur top entreprises:', error);
      return { data: [], error };
    }
  },
};

export default statsService;
