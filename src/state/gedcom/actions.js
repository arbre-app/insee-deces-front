import { readGedcom } from 'read-gedcom';
import { computeIndividualBirthDeathIntervals, cycleOfLifeParameters } from '../../gedcom';

export const LOADING = 'gedcom/LOADING';
export const SUCCESS = 'gedcom/SUCCESS';
export const ERROR = 'gedcom/ERROR';

export const loadGedcomFile = file => async (dispatch, getState) => {
  dispatch({
    type: LOADING,
    filename: file.name,
  });

  const reader = new FileReader();
  reader.onload = e => {
    const buffer = e.target.result;

    let gedcom;
    try {
      gedcom = readGedcom(buffer);
    } catch(e) { // Can't read file
      dispatch({
        type: ERROR,
        error: e,
      });
      return;
    }

    let intervals;
    try {
      intervals = computeIndividualBirthDeathIntervals(gedcom);
    } catch(e) { // Cycle
      dispatch({
        type: ERROR,
        error: e,
      });
      return;
    }

    const ids = Object.keys(intervals);

    const year1970 = 1970;

    // We list all possible candidates, while potentially including false positives
    const candidates = ids.filter(id => {
      const { birth: [birthAfter, birthBefore], death: [deathAfter, deathBefore] } = intervals[id];

      return !(
        (birthBefore !== null && birthBefore < year1970 - cycleOfLifeParameters.maxAge)
        || (deathBefore !== null && deathBefore < year1970)
      );
    });

    // TODO

    dispatch({
      type: SUCCESS,
      gedcom: gedcom,
      data: { gedcom, intervals, candidates },
    });
  };
  reader.readAsArrayBuffer(file);
};
