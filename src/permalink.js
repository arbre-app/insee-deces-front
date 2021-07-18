import { parse, stringify, stringifyUrl } from 'query-string';
import {
  DEFAULT_EVENT_TYPE,
  DEFAULT_ORDER_TYPE,
  EVENT_TYPE_BIRTH,
  EVENT_TYPE_DEATH,
  ORDER_TYPE_ASCENDING, ORDER_TYPE_DESCENDING,
} from './api';
import { DEFAULT_RESULTS_PER_PAGE, FRONTEND_URL, RESULTS_PER_PAGE } from './config';
import {
  DEFAULT_RANGE,
  DEFAULT_YEAR_PLUS_MINUS,
  RANGE_ABOUT,
  RANGE_AFTER,
  RANGE_BEFORE,
  RANGE_BETWEEN,
  RANGE_EXACT,
} from './form/DateRangeGroup';

const P_TAB = 't', P_SURNAME = 's', P_NAME = 'n', P_PLACE = 'p', P_EVENT = 'e', P_AFTER = 'a', P_BEFORE = 'b', P_EXACT = 'y', P_ABOUT = 'c', P_ORDER = 'o', P_PAGE = 'k', P_LIMIT = 'l';
const V_TAB_RESULTS = 'r', V_TAB_STATS = 's', V_BIRTH = 'b', V_DEATH = 'd', V_ASCEND = 'a', V_DESCEND = 'd';

function extractHashParameters() {
  return parse(window.location.hash);
}

export function generatePermalink(data, isStatsTab) {
  const parameters = [];

  if(isStatsTab) {
    parameters.push([P_TAB, V_TAB_STATS]);
  }
  parameters.push([P_SURNAME, data.surname]); // Surname is mandatory anyway
  if(data.givenName) {
    parameters.push([P_NAME, data.givenName]);
  }
  if(data.place.length > 0) {
    parameters.push([P_PLACE, data.place[0].fullname]);
  }

  // The idea here is to be able to restore the correct selections, if the fields are nonempty
  const advancedParameters = [];
  let hasDate = false;
  if((data.rangeType === RANGE_EXACT || data.rangeType === RANGE_ABOUT) && data.year !== undefined) {
    advancedParameters.push([P_EXACT, data.year]);
    if(data.rangeType === RANGE_ABOUT) { // This parameter should appear even if empty
      advancedParameters.push([P_ABOUT, data.yearPlusMinus || '']);
    }
    hasDate = true;
  } else {
    if(data.rangeType === RANGE_BETWEEN && (data.yearAfter !== undefined || data.yearBefore !== undefined)) {
      advancedParameters.push([P_AFTER, data.yearAfter || '']);
      advancedParameters.push([P_BEFORE, data.yearBefore || '']);
      hasDate = true;
    } else if(data.rangeType === RANGE_AFTER && data.year !== undefined) {
      advancedParameters.push([P_AFTER, data.year]);
      hasDate = true;
    } else if(data.rangeType === RANGE_BEFORE && data.year !== undefined) {
      advancedParameters.push([P_AFTER, data.year]);
      hasDate = true;
    }
  }
  if(hasDate || data.sortBy !== DEFAULT_EVENT_TYPE || data.sortOrder !== DEFAULT_ORDER_TYPE) {
    const transformSortBy = sortBy => {
      if(sortBy === EVENT_TYPE_BIRTH) {
        return V_BIRTH;
      } else if(sortBy === EVENT_TYPE_DEATH) {
        return V_DEATH;
      } else {
        throw new Error();
      }
    };
    const transformSortOrder = sortOrder => {
      if(sortOrder === ORDER_TYPE_ASCENDING) {
        return V_ASCEND;
      } else if(sortOrder === ORDER_TYPE_DESCENDING) {
        return V_DESCEND;
      } else {
        throw new Error();
      }
    };
    advancedParameters.unshift([P_EVENT, transformSortBy(data.sortBy)]); // This should come at the beginning, to match the form layout
    advancedParameters.push([P_ORDER, transformSortOrder(data.sortOrder)]);
  }
  parameters.push(...advancedParameters);

  if(data.currentPage !== 1 || data.resultsPerPage !== DEFAULT_RESULTS_PER_PAGE) {
    parameters.push([P_PAGE, data.currentPage]);
    parameters.push([P_LIMIT, data.resultsPerPage]);
  }

  return stringifyUrl({
    url: FRONTEND_URL,
    fragmentIdentifier: stringify(Object.fromEntries(parameters), {
      sort: false,
    }),
  }, {
    encode: false,
  });
}

