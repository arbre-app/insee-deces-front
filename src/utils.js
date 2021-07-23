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

// (c) Tim Down & community (CC BY-SA 2.5)
// https://stackoverflow.com/a/2838358
export function selectElementText(element, win = window) {
  const doc = win.document;
  let sel, range;
  if (win.getSelection && doc.createRange) {
    sel = win.getSelection();
    range = doc.createRange();
    range.selectNodeContents(element);
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (doc.body.createTextRange) {
    range = doc.body.createTextRange();
    range.moveToElementText(element);
    range.select();
  }
}

export const NS = 'http://www.w3.org/2000/svg';

export const createSVGElement = (tag, attributes = {}) => {
  const element = document.createElementNS(NS, tag);
  Object.entries(attributes).forEach(([key, value]) => element.setAttributeNS(null, key, value));
  return element;
};

export const removeAccents = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
export const tokenizeText = text => {
  const r = /([^a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+)/g;
  return text.split(r);
};
export const normalizeTextToken = token => {
  return removeAccents(token).toLowerCase();
};
export const tokenizeAndNormalizeText = text => tokenizeText(text).filter((_, i) => i % 2 === 0).map(normalizeTextToken).filter(s => s);
