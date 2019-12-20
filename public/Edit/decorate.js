const oneLiners = {
  "header": "##"
}

const multiLiners = {
  "bold": "**",
  "emphasis": "%%"
}

// returns a string decorated with tags
// @selections are the indexes of a selected portion of text in the contribution(if any are selected)
function decorate(contribution, selections){
  // what tags to decorate with depends on the button that was clicked to call this function
  let decoration = this.name;
  let charList = contribution.split('');
  manipulate(charList, decoration, selections);
  return charList.join('');
}

// Removes or adds tags from/to the charList
function manipulate(charList, decoration, selections){
  // undefined selection means the decoration is a one-liner
  if(!selections) {
    let start = charList.slice(0, 2);
    let oneLinerValues = Object.values(oneLiners);
    // if a oneliner already exists, remove it
    if(oneLinerValues.indexOf(start.join('')) !== -1) charList.splice(0, 2, '');
    // otherwise, add it to the charList
    else charList.splice(0, 0, oneLiners[decoration]);
  }
  else {
    let start = charList.slice(selections.start - 2, selections.start);
    let end = charList.slice(selections.end, selections.end + 2);
    // if the same multliner already exists between the selected tags, remove it
    if(multiLiners[decoration] === start.join('') && multiLiners[decoration] === end.join('')){
      charList.splice(selections.start - 2, 2, '');
      charList.splice(selections.end - 1, 2, '');
    } else {
      charList.splice(selections.start, 0, multiLiners[decoration]);
      charList.splice(selections.end + 1, 0, multiLiners[decoration]);
    }
  }
}


function processText(decoratedCont){
  let body = {
    contributions : [decoratedCont]
  }
  body = JSON.stringify(body);
  return fetch("/edit/process", {
    method: 'POST',
    mode: "same-origin",
    body: body,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(res => {
    return res.contributions[0];
  })
  .catch(error => console.error("Fetch error:" + error.message))

}

// initialize the decoration event listeners
function initDecorator(){
  let buttons = document.getElementById('decorator').children;
  for(let i = 0; i < buttons.length; i++){
    buttons[i].addEventListener("click", function() {
      let selectedCont = document.getElementsByClassName("selected")[0];
      let selectedContName = selectedCont.attributes.getNamedItem('name').nodeValue;
      let input = document.querySelector(`input[name="${selectedContName}"]`);
      let selections, oneLinerKeys = Object.keys(oneLiners);
      // if clicked on a one-liner decoratorion, selections is null
      if (oneLinerKeys.indexOf(this.name) !== -1) selections = null;
      else selections = {start: window.getSelection().getRangeAt(0).startOffset, end: window.getSelection().getRangeAt(0).endOffset};
      // pass in the current this to allow the decorate function to know which button was clicked
      let decoratedCont = decorate.call(this, input.value, selections);
      // fire an enter event to create a new textarea if a one-liner was added
      if(decoratedCont.length > selectedCont.innerText.length && !selections) {
          let enterEvent = new KeyboardEvent("keydown", {key: "Enter"});
          selectedCont.dispatchEvent(enterEvent);
      }
      input.value = decoratedCont;
      processText(decoratedCont).then(processedCont => selectedCont.innerHTML = processedCont);
    });
  }
}

export default initDecorator;
