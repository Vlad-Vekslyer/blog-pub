import {oneLiners, multiLiners, allTags} from "/scripts/tags.js";
import {computeDOMSelection} from "/scripts/DOMHelper";
import {occurrenceOf, searchAll} from "/scripts/StringHelper";

// returns a string decorated with tags
function decorate(formInput, paragraphInput, decoration){
  if(Object.keys(oneLiners).indexOf(decoration) === -1){
    let paragraphSelections = computeDOMSelection(window.getSelection());
    let occurrence = occurrenceOf(paragraphInput, paragraphSelections);
    let firstClean = clean(() => cleanEmptyTags(formInput), occurrence);
    let action = getAction(firstClean);
    let secondClean = clean(() => cleanSelection(firstClean), occurrence);
    let lastClean = action === 'add' ? clean(() => cleanEdges(secondClean, multiLiners[decoration]), occurrence) : secondClean;
    let pairs = getUnpairedTags(lastClean);
    let manipulatedInput = manipulateMultiLiner(lastClean.input, multiLiners[decoration], action, lastClean.selection, pairs);
    return cleanEmptyTags(manipulatedInput);
  }
  return manipulateOneLiner(formInput, oneLiners[decoration]);
}

// higher order function that handles the different cleanings that need to be done
// @cleaner is a callback that expects a cleaning function to be called inside of it. Don't pass in the cleaning function's name to the cleaner
function clean(cleaner, occurence){
  let cleanInput = cleaner();
  let selection = getSelection(occurence, cleanInput, window.getSelection().toString());
  return {input: cleanInput, selection: selection};
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


// get the selection inside of the form input based on the paragraph input
function getSelection(occurrences, str, substr){
  const patt = allTags.reduce((acc, tag) => acc + tag);
  const tagRegex = new RegExp(`[${patt}]{2}`, 'g');

  // diffArr is a 2D array that separates groups of letters' indexes by tags
  // example: "he%%llo" will be separated into [[0,1],[2,3,4]]
  const diffArr = str.split('').reduce((acc, letter, index) => {
    // firstChars and prevChars will be used to check if we are currently iterating over tags
    const firstChars = letter + str.charAt(index + 1);
    const prevChars = str.charAt(index - 1) + letter;
    const match = firstChars.match(tagRegex) || prevChars.match(tagRegex);
    // the more tags we passed through, the bigger currentDiff is
    const currentDiff = (acc.length - 1) * 2;
    // if we're not iterating over tags, add the current index to the last array in the accumulator
    if(!match) {
      const currentArr = acc[acc.length - 1];
      const prevArrs = acc.filter((val, index) => index !== acc.length - 1);
      return [...prevArrs, [...currentArr, index - currentDiff]];
    // upon reaching a tag, push a new empty array into the accumulator
    // this means that we have will now start tracking the characters that are beyond the tag we just encountered in this new array
  } else if(firstChars.match(tagRegex)) {
      return [...acc, []];
    }
    return acc;
  }, [[]]);

  const cleanStr = str.replace(tagRegex, '');
  // get the indexes of all the duplicates of substr inside of str
  const foundSubstrings = searchAll(cleanStr, substr);
  // index of the substr we're looking for
  const searchIndex = foundSubstrings[occurrences - 1];
  // look at diffArr to figure out how many tags are after searchIndex
  const start = diffArr.reduce((acc, arr, arrIndex) => {
    const search = arr.indexOf(searchIndex);
    return search === -1 ? acc : searchIndex + (arrIndex * 2);
  }, null);

  const end = diffArr.reduce((acc, arr, arrIndex) => {
    const endSearchIndex = searchIndex + substr.length - 1;
    const search = arr.indexOf(endSearchIndex);
    return search === -1 ? acc : endSearchIndex + (arrIndex * 2);
  }, null) + 1;
  return {start, end};
}

// remove any tags inside the selection, not including any tags wrapping the selection
function cleanSelection(obj){
  let {input, selection} = obj;
  let {start, end} = selection;
  let selectedStr = input.substring(start, end);
  let cleanString = allTags.reduce((accumulator, tag) => {
    let tagPattern = tag === "**" ? '\\*\\*' : tag;
    let patt = new RegExp(tagPattern, 'g');
    return accumulator.replace(patt, '');
  }, selectedStr);
  return input.slice(0, start) + cleanString + input.slice(end);
}

// console.log(cleanSelection('hello %%hello%% hello', {start: 4, end: 14}))

// clean the edges of the selection from tags that are not ignoreTag
function cleanEdges(obj, ignoreTag){
  let {input, selection} = obj
  let {start, end} = selection;
  let filteredTags = allTags.filter(tag => tag !== ignoreTag);
  let leftEdge = input.substring(start - 2, start), rightEdge = input.substring(end, end + 2);
  // if either the text on the right edge or the left edge are an unnessecary tag
  if(filteredTags.indexOf(rightEdge) !== -1 || filteredTags.indexOf(leftEdge) !== -1){
    return input.split('').map((letter, index) => {
      if((index === start - 2 || index === start - 1) && filteredTags.indexOf(leftEdge) !== -1){
        let {isLeftUnpaired} = getUnpairedTags(obj);
        return isLeftUnpaired ? '' : letter;
      } else if((index === end || index === end + 1) && filteredTags.indexOf(rightEdge) !== -1){
        let {isRightUnpaired} = getUnpairedTags(obj);
        return isRightUnpaired ? '' : letter;
      }
      return letter;
    }).join('');
  }
  return input;
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

function cleanEmptyTags(str){
  let allTagsStr = Object.values(multiLiners).reduce((accumulator, tag) => {
    let char = tag.charAt(0) === '*' ? '\\*' : tag.charAt(0);
    return accumulator + `(${char}{4})?`;
  }, '');
  let regex = new RegExp(allTagsStr, 'g');
  return str.replace(regex, '');
}

export default decorate;
