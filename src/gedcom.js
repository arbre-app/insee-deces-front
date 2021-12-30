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
  maxYear: new Date().getFullYear(), // (beware, this value will change over time -- don't store it)
};

export const computeIndividualBirthDeathIntervals = gedcom => {
  const maxDate = new Date(Date.UTC(cycleOfLifeParameters.maxYear, 12 - 1, 31));

  const topological = topologicalSortIndividuals(gedcom); // (biological) children first, parents after

  const withAddedYears = (date, years) => {
    const newDate = new Date(date.getTime());
    newDate.setUTCFullYear(newDate.getFullYear() + years);
    return newDate;
  };
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
  const isValidDate = d => d instanceof Date && !isNaN(d);

  const intervals = Object.fromEntries(topological.map(id => {
    const individual = gedcom.getIndividualRecord(id);
    const getDatesForTags = tags => individual.get(tags).as(SelectionIndividualEvent).getDate().valueAsDate().filter(d => d !== null)[0];
    const birthDate = getDatesForTags([Tag.Birth, Tag.Baptism]), deathDate = getDatesForTags([Tag.Death, Tag.Cremation, Tag.Burial]);
    const toJsDateUpperBound = (date, jsDate) => {
      if(jsDate !== null) { // This is the hard case
        if(date.day != null) {
          // Nothing to do
        } else if(date.month != null) {
          jsDate.setUTCDate(1);
          jsDate.setUTCMonth(jsDate.getMonth() + 1);
          jsDate.setUTCDate(-1); // Remove one day
          // FIXME this won't work correctly for other calendars!
        } else {
          jsDate.setUTCDate(1);
          jsDate.setUTCMonth(0); // (0 for January)
          jsDate.setUTCFullYear(jsDate.getFullYear() + 1);
          jsDate.setUTCDate(-1); // Remove one day
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
          if(dt !== null) {
            after = dt;
            before = toJsDateUpperBound(date.date, new Date(dt.getTime())); // Clone to avoid issues further on
          }
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
    const maximumAgeConstraints = [BOUND_BEFORE, BOUND_AFTER].map(bound => (
      { x: { id, event: EVENT_DEATH, bound }, y: { id, event: EVENT_BIRTH, bound }, c: cycleOfLifeParameters.maxAge }
    ));
    // Child/parents relations
    const childParentsConstraints = parents.flatMap(({ parentId, gender }) => {
      const valueFor = (fatherValue, motherValue) => {
        return gender === ValueSex.Male ? fatherValue
          : gender === ValueSex.Female ? motherValue
            : Math.max(fatherValue, motherValue); // We take the maximum between the two, that way we are guaranteed to satisfy both branches: a <= max(a, b) and b <= max(a, b)
      };
      return [BOUND_BEFORE, BOUND_AFTER].flatMap(bound => [
        // An individual cannot be a father until a certain age
        { x: { id: parentId, event: EVENT_BIRTH, bound }, y: { id, event: EVENT_BIRTH, bound }, c: valueFor(-cycleOfLifeParameters.minFatherAge, -cycleOfLifeParameters.minMotherAge) },
        // An individual cannot be a father of new children after a certain age
        { x: { id, event: EVENT_BIRTH, bound }, y: { id: parentId, event: EVENT_DEATH, bound }, c: valueFor(cycleOfLifeParameters.maxFatherAge, cycleOfLifeParameters.maxMotherAge) },
        // A man can die before they become a father of a child, a woman can't
        { x: { id, event: EVENT_BIRTH, bound }, y: { id: parentId, event: EVENT_DEATH, bound }, c: valueFor(cycleOfLifeParameters.maxPregnancyDuration, 0) }, // These arguments are in the correct order
      ]);
    });

    // Note that there is an additional constraint in the form `x <= maxYear` that is handled separately (below)
    return [
      eventIsIntervalConstraints,
      birthBeforeDeathConstraints,
      maximumAgeConstraints,
      childParentsConstraints,
    ].flat();
  });

  // The constraint propagation algorithm works as follows:
  // - initially no variable is frozen
  // - repeat these steps until convergence, or timeout

  // The constraint propagation algorithm devised here works in two phases:
  // We start by propagating the known values to the unknowns (nulls), in a BFS fashion and according to the constraints
  // Once all the values have been propagated, any remaining null will stay that way in the final result; so we may completely ignore them
  // The second phase consists of creating a feasible solution
  // The last phase will attempt to optimize the variables assignment

  // Each variable is now assigned a meta interval
  // (the term "meta intervals" is used to distinguish them with the dates intervals)
  // The computed meta intervals will allow us to find a feasible solution to the system, and later optimize it

  const metaData = Object.fromEntries(topological.map(id => {
    const generateEvent = ([after, before]) => {
      const generateMetadata = value => ({ assignment: value, index: [], marked: true });
      return { after: generateMetadata(after), before: generateMetadata(before) };
    };
    const interval = intervals[id];
    return [id, { birth: generateEvent(interval.birth), death: generateEvent(interval.death) }];
  }));

  const getMetaData = ({ id, event, bound }) => {
    const interval = metaData[id];
    const withEvent = event === EVENT_BIRTH ? interval.birth : interval.death;
    return bound === BOUND_AFTER ? withEvent.after : withEvent.before;
  };

  const queue = topological.flatMap(id => [EVENT_BIRTH, EVENT_DEATH].flatMap(event => [BOUND_AFTER, BOUND_BEFORE].map(bound => ({ id, event, bound }))));

  const isSameIds = ({ id: id1, event: event1, bound: bound1 }, { id: id2, event: event2, bound: bound2 }) => id1 === id2 && event1 === event2 && bound1 === bound2;

  constraints.forEach(constraint => {
    const { x, y } = constraint;
    [x, y].forEach(idVector => {
      const { index } = getMetaData(idVector);
      if(!index.some(other => isSameIds(other, idVector))) { // Caution, might be slow
        index.push(constraint);
      }
    });
  });

  let inconsistent = false;
  let i = 0;
  const maxIterations = 1000000; // TODO
  while(queue.length > 0 && i < maxIterations && !inconsistent) {
    const variable = queue.pop();

    const variableMetaData = getMetaData(variable);
    variableMetaData.marked = false;

    // That person is known to have been alive, so their birth cannot occur in the future
    if(variable.event === EVENT_BIRTH) {
      if(variable.bound === BOUND_AFTER && variableMetaData.assignment !== null && compareDates(variableMetaData.assignment, maxDate) > 0) {
        inconsistent = true;
      } else if(variable.bound === BOUND_BEFORE && (variableMetaData.assignment === null || compareDates(variableMetaData.assignment, maxDate) > 0)) {
        variableMetaData.assignment = maxDate;
        // Invariant: `!marked`
        variableMetaData.marked = true;
        queue.push(variable);
      }
    }

    variableMetaData.index.forEach(({ x, y, c }) => { // x - y <= c
      const metaX = getMetaData(x), metaY = getMetaData(y);
      const isInequalityViolated = metaX.assignment !== null && metaY.assignment !== null && compareDates(metaX.assignment, withAddedYears(metaY.assignment, c)) > 0;
      let updated = null;
      if(isSameIds(x, y) && c < 0) { // Edge case: z - z <= c  <=>  c >= 0
        inconsistent = true;
      } else if(x.bound === BOUND_AFTER && y.bound === BOUND_BEFORE) {
        if(metaX.assignment !== null && metaY.assignment !== null && isInequalityViolated) { // General inconsistency
          inconsistent = true;
        }
      } else if(x.bound === BOUND_AFTER && y.bound === BOUND_AFTER) {
        if(metaX.assignment !== null && (metaY.assignment === null || isInequalityViolated)) { // y := x - c
          metaY.assignment = withAddedYears(metaX.assignment, -c);
          updated = y;
        }
      } else if(x.bound === BOUND_BEFORE && y.bound === BOUND_AFTER) {
        if(isInequalityViolated) { // x := y + c
          metaX.assignment = withAddedYears(metaY.assignment, c);
          updated = x;
        }
      } else if(x.bound === BOUND_BEFORE && y.bound === BOUND_BEFORE) {
        if(metaY.assignment !== null) {
          if(metaX.assignment === null || isInequalityViolated) { // x := y + c
            metaX.assignment = withAddedYears(metaY.assignment, c);
            updated = x;
          }
        }
      }

      if(updated !== null) {
        const meta = getMetaData(updated);
        if(!meta.marked) {
          queue.push(updated);
          meta.marked = true;
        }
      }

      // If inequality is not satisfied
      /*
      if(x.bound === y.bound) { // An update might take place
          if(x.bound === BOUND_AFTER && metaX.assignment !== null) { // Update y: y >= x - c
            metaY.assignment = withAddedYears(metaX.assignment, -c);
            updated = x;
          } else if(x.bound === BOUND_BEFORE) { // Update x: x <= y + c
            // In any case, y != null
            metaX.assignment = withAddedYears(metaY.assignment, c);
            updated = x;
          }

          if(updated !== null) {
            const meta = getMetaData(updated);
            if(!meta.marked) {
              queue.push(updated);
              meta.marked = true;
            }
          }
        } else {
          inconsistent = true;
        }
       */


      // Else, nothing to do
    });

    i++;
  }

  //console.log(getMetaData({ id: '@I0000@', event: EVENT_DEATH, bound: BOUND_BEFORE }));

  const hasFinishedGracefully = !queue.length && !inconsistent;

  if(!hasFinishedGracefully) {
    throw new Error(inconsistent ? 'Inconsistent' : 'Did not converge');
  }

  const result = Object.fromEntries(topological.map(id => {
    const getEvent = event => {
      const getBound = bound => {
        const meta = getMetaData({ id, event, bound });
        //const metaBound = bound === BOUND_AFTER ? 0 : 1;
        // v-- this is probably wrong
        //if(meta.interval[metaBound] !== null)
        //  meta.interval[1 - metaBound] = meta.interval[metaBound];
        return meta.assignment;
      };
      return [getBound(BOUND_AFTER), getBound(BOUND_BEFORE)];
    };
    return [id, { birth: getEvent(EVENT_BIRTH), death: getEvent(EVENT_DEATH) }];
  }));

  console.log(result);

  return result;
};
