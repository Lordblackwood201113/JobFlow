// Application Constants

export const JOB_STATUSES = {
  ENVOYE: 'Envoyé',
  ENTRETIEN: 'Entretien',
  REFUS: 'Refus',
  OFFRE: 'Offre',
};

export const WORK_TYPES = {
  REMOTE: 'remote',
  HYBRID: 'hybrid',
  ONSITE: 'onsite',
};

export const WORK_TYPE_LABELS = {
  remote: 'Télétravail',
  hybrid: 'Hybride',
  onsite: 'Sur site',
};

export const CONTRACT_TYPES = {
  CDI: 'CDI',
  CDD: 'CDD',
  STAGE: 'Stage',
  FREELANCE: 'Freelance',
};

export const DOCUMENT_TYPES = {
  CV: 'CV',
  COVER_LETTER: 'Lettre de motivation',
  PORTFOLIO: 'Portfolio',
  OTHER: 'Autre',
};

export const PRIORITY_LEVELS = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
};

export const PRIORITY_LABELS = {
  0: 'Faible',
  1: 'Moyenne',
  2: 'Haute',
};

export const APPLICATION_SOURCES = [
  'LinkedIn',
  'Indeed',
  'Site web entreprise',
  'Référence',
  'JobBoard',
  'Candidature spontanée',
  'Autre',
];

export const FILE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt'],
  },
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  JOB_DETAILS: '/job/:id',
  PROFILE: '/profile',
};
