import { useState } from 'react';
import { Plus, Send, Briefcase, CheckCircle, Filter, X, FileText, BarChart3, Briefcase as BriefcaseIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobsContext';
import useConfirm from '../hooks/useConfirm';
import Button from '../components/atoms/Button';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StatCard from '../components/molecules/StatCard';
import SearchBar from '../components/molecules/SearchBar';
import FilterGroup from '../components/molecules/FilterGroup';
import UserMenu from '../components/molecules/UserMenu';
import JobList from '../components/organisms/JobList';
import JobForm from '../components/organisms/JobForm';
import StatsPanel from '../components/organisms/StatsPanel';

const Dashboard = () => {
  const { user, profile, signOut } = useAuth();
  const {
    jobs,
    stats,
    loading,
    filters,
    createJob,
    updateJob,
    deleteJob,
    toggleFavorite,
    updateFilters,
    resetFilters,
  } = useJobs();

  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' ou 'stats'

  const handleOpenModal = (job = null) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleSubmit = async (jobData) => {
    setIsSubmitting(true);
    try {
      if (editingJob) {
        await updateJob(editingJob.id, jobData);
      } else {
        await createJob(jobData);
      }
      handleCloseModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (jobId) => {
    const confirmed = await confirm({
      title: 'Supprimer la candidature',
      message: 'Êtes-vous sûr de vouloir supprimer cette candidature ? Cette action est irréversible.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'danger',
    });

    if (confirmed) {
      await deleteJob(jobId);
    }
  };

  const handleSearchChange = (value) => {
    updateFilters('search', value);
  };

  const handleFilterChange = (key, value) => {
    updateFilters(key, value);
  };

  const handleResetFilters = () => {
    resetFilters();
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-[#D8F26E]">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Tableau de Bord
            </h1>
            <p className="text-gray-700">
              Bienvenue, {profile?.full_name || user?.email || 'Utilisateur'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" onClick={() => handleOpenModal()}>
              <Plus className="h-5 w-5 mr-2" />
              Nouvelle candidature
            </Button>
            <UserMenu />
          </div>
        </header>

        {/* Onglets */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('applications')}
                className={`${
                  activeTab === 'applications'
                    ? 'border-[#D8F26E] text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                <BriefcaseIcon className="h-5 w-5" />
                Candidatures
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`${
                  activeTab === 'stats'
                    ? 'border-[#D8F26E] text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                <BarChart3 className="h-5 w-5" />
                Statistiques avancées
              </button>
            </nav>
          </div>
        </div>

        {/* Statistiques de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Brouillons"
            value={stats?.draft_count || 0}
            icon={FileText}
            color="default"
          />
          <StatCard
            title="Envoyées"
            value={stats?.sent_count || 0}
            icon={Send}
            color="blue"
          />
          <StatCard
            title="Entretiens"
            value={stats?.interview_count || 0}
            icon={Briefcase}
            color="purple"
          />
          <StatCard
            title="Offres"
            value={stats?.offer_count || 0}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Total"
            value={stats?.total_applications || 0}
            color="yellow"
          />
        </div>

        {/* Contenu selon l'onglet actif */}
        {activeTab === 'applications' ? (
          <>
            {/* Recherche et Filtres */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <SearchBar
                    value={filters.search}
                    onChange={handleSearchChange}
                    placeholder="Rechercher par entreprise ou poste..."
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Filtres
                </Button>
                {(filters.status || filters.contractType || filters.workType) && (
                  <Button variant="ghost" onClick={handleResetFilters}>
                    <X className="h-5 w-5 mr-2" />
                    Réinitialiser
                  </Button>
                )}
              </div>

              {showFilters && (
                <FilterGroup filters={filters} onFilterChange={handleFilterChange} />
              )}
            </div>

            {/* Liste des candidatures */}
            <JobList
              jobs={jobs}
              loading={loading}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              onToggleFavorite={toggleFavorite}
            />
          </>
        ) : (
          /* Panneau de statistiques avancées */
          <StatsPanel />
        )}

        {/* Modal de création/édition */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingJob ? 'Modifier la candidature' : 'Nouvelle candidature'}
          size="lg"
        >
          <JobForm
            job={editingJob}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            loading={isSubmitting}
          />
        </Modal>

        {/* Dialogue de confirmation */}
        <ConfirmDialog
          isOpen={confirmState.isOpen}
          onClose={handleCancel}
          onConfirm={handleConfirm}
          title={confirmState.title}
          message={confirmState.message}
          confirmText={confirmState.confirmText}
          cancelText={confirmState.cancelText}
          variant={confirmState.variant}
        />
      </div>
    </div>
  );
};

export default Dashboard;
