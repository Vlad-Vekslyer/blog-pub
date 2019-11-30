let contributionNum = 1;

class Contribution {
  contribution;

  constructor() {
    let contributions = document.querySelector(".contributions");
    let newTextarea = document.createElement("TEXTAREA");
    newTextarea.classList.add("contribution");
    this.contribution = newTextarea;
    this.buttonToggleEvent();
    this.sizeAdjustEvent();
    this.createContributionEvent();
    contributions.appendChild(newTextarea);
    newTextarea.focus();
    Contribution.contributionNum++;
  }

  createContributionEvent(){
    this.contribution.addEventListener("keydown", function(event) {
      if(event.key == "Enter"){
        event.preventDefault();
        new Contribution();
      }
    });
  }

  buttonToggleEvent(){
    let button = document.querySelector('button[type="submit"]');
    this.contribution.addEventListener("input", () => {
      if(this.contribution.value != "") button.disabled = false;
      else button.disabled = true;
    });
  }

  sizeAdjustEvent(){
    this.contribution.addEventListener("keydown", function(event) {
        // calculated with element width divided by text.length when the text area is at full capacity
        const fontWidth = 7.9;
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

}

export default Contribution
