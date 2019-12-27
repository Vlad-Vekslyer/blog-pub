import {oneLiners, multiLiners, allTags} from "/scripts/tags.js";
import {computeDOMSelection} from "/scripts/DOMHelper";
import {occurrenceOf} from "/scripts/StringHelper";
import {processText} from "./process.js";

// returns a string decorated with tags
function decorate(formInput, paragraphInput){
  // what tags to decorate with depends on the button that was clicked to call this function
  let decoration = this.name;
  if(Object.keys(oneLiners).indexOf(decoration) === -1){
    let paragraphSelections = computeDOMSelection(window.getSelection());
    let action = getAction(paragraphSelections);
    let occurrence = occurrenceOf(paragraphInput, paragraphSelections);
    let selections = getSelection(occurrence, formInput, window.getSelection().toString());
    let pairs = getUnpairedTags(formInput, selections, multiLiners[decoration]);
    formInput = clean(formInput, selections);
    selections = getSelection(occurrence, formInput, window.getSelection().toString());
    return manipulateMultiLiner(formInput, decoration, action, selections, pairs);
  }
  return manipulateOneLiner(formInput, decoration);
}

function manipulateOneLiner(str, decoration){
  let charList = str.split('');
  let start = charList.slice(0, 2);
  let oneLinerValues = Object.values(oneLiners);
  // if a oneliner already exists, remove it
  if(oneLinerValues.indexOf(start.join('')) !== -1) charList.splice(0, 2, '');
  // otherwise, add it to the charList
  else charList.splice(0, 0, oneLiners[decoration]);
  return charList.join('');
}

function manipulateMultiLiner(str, decoration, action, selection, pairs){
  let {start, end} = selection;
  let tag = multiLiners[decoration];
  let charList = str.split('');
  if(str.substring(start - 2, start) === tag && str.substring(end, end + 2) === tag){
    charList.splice(start - 2, 2, '');
    charList.splice(end - 1, 2, '');
    return charList.join('');
  }
  switch(action){
    case "add": {
      if(!pairs.isLeftUnpaired) charList.splice(start, 0, tag);
      if(!pairs.isRightUnpaired) charList.splice(end + 1, 0, tag);
      break;
    }
    case "remove": {
      if(pairs.isLeftUnpaired) charList.splice(start - 1, 0, tag);
      if(pairs.isRightUnpaired) charList.splice(end + 1, 0, tag);
      break;
    }
  }
  return charList.join('');
}

// return an object that notifies whether any side of the selection contains an unpaired tag
function getUnpairedTags(str, selection, tag){
  if(selection){
    let {start, end} = selection;
    let decorRegex = tag !== "**" ? new RegExp(tag, 'g') : new RegExp('\\*\\*', 'g');
    let isLeftUnpaired = false, isRightUnpaired = false;
    let leftMatch = str.substring(0, start).match(decorRegex), rightMatch = str.substring(end).match(decorRegex);
    if(leftMatch) isLeftUnpaired = (leftMatch.length % 2 == 1);
    if(rightMatch) isRightUnpaired = (rightMatch.length % 2 == 1);
    return {isLeftUnpaired, isRightUnpaired};
  }
  return undefined;
}

// get the selection inside of the form input based on the paragraph input
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

// remove any tags inside the selection, not including any tags wrapping the selection
function clean(str, selection){
  let {start, end} = selection;
  let selectedStr = str.substring(start, end);
  allTags.forEach(tag => {
    if(tag === "**") tag = '\\*\\*';
    let patt = new RegExp(tag, 'g');
    selectedStr = selectedStr.replace(patt, '');
  });
  return str.slice(0, start) + selectedStr + str.slice(end);
}

// decide whether the current selection should be tagged or should its tags be removed instead
function getAction(selection){
  let {start, end} = selection;
  let allNodes = document.getElementsByClassName("selected")[0].childNodes;
  let selectedNodes = [];
  allNodes.forEach(node => {
    if(node.tagName !== "BR"){
      // if the node starts, ends or covers the selection, push it
      if((node.startIndex >= start && node.startIndex <= end) || (node.endIndex >= start && node.endIndex <= end) || (node.startIndex <= start && node.endIndex >= end)){
        selectedNodes.push(node);
      }
    }
  });
  // if all selected text is wrapped in tags already, return "remove", otherwise return "add"
  for(let node of selectedNodes){
    if(node.nodeName === "#text") {return "add"}
  }
  return "remove";
}

// initialize the decoration event listeners
function initDecorator(){
  let buttons = document.getElementById('decorator').children;
  for(let i = 0; i < buttons.length; i++){
    buttons[i].addEventListener("click", function() {
      let selectedCont = document.getElementsByClassName("selected")[0];
      let selectedContName = selectedCont.attributes.name.nodeValue;
      let input = document.querySelector(`input[name="${selectedContName}"]`);
      // pass in the current this to allow the decorate function to know which button was clicked
      let decoratedCont = decorate.call(this, input.value, selectedCont.textContent);
      updateDOM(decoratedCont, selectedCont, input, this.name);
    });
  }
}

function updateDOM(decoratedCont, selectedCont, input, decoration){
  // fire an enter event to create a new textarea if a one-liner was clicked and was added instead of removed
  if(decoratedCont.length > input.value.length && Object.keys(oneLiners).indexOf(decoration) !== -1) {
      let enterEvent = new KeyboardEvent("keydown", {key: "Enter"});
      selectedCont.dispatchEvent(enterEvent);
  }
  input.value = decoratedCont;
  processText(decoratedCont).then(processedCont => {
    selectedCont.innerHTML = processedCont;
    selectedCont.dispatchEvent(new KeyboardEvent("keyup"))
  });
}

export default initDecorator;
