function listAllProperties(o) {
  let objectToInspect;
  let result = [];
  
  for (objectToInspect = o; objectToInspect !== null;
       objectToInspect = Object.getPrototypeOf(objectToInspect)) {
    result = result.concat(
      Object.getOwnPropertyNames(objectToInspect),
    );
  }
  
  return result;
}
