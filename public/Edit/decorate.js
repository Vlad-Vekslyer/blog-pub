const oneLiners = {
  "header": "##"
}

const multiLiners = {
  "bold": "**",
  "emphasis": "%%"
}

// returns a function that decorates the inputted textarea with the appropriate tags
// the returned function is expected to be used as an event listener callback to a decorator's button
function decorate(textarea, selections = null){
  let decoration = this.name;
  let charList = textarea.value.split('');
  // undefined selection means the decorationg is a one-liner
  manipulate(charList, decoration, selections);
  // creates a new contribution textarea
  let enterEvent = new KeyboardEvent("keydown", {key: "Enter"});
  textarea.dispatchEvent(enterEvent);
  textarea.value = charList.join('');
}

function manipulate(charList, decoration, selections){
  if(!selections) {
    let start = charList.slice(0, 2);
    let oneLinerValues = Object.values(oneLiners);
    if(oneLinerValues.indexOf(start.join('')) !== -1) charList.splice(0, 2, '');
    else charList.splice(0, 0, oneLiners[decoration]);
  }
  else {
    let start = charList.slice(selections.start - 2, selections.start);
    let end = charList.slice(selections.end - 1, selections.end + 1);
    let multiLinerValues = Object.values(multiLiners);
    if(multiLinerValues.indexOf(start.join('')) !== -1 && multiLinerValues.indexOf(end.join('')) !== -1){
      charList.splice(selections.start - 2, 2, '');
      charList.splice(selections.end - 2, 2, '');
    } else {
      charList.splice(selections.start, 0, multiLiners[decoration]);
      charList.splice(selections.end, 0, multiLiners[decoration]);
    }
  }
}

export default decorate;
