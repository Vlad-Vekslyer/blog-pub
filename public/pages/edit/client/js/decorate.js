import {oneLiners, multiLiners, allTags} from "/scripts/tags.js";
import {computeDOMSelection} from "/scripts/DOMHelper";
import {occurrenceOf} from "/scripts/StringHelper";
import {processText} from "./process.js";

// returns a string decorated with tags
function decorate(formInput, paragraphInput, decoration){
  if(Object.keys(oneLiners).indexOf(decoration) === -1){
    let paragraphSelections = computeDOMSelection(window.getSelection());
    let action = getAction(paragraphSelections, Array.from(document.getElementsByClassName("selected")[0].childNodes));
    let occurrence = occurrenceOf(paragraphInput, paragraphSelections);
    let selections = getSelection(occurrence, formInput, window.getSelection().toString());
    let pairs = getUnpairedTags(formInput, selections, multiLiners[decoration]);
    formInput = clean(formInput, selections);
    selections = getSelection(occurrence, formInput, window.getSelection().toString());
    return manipulateMultiLiner(formInput, decoration, action, selections, pairs);
  }
  return manipulateOneLiner(formInput, oneLiners[decoration]);
}

function manipulateOneLiner(str, decoration){
  let start = str.slice(0, 2);
  let oneLinerValues = Object.values(oneLiners);
  // if a oneliner already exists, remove it from return. otherwise, add it to the return
  return (oneLinerValues.indexOf(start.join('')) !== -1) ? str.slice(2) : decoration + str;
}

function manipulateMultiLiner(str, decoration, action, selection, pairs){
  let {start, end} = selection;
  let tag = multiLiners[decoration];
  let charList = str.split('');
  // if tags exists around the selection, remove them
  if(str.substring(start - 2, start) === tag && str.substring(end, end + 2) === tag){
    return charList.filter((letter, index) => {
      return [start - 2, start - 1, end, end + 1].indexOf(index) === -1;
    }).join('');
  }
  switch(action){
    case "add":
      return charList.map((letter, index) => {
        if(index === start && !pairs.isLeftUnpaired) {return tag + letter}
        if(index === end && !pairs.isRightUnpaired) {return letter + tag}
        return letter;
      }).join('');
    case "remove":
      return charList.map((letter, index) => {
        if(index === start && pairs.isLeftUnpaired) {return tag + letter}
        if(index === end && pairs.isRightUnpaired) {return letter + tag}
        return letter;
      }).join('');
    default: throw "Incorrect action";
  }
}

// return an object that notifies whether any side of the selection contains an unpaired tag
function getUnpairedTags(str, selection, tag){
  if(selection){
    let {start, end} = selection;
    let decorRegex = tag !== "**" ? new RegExp(tag, 'g') : new RegExp('\\*\\*', 'g');
    let leftMatch = str.substring(0, start).match(decorRegex), rightMatch = str.substring(end).match(decorRegex);
    let isLeftUnpaired = (leftMatch && leftMatch.length % 2 == 1);
    let isRightUnpaired = (rightMatch && rightMatch.length % 2 == 1);
    return {isLeftUnpaired, isRightUnpaired};
  }
  return undefined;
}

// get the selection inside of the form input based on the paragraph input
function getSelection(occurrences, str, substr){
  let reduced = allTags.reduce((accumulator, currentValue) => accumulator + currentValue.charAt(0), '');
  let patt = substr.split('').reduce((accumulator, letter, index) => {
    if(index != substr.length - 1) return accumulator + `${letter}[${reduced}]*`;
    else return accumulator + letter;
  }, '');
  let subRegex = new RegExp(patt, 'g');
  let foundSubstrings = Array.from(str.matchAll(subRegex));
  let index = foundSubstrings[occurrences - 1].index;
  let length = foundSubstrings[occurrences - 1][0].length;
  return {start: index, end: index + length};
}

// remove any tags inside the selection, not including any tags wrapping the selection
function clean(str, selection){
  let {start, end} = selection;
  let selectedStr = str.substring(start, end);
  let cleanString = allTags.reduce((accumulator, tag) => {
    let tagPattern = tag === "**" ? '\\*\\*' : tag;
    let patt = new RegExp(tagPattern, 'g');
    return accumulator.replace(patt, '');
  }, selectedStr);
  return str.slice(0, start) + cleanString + str.slice(end);
}

// decide whether the current selection should be tagged or should its tags be removed instead
function getAction(selection, allNodes){
  let {start, end} = selection;
  let selectedNodes = allNodes.filter(node => {
    if(node.tagName !== "BR"){
      // if the node starts, ends or covers the selection, push it
      if((node.startIndex >= start && node.startIndex <= end) || (node.endIndex >= start && node.endIndex <= end) || (node.startIndex <= start && node.endIndex >= end)){
        return true;
      }
    }
    return false;
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
      let decoratedCont = decorate(input.value, selectedCont.textContent, this.name);
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
