import {oneLiners} from '/scripts/tags.js';

// sends decorated text to the backend for processing and returns the procesed text
function processText(decoratedText){
  let body = JSON.stringify({contributions : [decoratedText]});
  return fetch("/articles/edit/process", {
    method: 'POST',
    mode: "same-origin",
    body: body,
    headers: {
      'Content-Type': 'application/json'
    }
  })
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

function getIncoming(elements){
  const contributions = Array.from(elements);
  const sentences = contributions.reduce((acc, cont) => acc + cont.textContent,'')
  .split('.')
  .map(cont => {
    const cleanedCont = cont.replace(/\s+/g, ' ');
    return cleanedCont[0] === ' ' ? cleanedCont.slice(1) : cleanedCont;
  })
  .filter(sentence => sentence.length > 5);
  return sentences;
}

export {processText, updateInputs, getIncoming};
