
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

function pbcopy(data) {
  const proc = require("child_process").spawn("pbcopy");
  proc.stdin.write(data);
  proc.stdin.end();
}

function applyNewLogMethod(method) {
  return function(name) {
    if (arguments.length > 1) {
      for (let i = 1; i < arguments.length; i++) {
        console[method](
          '%c *** ' + name,
          'color: orange; font-weight: bold; font-size: 18px',
          arguments[i]
        )
      }
    } else {
      console[method](
        '%c *** ' + name,
        'color: orange; font-weight: bold; font-size: 18px'
      )
    }
  }
}

console.logg = (name, value) =>  console.log(
  '%c *** ' + name,
  'color: orange; font-weight: bold; font-size: 18px',
  value
)
