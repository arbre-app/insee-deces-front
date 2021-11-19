import qs from 'query-string';
import { API_ENDPOINT } from '../config';
import { ErrorBadRequest, ErrorTimeout, ErrorUnavailable } from './errors';

export { ErrorTimeout, ErrorUnavailable };

export const EVENT_TYPE_BIRTH = 'birth';
export const EVENT_TYPE_DEATH = 'death';
export const ORDER_TYPE_ASCENDING = 'ascending';
export const ORDER_TYPE_DESCENDING = 'descending';

export const DEFAULT_EVENT_TYPE = EVENT_TYPE_BIRTH;
export const DEFAULT_ORDER_TYPE = ORDER_TYPE_ASCENDING;

const FETCH_TIMEOUT = 10_000;

function buildURL(root, parameters) {
  return `${API_ENDPOINT}${root}?${qs.stringify(parameters)}`;
}

function timeoutFetch(url) {
  return new Promise((resolve, reject) => {
    let controller = null;
    try {
      controller = new AbortController();
    } catch(e) {
      // AbortController not available (observed on Firefox ESR 52)
    }

    let signal = null, timer = null;
    if(controller !== null) {
      signal = controller.signal;
      timer = setTimeout(() => {
        controller.abort();
        reject(new ErrorTimeout());
      }, FETCH_TIMEOUT);
    }

    fetch(url, signal !== null ? { signal } : undefined)
      .then(result => result.json())
      .then(value => {
        if(timer !== null) {
          clearTimeout(timer);
        }
        if (value.code >= 200 && value.code < 400) { // OK
          resolve(value);
        } else if (value.code === 503) {
          reject(new ErrorUnavailable(value.information)); // This string field is an optional
        } else {
          reject(new ErrorBadRequest(`HTTP ${value.code}`)); // Typically 4XX or 5XX errors
        }
      })
      .catch(reason => {
        if(reason instanceof SyntaxError) {
          reject(new ErrorBadRequest('Invalid JSON')); // Not json (indicates a major issue)
        } else {
          if(timer !== null) {
            clearTimeout(timer);
          }
          reject(reason); // Probably timeout, no connection to server or cross origin policy issue
        }
      });
  });
}

export function getPersons(offset, limit, surname, name, placeId, eventType, afterYear, beforeYear, orderType) {
  return timeoutFetch(buildURL('/persons', {
    offset: offset,
    limit: limit,
    surname: surname,
    name: name,
    place: placeId,
    event: eventType,
    after: afterYear,
    before: beforeYear,
    order: orderType,
  }));
}

export function getPlaces(limit, queryPrefix) {
  return timeoutFetch(buildURL('/places', {
    limit: limit,
    prefix: queryPrefix,
  }));
}

export function getStatisticsGeography(surname, name) {
  return timeoutFetch(buildURL('/stats/geography', {
    surname: surname,
    name: name,
  }));
}

export function getStatisticsTime(surname, name, placeId, eventType) {
  return timeoutFetch(buildURL('/stats/time', {
    surname: surname,
    name: name,
    place: placeId,
    event: eventType,
  }))
    .then(data => data.results ? { // Temporary 'bug' fix in the API
      ...data,
      results: data.results.filter(({ name }) => name !== '1850'),
    } : data);
}
