const selectors = {
  "button": 'button[type="submit"]',
  "textarea": 'textarea[name="contribution"]'
}

function selectElements(...elementNames){
  let elements = {};
  elementNames.forEach(name => elements[name] = document.querySelector(selectors[name]));
  return elements;
}

export {selectElements}
