import { Fr, Gb } from 'react-flags-select';

export const IS_DEVELOPMENT = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const FRONTEND_URL = !IS_DEVELOPMENT ? 'https://arbre.app/insee' : 'http://localhost:3000';
export const API_ENDPOINT = 'https://insee.arbre.app';

const CONTACT_EMAIL_PREFIX = 'contact', CONTACT_EMAIL_DOMAIN = 'arbre.app';
export const CONTACT_EMAIL = `${CONTACT_EMAIL_PREFIX}@${CONTACT_EMAIL_DOMAIN}`;

export const DB_TOTAL_RECORDS = 25686019;
export const DB_LAST_UPDATE = '2021-06-28';

export const RESULTS_PER_PAGE = [25, 50, 100];
export const DEFAULT_RESULTS_PER_PAGE = RESULTS_PER_PAGE[0];

export const AVAILABLE_LANGUAGES = [
  { locale: 'fr', name: 'Français', iconComponent: Fr },
  { locale: 'en', name: 'English', iconComponent: Gb },
];
