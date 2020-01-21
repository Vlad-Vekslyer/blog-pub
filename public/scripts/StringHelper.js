// returns the occurence of the selected substring inside of str
function occurrenceOf(str, selections, count = 1){
  const {start, end} = selections;
  const selectedStr = str.substring(start, end);
  const selectionRegex = new RegExp(selectedStr);
  const result = selectionRegex.exec(str);
  // exit if we find selectStr at the index where the user selected
  // return the count to indicate how many times the function had to run to find the selected str
  if(result.index === start) {return count}
  const slicedStr = str.slice(result.index + 1);
  const difference = str.length - slicedStr.length;
  return occurrenceOf(slicedStr, {start: start - difference, end: end - difference}, count + 1);
}

// works similarily to String.matchAll except that it looks for matching substrings even in areas where matches were found already
function searchAll(str, search, substr = null, resultArr = []){
  const result = substr ? substr.search(search) : str.search(search);
  if(result === -1) {return resultArr}
  // difference is used to account for the decreasing length of the substring when computing the index
  const difference = substr ? str.length - substr.length : 0;
  // the next search will start right after the starting position of the current match instead of the last position like in String.matchAll
  const slicedStr = str.slice(result + difference + 1);
  return searchAll(str, search, slicedStr, [...resultArr, result + difference])
}

// return a 2D array that separates groups of letters' indexes by tags
// example: "he%%llo" will be separated into [[0,1],[2,3,4]]
function getDiffArray(str, tagRegex) {
  return str.split('').reduce((acc, letter, index) => {
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
}

export {occurrenceOf, searchAll, getDiffArray};
