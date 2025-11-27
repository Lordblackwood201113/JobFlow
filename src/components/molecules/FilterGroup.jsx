import Select from '../atoms/Select';

const FilterGroup = ({ filters, onFilterChange, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${className}`}>
      <Select
        label="Statut"
        value={filters.status || ''}
        onChange={(e) => onFilterChange('status', e.target.value)}
        options={[
          { value: 'Brouillon', label: 'Brouillon' },
          { value: 'Envoyé', label: 'Envoyé' },
          { value: 'Entretien', label: 'Entretien' },
          { value: 'Offre', label: 'Offre' },
          { value: 'Refus', label: 'Refus' },
        ]}
        placeholder="Tous les statuts"
      />

      <Select
        label="Type de contrat"
        value={filters.contractType || ''}
        onChange={(e) => onFilterChange('contractType', e.target.value)}
        options={[
          { value: 'CDI', label: 'CDI' },
          { value: 'CDD', label: 'CDD' },
          { value: 'Stage', label: 'Stage' },
          { value: 'Freelance', label: 'Freelance' },
        ]}
        placeholder="Tous les types"
      />

      <Select
        label="Type de travail"
        value={filters.workType || ''}
        onChange={(e) => onFilterChange('workType', e.target.value)}
        options={[
          { value: 'remote', label: 'Télétravail' },
          { value: 'hybrid', label: 'Hybride' },
          { value: 'onsite', label: 'Sur site' },
        ]}
        placeholder="Tous les types"
      />

      <Select
        label="Favoris"
        value={filters.favorites ? 'true' : ''}
        onChange={(e) => onFilterChange('favorites', e.target.value === 'true')}
        options={[
          { value: 'true', label: 'Favoris uniquement' },
        ]}
        placeholder="Tous"
      />
    </div>
  );
};

export default FilterGroup;
