import {oneLiners, multiLiners} from "/scripts/tags.js";
import {computeDOMSelection} from "/scripts/DOMHelper";
import {occurrenceOf} from "/scripts/StringHelper";
import clean from "./clean.js";

// cleans a string of unnessecarry tags and decorates the string according to the action and text that was selected by the user
// @formInput is the value of the hidden form in the edit page
// @paragraphInput is the value of the of the <p> tag that the user wrote in
// @decoration is the styling that the user chose to apply
// @return a decorated string, ready to be sent for processing to the server
function decorate(formInput, paragraphInput, decoration){
  if(Object.keys(oneLiners).indexOf(decoration) === -1){
    let paragraphSelections = computeDOMSelection(window.getSelection());
    let occurrence = occurrenceOf(paragraphInput, paragraphSelections);
    let firstClean = clean('empty-tags', occurrence, formInput);
    let action = getAction(firstClean);
    let secondClean = clean('selection', occurrence, firstClean);
    let lastClean = action === 'add' ? clean('edges', occurrence, secondClean, multiLiners[decoration]) : secondClean;
    let pairs = getUnpairedTags(lastClean);
    let manipulatedInput = manipulateMultiLiner(lastClean.input, multiLiners[decoration], action, lastClean.selection, pairs);
    return clean('empty-tags', 0, manipulatedInput);
  }
  return manipulateOneLiner(formInput, oneLiners[decoration]);
}

function manipulateOneLiner(str, tag){
  let start = str.slice(0, 2);
  let oneLinerValues = Object.values(oneLiners);
  // if a oneliner already exists, remove it from return. otherwise, add it to the return
  return (oneLinerValues.indexOf(start) !== -1) ? str.slice(2) : tag + str;
}

function manipulateMultiLiner(str, tag, action, selection, pairs){
  let {start, end} = selection;
  let multiVals = Object.values(multiLiners);
  let leftEdge = str.substring(start - 2, start), rightEdge = str.substring(end, end + 2);
  let charList = str.split('');
  // if two identical tags exist around the selection, remove them
  if(multiVals.indexOf(leftEdge) !== -1 && multiVals.indexOf(rightEdge) !== -1 && leftEdge === rightEdge && action === "remove"){
    return charList.filter((letter, index) => {
      // filter out any characters who's index is located in the array below
      return [start - 2, start - 1, end, end + 1].indexOf(index) === -1;
    }).join('');
  }
  return charList.map(getManipulator(selection, pairs, action, tag)).join('');
}

// higher order function that will return the correct callback to manipulate the form input
function getManipulator(selection, pairs, action, tag){
  let {start, end} = selection;
  let {isLeftUnpaired, isRightUnpaired, leftTag, rightTag} = pairs;
  // iterate through each letter, adding a closing/opening tag if nessecary
  if(action === "add"){
    return function(letter, index) {
      if(index === start && isLeftUnpaired === false) {
        // if the selection is a single char, return the char surrounded by tags
        return start === end - 1 ? tag + letter + tag : tag + letter
      }
      if(index === start && isLeftUnpaired === true && leftTag !== tag) {return leftTag + tag + letter}
      if(index === end - 1 && isRightUnpaired === false) {return letter + tag}
      if(index === end - 1 && isRightUnpaired === true && rightTag !== tag) {return letter + tag + rightTag}
      return letter;
    }
  } else if (action === "remove"){
    return function(letter, index){
      if(index === start && isLeftUnpaired === true) {return leftTag + letter}
      if(index === end - 1 && isRightUnpaired === true) {return letter + rightTag}
      return letter;
    }
  }
}

// return an object that notifies whether any side of the selection contains an unpaired tag
function getUnpairedTags(obj){
  let {input, selection} = obj;
  if(selection){
    let {start, end} = selection;
    let allTagsStr = Object.values(multiLiners).reduce((accumulator, tag) => accumulator + tag.charAt(0), '');
    let decorRegex = new RegExp(`[${allTagsStr}]{2}`, 'g');
    let leftMatch = input.substring(0, start).match(decorRegex), rightMatch = input.substring(end).match(decorRegex);
    let isLeftUnpaired = leftMatch && leftMatch.length % 2 === 1 ? true : false;
    let isRightUnpaired = rightMatch && rightMatch.length % 2 === 1 ? true : false;
    let leftTag = leftMatch ? leftMatch[0] : null;
    let rightTag = rightMatch ? rightMatch[0] : null;
    return {isLeftUnpaired, isRightUnpaired, leftTag, rightTag};
  }
  return undefined;
}

// decide whether the current selection should be tagged or should its tags be removed instead
function getAction(obj){
  let {input, selection} = obj;
  let {start, end} = selection;
  let allTagsStr = Object.values(multiLiners).reduce((accumulator, tag) => {
    return accumulator + tag.charAt(0);
  }, '');
  // this regex will match any text that's between an opening and closing tag
  let regex = new RegExp(`[${allTagsStr}]{2}[^${allTagsStr}]+[${allTagsStr}]{2}`, 'g');
  let matches = Array.from(input.matchAll(regex));
  // get the selection of each match found
  let matchPositions = matches.map(match => {return {start: match.index, end: match.index + match[0].length}});
  // link together selections that are closely adjacent to each other
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

export default decorate;
