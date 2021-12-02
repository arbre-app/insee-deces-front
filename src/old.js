const intervalsIntersection = ([i1After, i1Before], [i2After, i2Before]) => {
  const max = (a, b) => {
    if(a !== null && b !== null) {
      return compareDates(a, b) >= 0 ? a : b;
    } else if(a !== null) {
      return a;
    } else {
      return b;
    }
  };
  const min = (a, b) => {
    if(a !== null && b !== null) {
      return compareDates(a, b) <= 0 ? a : b;
    } else if(a !== null) {
      return a;
    } else {
      return b;
    }
  };
  const before = max(i1After, i2After), after = min(i1Before, i2Before);
  if(before !== null && after !== null && compareDates(before, after) > 0) { // Intervals are disjoint
    return null;
  } else {
    return [before, after];
  }
};