// returns the occurence of the selected substring inside of str
function occurrenceOf(str, selections){
  let selectionRegex = new RegExp(str.substring(selections.start, selections.end), 'g');
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

export {occurrenceOf};
