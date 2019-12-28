// returns the occurence of the selected substring inside of str
function occurrenceOf(str, selections){
  let selectionRegex = new RegExp(str.substring(selections.start, selections.end), 'g');
  let selectionMatches = Array.from(str.matchAll(selectionRegex));
  return selectionMatches.reduce((accumulator, match, index) => {
    return match.index === selections.start ? index + 1 : accumulator
  }, 0);
}

export {occurrenceOf};
