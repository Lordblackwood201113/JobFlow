import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  Phone,
  Mail,
  User,
  FileText,
  Edit,
  Trash2,
  ExternalLink,
  Star,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobsContext';
import jobsService from '../services/jobsService';
import storageService from '../services/storageService';
import useFileUpload from '../hooks/useFileUpload';
import useConfirm from '../hooks/useConfirm';
import Button from '../components/atoms/Button';
import Tag from '../components/atoms/Tag';
import Badge from '../components/atoms/Badge';
import Card from '../components/ui/Card';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Textarea from '../components/atoms/Textarea';
import FileUpload from '../components/molecules/FileUpload';
import DocumentList from '../components/organisms/DocumentList';
import showToast from '../lib/toast';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleFavorite, deleteJob } = useJobs();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();

  const [job, setJob] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const { uploadFile, uploading, progress } = useFileUpload();

  useEffect(() => {
    if (id && user) {
      loadJobDetails();
      loadDocuments();
    }
  }, [id, user]);

  const loadJobDetails = async () => {
    setLoading(true);
    try {
      const { data, error } = await jobsService.getJobById(id);

      if (error) {
        showToast.error('Erreur lors du chargement');
        navigate('/dashboard');
        return;
      }

      setJob(data);
      setNotes(data.notes || '');
    } catch (error) {
      showToast.error('Erreur lors du chargement');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    const { data } = await storageService.getJobDocuments(id);
    setDocuments(data || []);
  };

  const handleSaveNotes = async () => {
    if (!job) return;

    setIsSavingNotes(true);
    try {
      const { error } = await jobsService.updateJob(job.id, { notes });

      if (error) {
        showToast.error('Erreur lors de la sauvegarde');
      } else {
        showToast.success('Notes sauvegardées');
        setJob({ ...job, notes });
      }
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleFileUpload = async (file, documentType) => {
    const { data, error } = await uploadFile(user.id, id, file, documentType);
    if (!error) {
      loadDocuments();
    }
  };

  const handleToggleFavorite = async () => {
    if (!job) return;
    await toggleFavorite(job.id, !job.is_favorite);
    setJob({ ...job, is_favorite: !job.is_favorite });
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Supprimer la candidature',
      message: 'Êtes-vous sûr de vouloir supprimer cette candidature ? Cette action est irréversible.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'danger',
    });

    if (confirmed) {
      const { error } = await deleteJob(id);
      if (!error) {
        navigate('/dashboard');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const workTypeLabels = {
    remote: 'Télétravail',
    hybrid: 'Hybride',
    onsite: 'Sur site',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#D8F26E]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent"></div>
          <p className="mt-4 text-gray-900 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#D8F26E]">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour au tableau de bord
          </Button>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {job.position_title}
                </h1>
                {job.is_favorite && (
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                )}
              </div>
              <h2 className="text-xl text-gray-700 font-medium">
                {job.company_name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Tag status={job.status} />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFavorite}
              >
                <Star
                  className={`h-5 w-5 ${job.is_favorite ? 'fill-yellow-500 text-yellow-500' : ''}`}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/dashboard`)}
              >
                <Edit className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations principales */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informations générales
              </h3>

              <div className="space-y-3">
                {job.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{job.location}</span>
                  </div>
                )}

                {job.work_type && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">
                      {workTypeLabels[job.work_type]}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">
                    Postulé le {formatDate(job.date_applied)}
                  </span>
                </div>

                {job.date_interview && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-purple-400" />
                    <span className="text-gray-700">
                      Entretien prévu le {formatDate(job.date_interview)}
                    </span>
                  </div>
                )}

                {(job.salary_min || job.salary_max) && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">
                      {job.salary_min && job.salary_max
                        ? `${job.salary_min}€ - ${job.salary_max}€`
                        : job.salary_min
                        ? `À partir de ${job.salary_min}€`
                        : `Jusqu'à ${job.salary_max}€`}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {job.contract_type && (
                  <Badge variant="default">{job.contract_type}</Badge>
                )}
                {job.source && <Badge variant="default">{job.source}</Badge>}
                {job.job_url && (
                  <a
                    href={job.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-[#8B5CF6] hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Voir l'offre
                  </a>
                )}
              </div>
            </Card>

            {/* Description */}
            {job.description && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description du poste
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {job.description}
                </p>
              </Card>
            )}

            {/* Prérequis */}
            {job.requirements && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Prérequis
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {job.requirements}
                </p>
              </Card>
            )}

            {/* Notes */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Notes personnelles
              </h3>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                placeholder="Ajoutez vos notes personnelles sur cette candidature..."
              />
              <div className="mt-3 flex justify-end">
                <Button
                  variant="primary"
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes || notes === (job.notes || '')}
                >
                  {isSavingNotes ? 'Sauvegarde...' : 'Sauvegarder les notes'}
                </Button>
              </div>
            </Card>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Contact */}
            {(job.contact_name || job.contact_email || job.contact_phone) && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact
                </h3>
                <div className="space-y-3">
                  {job.contact_name && (
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700 text-sm">
                        {job.contact_name}
                      </span>
                    </div>
                  )}
                  {job.contact_email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <a
                        href={`mailto:${job.contact_email}`}
                        className="text-[#8B5CF6] text-sm hover:underline"
                      >
                        {job.contact_email}
                      </a>
                    </div>
                  )}
                  {job.contact_phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <a
                        href={`tel:${job.contact_phone}`}
                        className="text-[#8B5CF6] text-sm hover:underline"
                      >
                        {job.contact_phone}
                      </a>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Documents */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <FileText className="inline h-5 w-5 mr-2" />
                Documents ({documents.length})
              </h3>

              <FileUpload
                onFileSelect={handleFileUpload}
                uploading={uploading}
                progress={progress}
              />

              {documents.length > 0 && (
                <div className="mt-4">
                  <DocumentList
                    documents={documents}
                    onDocumentDeleted={loadDocuments}
                  />
                </div>
              )}
            </Card>
          </div>
        </div>

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

export default JobDetails;
