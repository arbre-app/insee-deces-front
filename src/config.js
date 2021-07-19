export const IS_DEVELOPMENT = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const FRONTEND_URL = !IS_DEVELOPMENT ? 'https://arbre.app/insee' : 'http://localhost:3000';
export const API_ENDPOINT = 'https://insee.arbre.app';

export const DB_TOTAL_RECORDS = 25686019;
export const DB_LAST_UPDATE = '2021-06-28';

export const RESULTS_PER_PAGE = [25, 50, 100];
export const DEFAULT_RESULTS_PER_PAGE = RESULTS_PER_PAGE[0];
