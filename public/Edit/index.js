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
    res.contributions.forEach(contribution => {
      let section = document.createElement("DIV");
      section.innerHTML = contribution;
      reviewSection.appendChild(section);
    })
  })
  .catch(error => console.error("Fetch error:" + error.message))

})
