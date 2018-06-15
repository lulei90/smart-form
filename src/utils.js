function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
function isFun(fun) {
  return typeof fun === 'function';
}

function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
function getValid(obj) {
  for (let key in obj) {
    const value = obj[key];
    if (value === void 0 || value === null || value === '') {
      delete obj[key];
    }
  }
  return obj;
}

export { getDisplayName, isFun, compose, getValid };
