const oneLiners = {
  "header": "##"
}

const multiLiners = {
  "bold": "**",
  "emphasis": "%%"
}

// returns a function that decorates the inputted textarea with the appropriate tags
// the returned function is expected to be used as an event listener callback to a decorator's button
function decorate(textarea, selections){
  return function(){
    let decoration = this.name;
    let charList = textarea.value.split('');
    // undefined selection means the decorationg is a one-liner
    if(!selections) {
      charList.splice(0, 0, oneLiners[decoration]);
      // creates a new contribution textarea
      let enterEvent = new KeyboardEvent("keydown", {key: "Enter"});
      textarea.dispatchEvent(enterEvent);
    } else {
      charList.splice(selections.start, 0, multiLiners[decoration]);
      charList.splice(selections.end, 0, multiLiners[decoration]);
    }
    textarea.value = charList.join('');
  }
}

export default decorate;
