import decorate from "./decorate.js";

const fontWidth = 7.9;
let currentContribution;
let selections = {};
let contributionNum = 1;

class Contribution {
  contribution;

  constructor() {
    if (contributionNum < 5){
      let contributions = document.querySelector(".contributions");
      let newTextarea = document.createElement("TEXTAREA");
      newTextarea.classList.add("contribution");
      newTextarea.setAttribute("name", `contribution-${contributionNum++}`);
      this.contribution = newTextarea;
      this.buttonToggleEvent();
      this.sizeAdjustEvent();
      this.newSelection();
      this.createContributionEvent();
      contributions.appendChild(newTextarea);
      newTextarea.focus();
    } else {
      alert("Reached maximum number of contributions");
    }
  }

  // creates a new textarea when user presses enter
  createContributionEvent(){
    this.contribution.addEventListener("keydown", function(event) {
      if(event.key == "Enter"){
        event.preventDefault();
        new Contribution();
      }
    });
  }

  // control whether the user can submit the form
  buttonToggleEvent(){
    let button = document.querySelector('button[type="submit"]');
    this.contribution.addEventListener("input", () => {
      if(this.contribution.value != "") button.disabled = false;
      else button.disabled = true;
    });
  }

  // controls the size of a textarea to adjust to the number of characters written
  sizeAdjustEvent(){
    this.contribution.addEventListener("keydown", function(event) {
        // calculated with element width divided by text.length when the text area is at full capacity
        const maxSize = Math.ceil(this.getBoundingClientRect().width / fontWidth);
        const textareaHeight = parseInt(getComputedStyle(this).height);
        if(this.textLength % maxSize == 0 && event.key != "Backspace" && this.textLength != 0) {
          this.style.height = `${textareaHeight + 20}px`;
        }
        else if(this.textLength % maxSize == 1 && event.key == "Backspace" && textareaHeight != 20) {
          this.style.height = `${textareaHeight - 20}px`;
        }
    });

    this.contribution.addEventListener("keyup", function() {
      if(this.textLength == 0) this.style.height = "20px";
    });
  }

  newSelection(){
    this.contribution.addEventListener("select", event => {
      selections.start = event.target.selectionStart;
      selections.end = event.target.selectionEnd + 1;
      currentContribution = this.contribution;
    });

    this.contribution.addEventListener("focus", () => {
      selections = {};
      currentContribution = this.contribution;
    });
  }
}

let buttons = document.getElementById('decorator').children;

for(let i = 0; i < buttons.length; i++){
  buttons[i].addEventListener("click", function() {
    let boundDecorate = decorate.bind(this);
    if(selections.start && selections.end) boundDecorate(currentContribution, selections);
    else boundDecorate(currentContribution);
  })
}

export default Contribution
