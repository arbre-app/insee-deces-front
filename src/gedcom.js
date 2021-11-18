import { SelectionIndividualEvent, Tag, toJsDate } from 'read-gedcom';

export class ErrorGedcomCycle extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export const topologicalSortIndividuals = gedcom => {
  const PERMANENT_MARK = true, TEMPORARY_MARK = false;

  const sorted = []; // <-- A sorted array of individuals (children first, parents after)
  const marks = {};
  const nonPermanentlyMarked = new Set();

  gedcom.getIndividualRecord().arraySelect().forEach(individual => nonPermanentlyMarked.add(individual.pointer()[0]));

  const visit = individual => {
    const id = individual.pointer()[0];
    const mark = marks[id];
    if(mark === PERMANENT_MARK) {
      return;
    } else if(mark === TEMPORARY_MARK) {
      throw new ErrorGedcomCycle();
    }
    nonPermanentlyMarked.add(id);
    marks[id] = TEMPORARY_MARK;
    individual.getFamilyAsSpouse().arraySelect()
      .filter(family => [family.getHusband(), family.getWife()].some(ref => marks[ref.value()[0]] === undefined))
      .forEach(family => family.getChild().getIndividualRecord().arraySelect().forEach(child => visit(child)));
    nonPermanentlyMarked.delete(id);
    marks[id] = PERMANENT_MARK;
    sorted.push(id); // <-- Build the sorted array
  };

  while(nonPermanentlyMarked.size > 0) {
    const firstId = nonPermanentlyMarked.values().next().value;
    const individual = gedcom.getIndividualRecord(firstId);
    visit(individual);
  }

  return sorted; // <-- Return the ordering (children first, parents after)
};

// These values are derived from real data (yes)
export const cycleOfLifeParameters = {
  maxAge: 130,
  minFatherAge: 12,
  maxFatherAge: 100,
  minMotherAge: 5,
  maxMotherAge: 75,
  datePlusMinus: 3,
};

export const computeIndividualBirthDeathIntervals = gedcom => {
  const topological = topologicalSortIndividuals(gedcom);

  const intervals = Object.fromEntries(topological.map(id => {
    const individual = gedcom.getIndividualRecord(id);
    const getDatesForTags = tags => individual.get(tags).as(SelectionIndividualEvent).getDate().valueAsDate().filter(d => d !== null)[0];
    const birthDate = getDatesForTags([Tag.Birth, Tag.Baptism]), deathDate = getDatesForTags([Tag.Death, Tag.Cremation, Tag.Burial]);
    const withAddedYears = (date, years) => {
      const newDate = new Date(date.getTime());
      newDate.setFullYear(newDate.getFullYear() + years);
      return newDate;
    };
    const dateToInterval = date => {
      if(!date || !date.hasDate) {
        return [null, null];
      }

      let after = null, before = null;

      if(date.isDatePunctual) {
        const dt = toJsDate(date.date); // Possibly null
        if(date.isDateApproximated) {
          if(dt !== null) {
            after = withAddedYears(dt, -cycleOfLifeParameters.datePlusMinus);
            before = withAddedYears(dt, cycleOfLifeParameters.datePlusMinus);
          }
        } else { // Interpreted (text) or normal
          after = dt; // Beware, same instance
          before = dt;
        }
      } else if(date.isDateRange) {
        // before/after
        // TODO
      } else if(date.isDatePeriod) { // We choose to also interpret date periods
        // from/to
        // TODO
      } // This should be the last case

      return [after, before];
    };
    const birthDateInterval = dateToInterval(birthDate), deathDateInterval = dateToInterval(deathDate);

    // TODO function to refine + correct the intervals
    /*if(birthDateInterval[0] !== null && deathDateInterval[0] === null) {
      deathDateInterval[0] = birthDateInterval[0];
    } else if(deathDateInterval[0] !== null && birthDateInterval[0] === null) {

    }*/


    return [id, { birth: birthDateInterval, death: deathDateInterval }];
  }));

  return intervals;
};
