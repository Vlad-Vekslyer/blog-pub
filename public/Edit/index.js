import Contribution from './Contribution.js';
new Contribution();

const reviewButton = document.getElementById("review-btn");
const reviewSection = document.getElementById("review");

reviewButton.addEventListener("click", () => {
  fetch("/edit/process")
  .then(res => res.json())
  .then(contributions => {
    for (let contribution of Object.values(contributions)){
      let section = document.createElement("DIV");
      section.innerHTML = contribution;
      reviewSection.appendChild(section);
    }
  });
})
