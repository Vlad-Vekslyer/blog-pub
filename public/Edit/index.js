import Contribution from './Contribution.js';
new Contribution();

const reviewButton = document.getElementById("review-btn");
const reviewSection = document.getElementById("review");

reviewButton.addEventListener("click", () => {
  let inputs = document.querySelectorAll("textarea.contribution");
  let inputValues = [];
  inputs.forEach(contribution => inputValues.push(contribution.value));
  let body = {
    contributions : inputValues
  }
  body = JSON.stringify(body);
  fetch("/edit/process", {
    method: 'POST',
    mode: "same-origin",
    body: body,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(res => {
    for(let i = 0; i < reviewSection.children.length; i++) {
        if(reviewSection.children[i].tagName == "DIV") {
          reviewSection.children[i].remove();
          i--;
        }
    }
    res.contributions.forEach(contribution => {
      let section = document.createElement("DIV");
      section.innerHTML = contribution;
      reviewSection.appendChild(section);
    })
  })
  .catch(error => console.error("Fetch error:" + error.message))
});

const [header, emphasis, bold] = document.getElementById('decorator').children;
const selections = {
  start: null,
  end: null
}

let textarea = document.getElementsByName("contribution-1")[0];
textarea.addEventListener("select", event => {
  selections.start = event.target.selectionStart;
  selections.end = event.target.selectionEnd + 1;
})

emphasis.addEventListener("click", function() {
  if(selections.start && selections.end){
    let charList = textarea.value.split('');
    charList.splice(selections.start, 0, "%%");
    charList.splice(selections.end, 0, "%%");
    textarea.value = charList.join('');
  }
});

bold.addEventListener("click", function() {
  if(selections.start && selections.end){
    let charList = textarea.value.split('');
    charList.splice(selections.start, 0, "**");
    charList.splice(selections.end, 0, "**");
    textarea.value = charList.join('');
  }
});
