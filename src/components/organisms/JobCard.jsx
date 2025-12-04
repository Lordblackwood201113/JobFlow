import { MapPin, Calendar, Briefcase, Star, Trash2, Edit, ExternalLink, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils';
import Card from '../ui/Card';
import Tag from '../atoms/Tag';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';

const JobCard = ({ job, onEdit, onDelete, onToggleFavorite }) => {
  const navigate = useNavigate();

  const workTypeLabels = {
    remote: 'Télétravail',
    hybrid: 'Hybride',
    onsite: 'Sur site',
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {job.position_title}
            </h3>
            {job.is_favorite && (
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            )}
          </div>
          <p className="text-gray-600 font-medium">{job.company_name}</p>
        </div>
        <Tag status={job.status} />
      </div>

      <div className="space-y-2 mb-4">
        {job.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
        )}

        {job.work_type && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Briefcase className="h-4 w-4" />
            <span>{workTypeLabels[job.work_type]}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Postulé le {formatDate(job.date_applied, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {job.contract_type && (
          <Badge variant="default" size="sm">
            {job.contract_type}
          </Badge>
        )}
        {job.salary_min && job.salary_max && (
          <Badge variant="default" size="sm">
            {job.salary_min}€ - {job.salary_max}€
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2 pt-4 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/jobs/${job.id}`)}
          className="flex-1"
        >
          <Eye className="h-4 w-4 mr-1" />
          Détails
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleFavorite(job.id, !job.is_favorite)}
          className="flex-1"
        >
          <Star
            className={`h-4 w-4 mr-1 ${job.is_favorite ? 'fill-yellow-500 text-yellow-500' : ''}`}
          />
          Favori
        </Button>

        <Button variant="ghost" size="sm" onClick={() => onEdit(job)} className="flex-1">
          <Edit className="h-4 w-4 mr-1" />
          Modifier
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(job.id)}
          className="text-red-600 hover:bg-red-50"
          aria-label={`Supprimer la candidature chez ${job.company_name}`}
          title="Supprimer"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </Card>
  );
};

export default JobCard;
