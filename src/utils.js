/* Taken from https://dmitripavlutin.com/how-to-compare-objects-in-javascript/ */
export function deepEqual(object1, object2, strict = true) {
  const keys1 = Object.keys(object1), keys2 = Object.keys(object2);

  if (strict && keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key], val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (areObjects && !deepEqual(val1, val2) || !areObjects && val1 !== val2) {
      return false;
    }
  }

  return true;
}

function isObject(object) {
  return object != null && typeof object === 'object';
}