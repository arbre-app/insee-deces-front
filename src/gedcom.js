import { SelectionIndividualEvent, SelectionIndividualReference, Tag, toJsDate, ValueSex } from 'read-gedcom';

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
  maxPregnancyDuration: 2,
  datePlusMinus: 3,
};

export const computeIndividualBirthDeathIntervals = gedcom => {
  const topological = topologicalSortIndividuals(gedcom); // (biological) children first, parents after

  const intervals = Object.fromEntries(topological.map(id => {
    const individual = gedcom.getIndividualRecord(id);
    const getDatesForTags = tags => individual.get(tags).as(SelectionIndividualEvent).getDate().valueAsDate().filter(d => d !== null)[0];
    const birthDate = getDatesForTags([Tag.Birth, Tag.Baptism]), deathDate = getDatesForTags([Tag.Death, Tag.Cremation, Tag.Burial]);
    const withAddedYears = (date, years) => {
      const newDate = new Date(date.getTime());
      newDate.setFullYear(newDate.getFullYear() + years);
      return newDate;
    };
    const toJsDateUpperBound = (date, jsDate) => {
      if(jsDate !== null) { // This is the hard case
        if(date.day != null) {
          // Nothing to do
        } else if(date.month != null) {
          jsDate.setDate(1);
          jsDate.setMonth(jsDate.getMonth() + 1);
          jsDate.setDate(-1); // Remove one day
          // FIXME this won't work correctly for other calendars!
        } else {
          jsDate.setDate(1);
          jsDate.setMonth(0); // (0 for January)
          jsDate.setFullYear(jsDate.getFullYear() + 1);
          jsDate.setDate(-1); // Remove one day
          // FIXME similar problem
        }
      }
      return jsDate;
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
            before = withAddedYears(toJsDateUpperBound(date.date, new Date(dt.getTime())), cycleOfLifeParameters.datePlusMinus);
          }
        } else { // Interpreted (text) or normal
          after = dt;
          before = toJsDateUpperBound(date.date, new Date(date.date, dt.getTime())); // Clone to avoid issues further on
        }
      } else if(date.isDateRange) {
        if(date.dateAfter != null) {
          after = toJsDate(date.dateAfter);
        }
        if(date.dateBefore != null) {
          before = toJsDateUpperBound(date.dateBefore, toJsDate(date.dateBefore));
        }
      } else if(date.isDatePeriod) { // We choose to also interpret date periods
        if(date.dateFrom != null) {
          after = toJsDate(date.dateFrom);
        }
        if(date.dateTo != null) {
          before = toJsDateUpperBound(date.dateTo, toJsDate(date.dateTo));
        }
      } // This should be the last case

      return [after, before];
    };
    const birthDateInterval = dateToInterval(birthDate), deathDateInterval = dateToInterval(deathDate);

    const compareDates = (date1, date2) => {
      if(date1.getFullYear() < date2.getFullYear()) {
        return -1;
      } else if(date1.getFullYear() > date2.getFullYear()) {
        return 1;
      } else {
        if(date1.getMonth() < date2.getMonth()) {
          return -1;
        } else if(date1.getMonth() > date2.getMonth()) {
          return 1;
        } else {
          if(date1.getDate() < date2.getDate()) {
            return -1;
          } else if(date1.getDate() > date2.getDate()) {
            return 1;
          } else {
            return 0;
          }
        }
      }
    };

    return [id, { birth: birthDateInterval, death: deathDateInterval }];
  }));

  const EVENT_BIRTH = "birth", EVENT_DEATH = "death"; // TODO replace by booleans
  const BOUND_AFTER = "after", BOUND_BEFORE = "before";

  // Constraints are all of the form: { x, y, c }
  // Representing the mathematical inequality: x - y <= c
  // With x, y identifiers of the form: { id, event, bound }
  // And c a constant number (equal to 0 most of the time)
  const constraints = topological.flatMap(id => {
    // [{ id, gender }]
    const parents = gedcom.getIndividualRecord(id).getFamilyAsChild().get([Tag.Husband, Tag.Wife]).as(SelectionIndividualReference).getIndividualRecord().arraySelect().map(record => ({
      parentId: record.pointer()[0],
      gender: record.getSex().value()[0],
    }));

    // An event must be an interval
    const eventIsIntervalConstraints = [EVENT_BIRTH, EVENT_DEATH].map(event => (
      { x: { id, event, bound: BOUND_AFTER }, y: { id, event, bound: BOUND_BEFORE }, c: 0 }
    ));
    // Birth must occur before death
    const birthBeforeDeathConstraints = [BOUND_AFTER, BOUND_BEFORE].map(bound => (
      { x: { id, event: EVENT_BIRTH, bound }, y: { id, event: EVENT_DEATH, bound }, c: 0 }
    ));
    // An individual cannot live older than a certain age
    const maximumAgeConstraints = [
      { x: { id, event: EVENT_DEATH, bound: BOUND_BEFORE }, y: { id, event: EVENT_BIRTH, bound: BOUND_BEFORE }, c: cycleOfLifeParameters.maxAge }
    ];
    // Child/parents relations
    const childParentsConstraints = parents.map(({ parentId, gender }) => {
      const valueFor = (fatherValue, motherValue) => {
        return gender === ValueSex.Male ? fatherValue
          : gender === ValueSex.Female ? motherValue
            : Math.max(fatherValue, motherValue); // We take the maximum between the two, that way we are guaranteed to satisfy both branches: a <= max(a, b) and b <= max(a, b)
      };
      return [
        // An individual cannot be a father until a certain age
        { x: { id: parentId, event: EVENT_BIRTH, bound: BOUND_AFTER }, y: { id, event: EVENT_BIRTH, bound: BOUND_AFTER }, c: valueFor(-cycleOfLifeParameters.minFatherAge, -cycleOfLifeParameters.minMotherAge) },
        // An individual cannot be a father of new children after a certain age
        { x: { id, event: EVENT_BIRTH, bound: BOUND_BEFORE }, y: { id: parentId, event: EVENT_DEATH, bound: BOUND_BEFORE }, c: valueFor(cycleOfLifeParameters.maxFatherAge, cycleOfLifeParameters.maxMotherAge) },
        // A man can die before they become a father of a child, a woman can't
        { x: { id, event: EVENT_BIRTH, bound: BOUND_BEFORE }, y: { id: parentId, event: EVENT_DEATH, bound: BOUND_BEFORE }, c: valueFor(cycleOfLifeParameters.maxPregnancyDuration, 0) }, // These arguments are in the correct order
      ];
    });

    return [
      eventIsIntervalConstraints,
      birthBeforeDeathConstraints,
      maximumAgeConstraints,
      childParentsConstraints,
    ].flat();
  });

  return intervals;
};
