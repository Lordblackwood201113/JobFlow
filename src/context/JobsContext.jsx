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
    favorites: false,
  });

  /**
   * Charger les candidatures
   */
  const loadJobs = async (signal) => {
    if (!user) {
      setJobs([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Timeout de 10 secondes pour éviter le chargement infini
    const timeoutId = setTimeout(() => {
      if (!signal || !signal.aborted) {
        setLoading(false);
        showToast.error('Le chargement prend trop de temps. Veuillez rafraîchir la page.');
      }
    }, 10000);

    try {
      const { data, error } = await jobsService.getAllJobs(user.id, filters);

      // Si la requête a été annulée, ne pas mettre à jour l'état
      if (signal && signal.aborted) {
        clearTimeout(timeoutId);
        return;
      }

      clearTimeout(timeoutId);

      if (error) {
        console.error('Erreur chargement jobs:', error);
        showToast.error('Erreur lors du chargement des candidatures');
        setJobs([]);
      } else {
        // Trier les jobs : favoris en premier, puis par date de candidature (plus récent en premier)
        const sortedJobs = (data || []).sort((a, b) => {
          // D'abord trier par favoris
          if (a.is_favorite && !b.is_favorite) return -1;
          if (!a.is_favorite && b.is_favorite) return 1;
          // Ensuite trier par date de candidature (plus récent en premier)
          return new Date(b.date_applied) - new Date(a.date_applied);
        });
        setJobs(sortedJobs);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      // Ne pas afficher d'erreur si c'est une annulation
      if (signal && signal.aborted) return;

      console.error('Exception chargement jobs:', error);
      showToast.error('Erreur lors du chargement des candidatures');
      setJobs([]);
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
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

    // Timeout de 10 secondes
    const timeoutId = setTimeout(() => {
      console.warn('Timeout lors du chargement des stats');
    }, 10000);

    try {
      const { data, error } = await jobsService.getStats(user.id);
      clearTimeout(timeoutId);

      if (error) {
        console.error('Erreur lors du chargement des stats:', error);
        // Ne pas bloquer l'app si les stats échouent
        setStats(null);
      } else {
        setStats(data);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Exception lors du chargement des stats:', error);
      setStats(null);
    }
  };

  /**
   * Charger au montage et quand les filtres changent
   */
  useEffect(() => {
    if (user) {
      const abortController = new AbortController();
      loadJobs(abortController.signal);
      loadStats();

      // Cleanup: annuler la requête si le composant unmount ou les filtres changent
      return () => {
        abortController.abort();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // Sauvegarder l'état précédent pour rollback en cas d'erreur
    const previousJobs = jobs;

    try {
      // Mise à jour optimiste
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, is_favorite: isFavorite } : job
        )
      );

      const { error } = await jobsService.toggleFavorite(jobId, isFavorite);

      if (error) {
        // Rollback en cas d'erreur
        setJobs(previousJobs);
        showToast.error('Erreur lors de la mise à jour');
        return { error };
      }

      return { error: null };
    } catch (error) {
      // Rollback en cas d'erreur
      setJobs(previousJobs);
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
      favorites: false,
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
