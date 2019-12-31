import {oneLiners, multiLiners, allTags} from "/scripts/tags.js";
import {computeDOMSelection} from "/scripts/DOMHelper";
import {occurrenceOf, linearMatchAll} from "/scripts/StringHelper";
import {processText} from "./process.js";

// returns a string decorated with tags
function decorate(formInput, paragraphInput, decoration){
  if(Object.keys(oneLiners).indexOf(decoration) === -1){
    formInput = cleanEmptyTags(formInput);
    let paragraphSelections = computeDOMSelection(window.getSelection());
    let occurrence = occurrenceOf(paragraphInput, paragraphSelections);
    let selection = getSelection(occurrence, formInput, window.getSelection().toString());
    formInput = cleanSelection(formInput, selection);
    // selection = getSelection(occurrence, formInput, window.getSelection().toString());
    // formInput = cleanEdges(formInput, selection, multiLiners[decoration]);
    let finalSelection = getSelection(occurrence, formInput, window.getSelection().toString());
    let action = getAction(formInput, finalSelection);
    let pairs = getUnpairedTags(formInput, finalSelection, multiLiners[decoration]);
    let manipulatedInput = manipulateMultiLiner(formInput, decoration, action, finalSelection, pairs);
    return cleanEmptyTags(manipulatedInput);
  }
  return manipulateOneLiner(formInput, oneLiners[decoration]);
}

function manipulateOneLiner(str, tag){
  let start = str.slice(0, 2);
  let oneLinerValues = Object.values(oneLiners);
  // if a oneliner already exists, remove it from return. otherwise, add it to the return
  return (oneLinerValues.indexOf(start.join('')) !== -1) ? str.slice(2) : tag + str;
}

function manipulateMultiLiner(str, decoration, action, selection, pairs){
  let {start, end} = selection;
  let tag = multiLiners[decoration];
  let multiVals = Object.values(multiLiners);
  let leftEdge = str.substring(start - 2, start), rightEdge = str.substring(end, end + 2);
  let charList = str.split('');
  // if two identical tags exist around the selection, remove them
  if(multiVals.indexOf(leftEdge) !== -1 && multiVals.indexOf(rightEdge) !== -1 && leftEdge === rightEdge && action === "remove"){
    return charList.filter((letter, index) => {
      return [start - 2, start - 1, end, end + 1].indexOf(index) === -1;
    }).join('');
  }
  // console.log(str,action, selection, pairs);
  switch(action){
    case "add":
      return charList.map((letter, index) => {
        if(index === start && pairs.isLeftUnpaired === false) {return tag + letter}
        if(index === end - 1 && pairs.isRightUnpaired === false) {return letter + tag}
        return letter;
      }).join('');
    case "remove":
      return charList.map((letter, index) => {
        if(index === start && pairs.isLeftUnpaired === true) {return pairs.leftTag + letter}
        if(index === end - 1 && pairs.isRightUnpaired === true) {return letter + pairs.rightTag}
        return letter;
      }).join('');
    default: throw "Incorrect action";
  }
}

// return an object that notifies whether any side of the selection contains an unpaired tag
function getUnpairedTags(str, selection, tag){
  if(selection){
    let {start, end} = selection;
    let allTagsStr = Object.values(multiLiners).reduce((accumulator, tag) => accumulator + tag.charAt(0), '');
    let decorRegex = new RegExp(`[${allTagsStr}]{2}`, 'g');
    let leftMatch = str.substring(0, start).match(decorRegex), rightMatch = str.substring(end).match(decorRegex);
    let isLeftUnpaired = leftMatch && leftMatch.length % 2 === 1 ? true : false;
    let isRightUnpaired = rightMatch && rightMatch.length % 2 === 1 ? true : false;
    let leftTag = leftMatch ? leftMatch[0] : null;
    let rightTag = rightMatch ? rightMatch[0] : null;
    return {isLeftUnpaired, isRightUnpaired, leftTag, rightTag};
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
  let subRegex = new RegExp(patt);
  let foundSubstrings = linearMatchAll(str, subRegex)
  let index = foundSubstrings[occurrences - 1].index;
  return {start: index, end: index + substr.length};
}

// remove any tags inside the selection, not including any tags wrapping the selection
function cleanSelection(str, selection){
  let {start, end} = selection;
  let selectedStr = str.substring(start, end);
  let cleanString = allTags.reduce((accumulator, tag) => {
    let tagPattern = tag === "**" ? '\\*\\*' : tag;
    let patt = new RegExp(tagPattern, 'g');
    return accumulator.replace(patt, '');
  }, selectedStr);
  return str.slice(0, start) + cleanString + str.slice(end);
}

// clean the edges of the selection from tags that are not ignoreTag
function cleanEdges(str, selection, ignoreTag){
  let {start, end} = selection;
  let filteredTags = allTags.filter(tag => tag !== ignoreTag);
  let leftEdge = str.substring(start - 2, start), rightEdge = str.substring(end, end + 2);
  // if either the text on the right edge or the left edge are an unnessecary tag
  if(filteredTags.indexOf(rightEdge) !== -1 || filteredTags.indexOf(leftEdge) !== -1){
    return str.split('').map((letter, index) => {
      if((index === start - 2 || index === start - 1) && filteredTags.indexOf(leftEdge) !== -1){
        let {isLeftUnpaired} = getUnpairedTags(str, selection, leftEdge);
        return isLeftUnpaired ? '' : letter;
      } else if((index === end || index === end + 1) && filteredTags.indexOf(rightEdge) !== -1){
        let {isRightUnpaired} = getUnpairedTags(str,selection, rightEdge);
        return isRightUnpaired ? '' : letter;
      }
      return letter;
    }).join('');
  }
  return str;
}

// decide whether the current selection should be tagged or should its tags be removed instead
function getAction(str, selection){
  console.log(str, selection);
  let {start, end} = selection;
  let allTagsStr = Object.values(multiLiners).reduce((accumulator, tag) => {
    return accumulator + tag.charAt(0);
  }, '');
  let regex = new RegExp(`[${allTagsStr}]{2}[^${allTagsStr}]+[${allTagsStr}]{2}`, 'g');
  let matches = Array.from(str.matchAll(regex));
  let matchPositions = matches.map(match => {return {start: match.index, end: match.index + match[0].length}});
  let linkedMatchPositions = matchPositions.reduce((accumulator, position, index, arr) => {
    if(index < arr.length - 1 && position.end === arr[index + 1].start) {
      return [...accumulator ,{start: position.start, end: arr[index + 1].end}]
    }
    if(index > 0 && position.start === arr[index - 1].end) { return accumulator }
    return [...accumulator, position];
  }, [])
  for(let position of linkedMatchPositions){
    if(start >= position.start && end <= position.end) {return "remove"};
  }
  return "add";
}

// console.log(getAction2('hello %%hello%% hello', {start: 8, end: 13}));
// console.log(getAction2('%%hi%% hi', {start: 2, end: 9}));
// console.log(getAction2('%%hi%%**hi** hello', {start: 2, end: 10}));
// console.log(getAction2('%%hi%%**hi** hello', {start: 10, end: 16}));

function cleanEmptyTags(str){
  let allTagsStr = Object.values(multiLiners).reduce((accumulator, tag) => {
    let char = tag.charAt(0) === '*' ? '\\*' : tag.charAt(0);
    return accumulator + `(${char}{4})?`;
  }, '');
  let regex = new RegExp(allTagsStr, 'g');
  return str.replace(regex, '');
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
