import {oneLiners, multiLiners, allTagsMap, allTags} from "./tags.js";

// returns a string decorated with tags
// @selections are the indexes of a selected portion of text in the contribution(if any are selected)
function decorate(formInput, paragraphInput, selections){
  // what tags to decorate with depends on the button that was clicked to call this function
  let decoration = this.name;
  let occurrence = getOccurrence(paragraphInput, selections);
  selections = getSelection(occurrence, formInput, window.getSelection().toString(), decoration);
  let charList = formInput.split('');
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

function getSelection(occurrences, str, substr){
  let reduced = allTags.reduce((accumulator, currentValue) => accumulator + currentValue.charAt(0), '');
  let patt = '';
  for(let i = 0; i < substr.length; i++){
    if (i != substr.length - 1) patt = patt + `${substr.charAt(i)}[${reduced}]*`;
    else patt = patt + substr.charAt(i);
  }
  let subRegex = new RegExp(patt, 'g');
  let count = 0, index, length;
  while(count !== occurrences){
    let search = subRegex.exec(str);
    if(!search) throw "Provided an incorrect number of occurrences";
    index = search.index;
    length = search[0].length
    count++;
  }
  return {start: index, end: index + length};
}

// returns the occurence of the selected substring inside of str
function getOccurrence(str, selections){
  let selectionRegex = new RegExp(window.getSelection().toString(), 'g');
  let count = 0, index;
  while(index !== selections.start){
    let search = selectionRegex.exec(str);
    if(search) {
      index = search.index;
      count++;
    }
    else break;
  }
  return count;
}

// returns the index coordinates of the selected text in relation to the entire contribution
function computeDOMSelection(selection){
  let start, end;
  if(selection.anchorNode.isSameNode(selection.focusNode)){
    let startIndex = selection.anchorNode.startIndex;
    let offsets = [selection.anchorOffset, selection.focusOffset]
    start = startIndex + Math.min(...offsets);
    end = startIndex + Math.max(...offsets);
  } else {
    // node with lowest startIndex is the leftmost one
    let leftNode = selection.anchorNode.startIndex < selection.focusNode.startIndex ? selection.anchorNode : selection.focusNode;
    let rightNode = selection.anchorNode.startIndex < selection.focusNode.startIndex ? selection.focusNode : selection.anchorNode;
    let leftOffset = leftNode.isSameNode(selection.anchorNode) ? selection.anchorOffset : selection.focusOffset;
    let rightOffset = rightNode.isSameNode(selection.focusNode) ? selection.focusOffset : selection.anchorOffset;
    start = leftNode.startIndex + leftOffset;
    end = rightNode.startIndex + rightOffset;
  }
  return {start, end};
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
      else selections = computeDOMSelection(window.getSelection());
      // pass in the current this to allow the decorate function to know which button was clicked
      let decoratedCont = decorate.call(this, input.value, selectedCont.textContent, selections);
      // fire an enter event to create a new textarea if a one-liner was added
      if(decoratedCont.length > input.value.length && !selections) {
          let enterEvent = new KeyboardEvent("keydown", {key: "Enter"});
          selectedCont.dispatchEvent(enterEvent);
      }
      input.value = decoratedCont;
      processText(decoratedCont).then(processedCont => {
        selectedCont.innerHTML = processedCont;
        selectedCont.dispatchEvent(new KeyboardEvent("keyup"))
      });
    });
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

export default initDecorator;
