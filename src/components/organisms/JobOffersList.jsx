import { useState, useEffect } from 'react';
import { Briefcase, MapPin, Building2, ExternalLink, PlusCircle, Clock, User, Phone, Mail, FileText, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import Button from '../atoms/Button';
import Card from '../ui/Card';
import Badge from '../atoms/Badge';
import jobOffersService from '../../services/jobOffersService';
import showToast from '../../lib/toast';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobsContext';

const JobOffersList = () => {
  const { user } = useAuth();
  const { refreshJobs } = useJobs();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importingId, setImportingId] = useState(null);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setLoading(true);
    const { data, error } = await jobOffersService.getOffers();
    if (error) {
      showToast.error('Impossible de charger les offres');
    } else {
      setOffers(data || []);
    }
    setLoading(false);
  };

  const handleImport = async (offer) => {
    setImportingId(offer.id);
    const { error } = await jobOffersService.importOffer(user.id, offer);
    
    if (error) {
      showToast.error("Erreur lors de l'import de l'offre");
    } else {
      showToast.success("Offre ajoutée à vos candidatures (Brouillon)");
      // Retirer l'offre de la liste locale immédiatement
      setOffers(currentOffers => currentOffers.filter(o => o.id !== offer.id));
      refreshJobs(); // Rafraîchir la liste principale
    }
    setImportingId(null);
  };

  const isNewOffer = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7; // Considéré comme "nouveau" si moins de 7 jours
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Recherche des meilleures opportunités...</p>
        </div>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
        <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Aucune nouvelle offre</h3>
        <p className="text-gray-500 mt-1">
          Revenez plus tard pour voir les nouvelles opportunités.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <Card 
              key={offer.id} 
              className="flex flex-col h-full hover:shadow-md transition-shadow"
            >
          <div className="flex items-start justify-between mb-4">
            <div className="min-w-0 flex-1 mr-2">
              <div className="flex items-center flex-wrap gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate max-w-full" title={offer.position_title}>
                  {offer.position_title}
                </h3>
                {isNewOffer(offer.published_at) && (
                  <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Nouveau
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{offer.company_name}</span>
              </div>
            </div>
            {offer.source && (
              <Badge variant="secondary" size="sm" className="flex-shrink-0">
                {offer.source}
              </Badge>
            )}
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              {offer.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {offer.location}
                </div>
              )}
              {offer.work_type && (
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  {offer.work_type}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-gray-400" />
                {formatDate(offer.published_at)}
              </div>
              {offer.application_deadline && (
                <div className="flex items-center gap-1.5 text-red-600">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Date limite: {formatDate(offer.application_deadline)}</span>
                </div>
              )}
            </div>

            {offer.description && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 line-clamp-3 mb-1">
                  <span className="font-medium text-gray-700">Description : </span>
                  {offer.description}
                </p>
              </div>
            )}
            
            {offer.requirements && (
              <div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  <span className="font-medium text-gray-700">Prérequis : </span>
                  {offer.requirements}
                </p>
              </div>
            )}

            {/* Contact info preview (if available) */}
            {(offer.contact_name || offer.contact_email) && (
               <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-gray-100">
                  {offer.contact_name && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <User className="h-3 w-3" /> {offer.contact_name}
                    </div>
                  )}
               </div>
            )}

            {offer.tags && offer.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {offer.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
            {offer.job_url && (
              <a
                href={offer.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Voir l'annonce
              </a>
            )}
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => handleImport(offer)}
              disabled={importingId === offer.id}
            >
              {importingId === offer.id ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent mr-2" />
              ) : (
                <PlusCircle className="h-4 w-4 mr-2" />
              )}
              Ajouter
            </Button>
          </div>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default JobOffersList;
