// returns the occurence of the selected substring inside of str
function occurrenceOf(str, selections, count = 1){
  let {start, end} = selections;
  let selectedStr = str.substring(start, end);
  let selectionRegex = new RegExp(selectedStr);
  let result = selectionRegex.exec(str);
  // exit if we find selectStr at the index where the user selected
  // return the count to indicate how many times the function had to run to find the selected str
  if(result.index === start) {return count}
  let slicedStr = str.slice(result.index + 1);
  let difference = str.length - slicedStr.length;
  return occurrenceOf(slicedStr, {start: start - difference, end: end - difference}, count + 1);
}

function linearMatchAll(str, regex, substr = null, resultArr = []){
  let result = regex.exec(substr ? substr : str);
  if(!result) {return resultArr}
  let difference = substr ? str.length - substr.length : 0;
  let slicedStr = str.slice(result.index + difference + 1);
  let arrItem = {
    index: result.index + (substr ? difference : 0),
    value: result[0]
  }
  return linearMatchAll(str, regex, slicedStr, [...resultArr, arrItem])
}

export {occurrenceOf, linearMatchAll};
