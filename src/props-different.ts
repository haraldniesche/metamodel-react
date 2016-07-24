

export function propsDifferent(a:any, b:any) {
  if (Array.isArray(a)) {
    if (arraysDifferent(a, b)) {
      return true;
    }
  }
  return objectsDifferent(a,b);
}

export function objectsDifferent(a:any, b:any) {
  if (a === b) return false;
  if ((null == a) != (null == b)) return true;

  let keysA = Object.keys(a);
  let keysB = Object.keys(b);

  if (arraysDifferent(keysA, keysB)) return true;

  for (let k of keysA) {
    if (a[k] != b[k]) {
      let thisA = a[k];
      let thisB = b[k];
      if (Array.isArray(thisA)) {
        if (arraysDifferent(thisA, thisB)) {
          return true;
        }
      } else if (null != thisA && typeof thisA === 'object') {
        if (objectsDifferent(thisA, thisB)) {
          return true;
        }
      } else {
        return true;
      }
    }
  }

  return false;
}

export function arraysDifferent<T>(a:T[], b:T[]) {
  if (a === b) return false;
  if ((null == a) != (null == b)) return true;
  if (a.length !== b.length) return true;

  for (var i = 0, n = a.length; i < n; ++i) {
    if (objectsDifferent(a[i], b[i])) {
      return true;
    } 
  }
  return false;
}

