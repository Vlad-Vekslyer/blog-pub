const oneLiners = {
  "header": "##"
}

const multiLiners = {
  "bold": "**",
  "emphasis": "%%"
}

function decorateSingle(textarea){
  return function(){
    let decoration = this.name;
    let charList = textarea.value.split('');
    charList.splice(0, 0, oneLiners[decoration]);
    textarea.value = charList.join('');
    let enterEvent = new KeyboardEvent("keydown", {key: "Enter"});
    textarea.dispatchEvent(enterEvent);
  }
}

function decorateMulti(textarea, selections){
  let charList = textarea.value.split('');
  charList.splice(selections.start, 0, "%%");
  charList.splice(selections.end, 0, "%%");
  textarea.value = charList.join('');
}

export {decorateSingle};
