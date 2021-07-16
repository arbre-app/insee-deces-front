import qs from 'qs';
import { API_ENDPOINT } from '../config';

export const EVENT_TYPE_BIRTH = 'birth';
export const EVENT_TYPE_DEATH = 'death';
export const ORDER_TYPE_ASCENDING = 'ascending';
export const ORDER_TYPE_DESCENDING = 'descending';

const FETCH_TIMEOUT = 10_000;

function buildURL(root, parameters) {
  return `${API_ENDPOINT}${root}?${qs.stringify(parameters)}`;
}

function timeoutFetch(url) {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const timer = setTimeout(() => {
      controller.abort();
      reject(new Error('Timeout'));
    }, FETCH_TIMEOUT);

    fetch(url, { signal })
      .then(result => result.json())
      .then(value => {
        clearTimeout(timer);
        if (value.code >= 200 && value.code < 400) {
          resolve(value);
        } else if (value.code === 503) {
          reject(new Error()); // TODO
        } else {
          reject(new Error());
        }
      })
      .catch(reason => {
        clearTimeout(timer);
        reject(reason);
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
  }));
}
