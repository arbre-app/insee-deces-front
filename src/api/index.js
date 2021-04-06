import qs from 'qs';

export const ENDPOINT = 'https://insee.arbre.app';

export const EVENT_TYPE_BIRTH = 'birth';
export const EVENT_TYPE_DEATH = 'death';
export const ORDER_TYPE_ASCENDING = 'ascending';
export const ORDER_TYPE_DESCENDING = 'descending';

function buildURL(root, parameters) {
  return `${ENDPOINT}${root}?${qs.stringify(parameters)}`;
}

export function getPersons(offset, limit, surname, name, placeId, eventType, afterYear, beforeYear, orderType) {
  return fetch(buildURL('/persons', {
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
  return fetch(buildURL('/places', {
    limit: limit,
    prefix: queryPrefix,
  }));
}

export function getStatisticsGeography(surname, name) {
  return fetch(buildURL('/stats/geography', {
    surname: surname,
    name: name,
  }));
}

export function getStatisticsTime(surname, name, placeId, eventType) {
  return fetch(buildURL('/stats/time', {
    surname: surname,
    name: name,
    place: placeId,
    event: eventType,
  }));
}
