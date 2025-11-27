import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import jobsService from '../services/jobsService';
import showToast from '../lib/toast';

const JobsContext = createContext({});

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs doit être utilisé dans un JobsProvider');
  }
  return context;
};

export const JobsProvider = ({ children }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    contractType: '',
    workType: '',
    search: '',
  });

  /**
   * Charger les candidatures
   */
  const loadJobs = async () => {
    if (!user) {
      setJobs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await jobsService.getAllJobs(user.id, filters);

      if (error) {
        showToast.error('Erreur lors du chargement des candidatures');
      } else {
        setJobs(data || []);
      }
    } catch {
      showToast.error('Erreur lors du chargement des candidatures');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Charger les statistiques
   */
  const loadStats = async () => {
    if (!user) {
      setStats(null);
      return;
    }

    try {
      const { data, error } = await jobsService.getStats(user.id);

      if (error) {
        console.error('Erreur lors du chargement des stats:', error);
      } else {
        setStats(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    }
  };

  /**
   * Charger au montage et quand les filtres changent
   */
  useEffect(() => {
    if (user) {
      loadJobs();
      loadStats();
    }
  }, [user, filters]);

  /**
   * Créer une candidature
   */
  const createJob = async (jobData) => {
    if (!user) return { data: null, error: new Error('Non authentifié') };

    try {
      const { data, error } = await jobsService.createJob(user.id, jobData);

      if (error) {
        showToast.error('Erreur lors de la création de la candidature');
        return { data: null, error };
      }

      showToast.success('Candidature créée avec succès');
      await loadJobs();
      await loadStats();
      return { data, error: null };
    } catch (error) {
      showToast.error('Erreur lors de la création de la candidature');
      return { data: null, error };
    }
  };

  /**
   * Mettre à jour une candidature
   */
  const updateJob = async (jobId, updates) => {
    try {
      const { data, error } = await jobsService.updateJob(jobId, updates);

      if (error) {
        showToast.error('Erreur lors de la mise à jour');
        return { data: null, error };
      }

      showToast.success('Candidature mise à jour');
      await loadJobs();
      await loadStats();
      return { data, error: null };
    } catch (error) {
      showToast.error('Erreur lors de la mise à jour');
      return { data: null, error };
    }
  };

  /**
   * Supprimer une candidature
   */
  const deleteJob = async (jobId) => {
    try {
      const { error } = await jobsService.deleteJob(jobId);

      if (error) {
        showToast.error('Erreur lors de la suppression');
        return { error };
      }

      showToast.success('Candidature supprimée');
      await loadJobs();
      await loadStats();
      return { error: null };
    } catch (error) {
      showToast.error('Erreur lors de la suppression');
      return { error };
    }
  };

  /**
   * Archiver une candidature
   */
  const archiveJob = async (jobId) => {
    try {
      const { error } = await jobsService.archiveJob(jobId);

      if (error) {
        showToast.error('Erreur lors de l\'archivage');
        return { error };
      }

      showToast.success('Candidature archivée');
      await loadJobs();
      await loadStats();
      return { error: null };
    } catch (error) {
      showToast.error('Erreur lors de l\'archivage');
      return { error };
    }
  };

  /**
   * Basculer le favori
   */
  const toggleFavorite = async (jobId, isFavorite) => {
    try {
      const { error } = await jobsService.toggleFavorite(jobId, isFavorite);

      if (error) {
        showToast.error('Erreur lors de la mise à jour');
        return { error };
      }

      // Mise à jour optimiste
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, is_favorite: isFavorite } : job
        )
      );

      return { error: null };
    } catch (error) {
      showToast.error('Erreur lors de la mise à jour');
      return { error };
    }
  };

  /**
   * Mettre à jour les filtres
   */
  const updateFilters = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * Réinitialiser les filtres
   */
  const resetFilters = () => {
    setFilters({
      status: '',
      contractType: '',
      workType: '',
      search: '',
    });
  };

  const value = {
    jobs,
    stats,
    loading,
    filters,
    createJob,
    updateJob,
    deleteJob,
    archiveJob,
    toggleFavorite,
    updateFilters,
    resetFilters,
    refreshJobs: loadJobs,
    refreshStats: loadStats,
  };

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
};
