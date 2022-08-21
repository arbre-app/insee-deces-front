export const IS_DEVELOPMENT = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const API_ENDPOINT = 'https://insee.arbre.app';

const CONTACT_EMAIL_PREFIX = 'contact', CONTACT_EMAIL_DOMAIN = 'arbre.app';
export const CONTACT_EMAIL = `${CONTACT_EMAIL_PREFIX}@${CONTACT_EMAIL_DOMAIN}`;

export const DB_TOTAL_RECORDS = 26496121;
export const DB_LAST_UPDATE = '2022-08-22';

export const RESULTS_PER_PAGE = [25, 50, 100];
export const DEFAULT_RESULTS_PER_PAGE = RESULTS_PER_PAGE[0];

export const INPUT_MAX_LENGTH = 500;
