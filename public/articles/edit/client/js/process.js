import {oneLiners} from '/scripts/tags.js';

// sends decorated text to the backend for processing and returns the procesed text
function processText(decoratedText){
  let body = `contributions=${encodeURIComponent(decoratedText)}`;
  return fetch("/articles/edit/process.php", {
    method: 'POST',
    mode: "same-origin",
    body: body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  // .then(res => res.text())
  // .then(res => console.log(res))
  .then(res => res.json())
  .then(res => res.contributions[0])
  .catch(error => console.error("Fetch error:" + error.message))
}

// updates the user input with the processed text from the server
function updateInputs(decoratedText, selectedCont, formInput, decoration){
  // fire an enter event to create a new textarea if a one-liner was clicked and was added instead of removed
  if(decoratedText.length > formInput.value.length && Object.keys(oneLiners).indexOf(decoration) !== -1) {
      let enterEvent = new KeyboardEvent("keydown", {key: "Enter"});
      selectedCont.dispatchEvent(enterEvent);
  }
  formInput.value = decoratedText;
  processText(decoratedText).then(processedCont => {
    selectedCont.innerHTML = processedCont;
    selectedCont.dispatchEvent(new KeyboardEvent("keyup"))
  });
}

// get the contributions being posted and split them into separate sentences
function getIncoming(elements){
  const contributions = Array.from(elements);
  const sentences = contributions.reduce((acc, cont) => acc + cont.textContent,'')
  .split(/[.?]/)
  .map(cont => {
    const cleanedCont = cont.replace(/\s+/g, ' ');
    return cleanedCont[0] === ' ' ? cleanedCont.slice(1) : cleanedCont;
  })
  .filter(sentence => sentence.length > 5);
  return sentences;
}

// get the contributions that were lastly posted and split them into sentences
function getCurrent(elements){
  const latestCont = elements[elements.length - 1];
  const latestContChildren = Array.from(latestCont.children);
  // we're getting the author and the date of the very last contribution
  const latestDate = new Date (latestContChildren.find(child => child.className === 'date').textContent);
  const latestAuthor = latestContChildren.find(child => child.className === 'contributor').textContent;
  // we then filter out any contributions that are not from the same author at the same date
  const latestConts = Array.from(elements).filter(element => {
    const dateStr = Array.from(element.children)
    .find(child => child.className === 'date').textContent;
    const author = Array.from(element.children)
    .find(child => child.className === 'contributor').textContent;
    const date = new Date(dateStr);
    return date.toDateString() === latestDate.toDateString() && author === latestAuthor;
  });
  return latestConts.map(cont => {
    return Array.from(cont.children)
    .find(child => child.className === 'body').textContent;
  });
}

export {processText, updateInputs, getIncoming, getCurrent};