export function extractAndParsePermalink() {
  const parameters = extractHashParameters();
  if(Object.keys(parameters).length === 0) {
    return null;
  }

  history.pushState('', document.title, window.location.pathname + window.location.search); // Remove hash from URL

  function get(k) {
    return parameters[k];
  }

  const tab = get(P_TAB), placeFullname = get(P_PLACE), event = get(P_EVENT), order = get(P_ORDER);

  // Invalid values are simply ignored and the state falls back to default

  function asNumber(s) {
    return /(-?[0-9]+)?/.test(s) ? s : undefined;
  }

  function isNonEmpty(s) {
    return s !== undefined && s.length > 0;
  }

  const currentPage = asNumber(get(P_PAGE)), resultsPerPage = asNumber(get(P_LIMIT));
  const hasPageInformation = isNonEmpty(currentPage) && isNonEmpty(resultsPerPage) && parseInt(currentPage) >= 1 && RESULTS_PER_PAGE.includes(parseInt(resultsPerPage));

  const year = asNumber(get(P_EXACT));
  const yearAfter = asNumber(get(P_AFTER));
  const yearBefore = asNumber(get(P_BEFORE));
  const yearPlusMinus = asNumber(get(P_ABOUT));

  let rangeType;
  if(year !== undefined) {
    if(yearPlusMinus !== undefined) {
      rangeType = RANGE_ABOUT;
    } else {
      rangeType = RANGE_EXACT;
    }
  } else if(yearAfter !== undefined) {
    if(yearBefore !== undefined) {
      rangeType = RANGE_BETWEEN;
    } else {
      rangeType = RANGE_AFTER;
    }
  } else if(yearBefore !== undefined) {
    rangeType = RANGE_BEFORE;
  } else {
    rangeType = DEFAULT_RANGE;
  }

  return [{
    surname: get(P_SURNAME),
    givenName: get(P_NAME),
    place: placeFullname ? [{ fullname: placeFullname }] : [], // TODO
    sortBy: event === V_BIRTH ? EVENT_TYPE_BIRTH : event === V_DEATH ? EVENT_TYPE_DEATH : DEFAULT_EVENT_TYPE,
    rangeType: rangeType,
    year: (rangeType === RANGE_EXACT || rangeType === RANGE_ABOUT) && isNonEmpty(year) ? year : (rangeType === RANGE_AFTER && isNonEmpty(yearAfter) ? yearAfter : (rangeType === RANGE_BEFORE && isNonEmpty(yearBefore) ? yearBefore : undefined)),
    yearAfter: rangeType === RANGE_BETWEEN && isNonEmpty(yearAfter) ? yearAfter : undefined,
    yearBefore: rangeType === RANGE_BETWEEN && isNonEmpty(yearBefore) ? yearBefore : undefined,
    yearPlusMinus: isNonEmpty(yearPlusMinus) ? yearPlusMinus : String(DEFAULT_YEAR_PLUS_MINUS),
    sortOrder: order === V_ASCEND ? ORDER_TYPE_ASCENDING : order === V_DESCEND ? ORDER_TYPE_DESCENDING : DEFAULT_ORDER_TYPE,
    currentPage: hasPageInformation ? parseInt(currentPage) : 1,
    resultsPerPage: hasPageInformation ? parseInt(resultsPerPage) : DEFAULT_RESULTS_PER_PAGE,
  }, tab === V_TAB_STATS];
}
