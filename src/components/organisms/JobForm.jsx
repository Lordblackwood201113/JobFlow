import { useState, useEffect } from 'react';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import Textarea from '../atoms/Textarea';
import Button from '../atoms/Button';

const JobForm = ({ job, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    position_title: '',
    job_url: '',
    location: '',
    work_type: '',
    contract_type: '',
    status: 'Brouillon',
    date_applied: new Date().toISOString().split('T')[0],
    date_interview: '',
    date_response: '',
    salary_min: '',
    salary_max: '',
    salary_currency: 'EUR',
    description: '',
    requirements: '',
    notes: '',
    source: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    priority: '0',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (job) {
      setFormData({
        company_name: job.company_name || '',
        position_title: job.position_title || '',
        job_url: job.job_url || '',
        location: job.location || '',
        work_type: job.work_type || '',
        contract_type: job.contract_type || '',
        status: job.status || 'Brouillon',
        date_applied: job.date_applied || new Date().toISOString().split('T')[0],
        date_interview: job.date_interview || '',
        date_response: job.date_response || '',
        salary_min: job.salary_min || '',
        salary_max: job.salary_max || '',
        salary_currency: job.salary_currency || 'EUR',
        description: job.description || '',
        requirements: job.requirements || '',
        notes: job.notes || '',
        source: job.source || '',
        contact_name: job.contact_name || '',
        contact_email: job.contact_email || '',
        contact_phone: job.contact_phone || '',
        priority: String(job.priority) || '0',
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Le nom de l\'entreprise est requis';
    }

    if (!formData.position_title.trim()) {
      newErrors.position_title = 'Le titre du poste est requis';
    }

    if (formData.job_url && !isValidUrl(formData.job_url)) {
      newErrors.job_url = 'URL invalide';
    }

    if (formData.contact_email && !isValidEmail(formData.contact_email)) {
      newErrors.contact_email = 'Email invalide';
    }

    // Validation des salaires
    if (formData.salary_min && formData.salary_max) {
      const salaryMin = parseInt(formData.salary_min);
      const salaryMax = parseInt(formData.salary_max);
      if (salaryMin > salaryMax) {
        newErrors.salary_max = 'Le salaire maximum doit être supérieur ou égal au salaire minimum';
      }
    }

    // Validation des dates
    if (formData.date_interview && formData.date_applied) {
      const dateApplied = new Date(formData.date_applied);
      const dateInterview = new Date(formData.date_interview);
      if (dateInterview < dateApplied) {
        newErrors.date_interview = 'La date d\'entretien doit être postérieure à la date de candidature';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      // N'accepter que les protocoles HTTP et HTTPS pour éviter les XSS
      return ['http:', 'https:'].includes(url.protocol);
    } catch {
      return false;
    }
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Préparer les données pour la soumission
    const dataToSubmit = {
      ...formData,
      salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
      salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
      priority: parseInt(formData.priority),
      date_interview: formData.date_interview || null,
      date_response: formData.date_response || null,
    };

    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations de base */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Informations de base
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Entreprise"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            error={errors.company_name}
            required
            disabled={loading}
          />

          <Input
            label="Poste"
            name="position_title"
            value={formData.position_title}
            onChange={handleChange}
            error={errors.position_title}
            required
            disabled={loading}
          />
        </div>

        <Input
          label="Lien de l'offre"
          name="job_url"
          value={formData.job_url}
          onChange={handleChange}
          error={errors.job_url}
          placeholder="https://..."
          disabled={loading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Localisation"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Paris, France"
            disabled={loading}
          />

          <Select
            label="Source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            options={[
              { value: 'LinkedIn', label: 'LinkedIn' },
              { value: 'Indeed', label: 'Indeed' },
              { value: 'Site web entreprise', label: 'Site web entreprise' },
              { value: 'Référence', label: 'Référence' },
              { value: 'JobBoard', label: 'JobBoard' },
              { value: 'Candidature spontanée', label: 'Candidature spontanée' },
              { value: 'Autre', label: 'Autre' },
            ]}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Type de travail"
            name="work_type"
            value={formData.work_type}
            onChange={handleChange}
            options={[
              { value: 'remote', label: 'Télétravail' },
              { value: 'hybrid', label: 'Hybride' },
              { value: 'onsite', label: 'Sur site' },
            ]}
            disabled={loading}
          />

          <Select
            label="Type de contrat"
            name="contract_type"
            value={formData.contract_type}
            onChange={handleChange}
            options={[
              { value: 'CDI', label: 'CDI' },
              { value: 'CDD', label: 'CDD' },
              { value: 'Stage', label: 'Stage' },
              { value: 'Freelance', label: 'Freelance' },
            ]}
            disabled={loading}
          />

          <Select
            label="Priorité"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            options={[
              { value: '0', label: 'Basse' },
              { value: '1', label: 'Moyenne' },
              { value: '2', label: 'Haute' },
            ]}
            disabled={loading}
          />
        </div>
      </div>

      {/* Candidature */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Candidature</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Statut"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            options={[
              { value: 'Brouillon', label: 'Brouillon' },
              { value: 'Envoyé', label: 'Envoyé' },
              { value: 'Entretien', label: 'Entretien' },
              { value: 'Offre', label: 'Offre' },
              { value: 'Refus', label: 'Refus' },
            ]}
            disabled={loading}
          />

          <Input
            label="Date de candidature"
            name="date_applied"
            type="date"
            value={formData.date_applied}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <Input
            label="Date d'entretien"
            name="date_interview"
            type="date"
            value={formData.date_interview}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      {/* Rémunération */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Rémunération</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Salaire min"
            name="salary_min"
            type="number"
            value={formData.salary_min}
            onChange={handleChange}
            placeholder="30000"
            disabled={loading}
          />

          <Input
            label="Salaire max"
            name="salary_max"
            type="number"
            value={formData.salary_max}
            onChange={handleChange}
            placeholder="40000"
            disabled={loading}
          />

          <Select
            label="Devise"
            name="salary_currency"
            value={formData.salary_currency}
            onChange={handleChange}
            options={[
              { value: 'EUR', label: 'EUR (€)' },
              { value: 'USD', label: 'USD ($)' },
              { value: 'GBP', label: 'GBP (£)' },
            ]}
            disabled={loading}
          />
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Contact</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Nom du contact"
            name="contact_name"
            value={formData.contact_name}
            onChange={handleChange}
            disabled={loading}
          />

          <Input
            label="Email du contact"
            name="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={handleChange}
            error={errors.contact_email}
            disabled={loading}
          />

          <Input
            label="Téléphone du contact"
            name="contact_phone"
            type="tel"
            value={formData.contact_phone}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      {/* Détails */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Détails</h3>

        <Textarea
          label="Description du poste"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          disabled={loading}
        />

        <Textarea
          label="Prérequis"
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          rows={3}
          disabled={loading}
        />

        <Textarea
          label="Notes personnelles"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          disabled={loading}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="flex-1"
        >
          Annuler
        </Button>
        <Button type="submit" variant="primary" disabled={loading} className="flex-1">
          {loading ? 'Enregistrement...' : job ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default JobForm;
