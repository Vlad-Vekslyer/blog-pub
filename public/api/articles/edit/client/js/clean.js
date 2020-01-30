import {searchAll, getDiffArray} from "/scripts/StringHelper";
import {allTags, multiLiners} from "/scripts/tags.js";

const cleaners = {
  'empty-tags': cleanEmptyTags,
  'edges': cleanEdges,
  'selection': cleanSelection
}

// higher order function that handles the different cleanings that need to be done
// @cleanerName is a string that specifies which cleaning function to use
// @cleanerArgs is an array of arguments that will be sent to the cleaner function
// @return the cleaned input and the most updated selection object
function clean(cleanerName, occurence, ...cleanerArgs){
  const cleaner = cleaners[cleanerName];
  if(!cleaner) throw "Entered a cleaner that doesn't exist";
  const cleanedInput = cleaner(...cleanerArgs);
  if(occurence) {
    const selection = getSelection(occurence, cleanedInput, window.getSelection().toString());
    return {input: cleanedInput, selection: selection};
  } else {
    return cleanedInput;
  }
}

// remove any pairs of tags that don't surround any text
function cleanEmptyTags(str){
  let allTagsStr = Object.values(multiLiners).reduce((accumulator, tag) => {
    let char = tag.charAt(0) === '*' ? '\\*' : tag.charAt(0);
    return accumulator + `(${char}{4})?`;
  }, '');
  let regex = new RegExp(allTagsStr, 'g');
  return str.replace(regex, '');
}

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

// get the selection inside of the form input based on the paragraph input
function getSelection(occurrences, str, substr){
  const patt = allTags.reduce((acc, tag) => acc + tag);
  const tagRegex = new RegExp(`[${patt}]{2}`, 'g');
  const cleanStr = str.replace(tagRegex, '');
  const diffArr = getDiffArray(str, tagRegex);
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

export default clean;
