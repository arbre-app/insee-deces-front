import { getPersons } from '../api';
import { RANGE_ABOUT, RANGE_AFTER, RANGE_BEFORE, RANGE_BETWEEN, RANGE_EXACT } from './DateRangeGroup';

export { ClearButton } from './ClearButton';
export { DateRangeGroup } from './DateRangeGroup';
export { GivenNameInput } from './GivenNameInput';
export { ResultsPerPageSelect } from './ResultsPerPageSelect';
export { SearchButton } from './SearchButton';
export { SearchPlaceInput } from './SearchPlaceInput';
export { SurnameInput } from './SurnameInput';
export { SortBySelect } from './SortBySelect';
export { SortOrderSelect } from './SortOrderSelect';

export const extractPeriodFromData = data => {
  let yearAfter = undefined, yearBefore = undefined;
  if(data.rangeType === RANGE_BETWEEN) {
    yearAfter = data.yearAfter;
    yearBefore = data.yearBefore;
  } else if(data.rangeType === RANGE_AFTER) {
    yearAfter = data.year;
  } else if(data.rangeType === RANGE_BEFORE) {
    yearBefore = data.year;
  } else if(data.rangeType === RANGE_EXACT) {
    yearAfter = data.year;
    yearBefore = data.year;
  } else if(data.rangeType === RANGE_ABOUT) {
    const pm = parseInt(data.yearPlusMinus || 5);
    if(data.year) {
      const year = parseInt(data.year);
      yearAfter = (year - pm).toString();
      yearBefore = (year + pm).toString();
    }
  } else {
    throw new Error(data.rangeType);
  }

  return [yearAfter, yearBefore];
};

export const getPersonsFromFormData = data => {
  const [yearAfter, yearBefore] = extractPeriodFromData(data);
  return getPersons(
    (data.currentPage - 1) * data.resultsPerPage,
    data.resultsPerPage,
    data.surname,
    data.givenName || undefined,
    data.place.length ? data.place[0].id : undefined,
    data.sortBy,
    yearAfter,
    yearBefore,
    data.sortOrder,
  );
};
