
export const Hoc = props => props.children;

export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties
  };
};

export const apiUrlCreator = function(url) {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8080' + url
  }
  return url
}

export const staticAssetUrlCreator = function(url) {
  if (process.env.NODE_ENV === 'development') {
    return process.env.PUBLIC_URL + url
  }
  return window.location.origin + "/media" + url
}

export const sortFunctionCreator = (compareFunction) => {
  // Array.prototype.sort requires functions to return 1,0 or -1
  // This function normalizes a fucntion that returns true/false to do that.
  return (x,y) => {
    if (x === y) {
      return 0
    }
    return compareFunction(x,y) ? 1 : -1
  }
}
