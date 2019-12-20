let contributionNum = 1;

class Contribution {
  contribution;

  constructor() {
    if (contributionNum < 5){
      let contributions = document.querySelector(".contributions");
      let newParagraph = document.createElement("P");
      newParagraph.classList.add("contribution");
      newParagraph.setAttribute("name", `contribution-${contributionNum++}`);
      newParagraph.setAttribute("contenteditable", 'true');
      this.contribution = newParagraph;
      this.buttonToggleEvent();
      this.onSelection();
      this.createContributionEvent();
      contributions.appendChild(newParagraph);
      newParagraph.focus();
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
    let button = document.getElementById('commit-btn');
    this.contribution.addEventListener("input", () => {
      if(this.contribution.value != "") button.disabled = false;
      else button.disabled = true;
    });
  }

  onSelection(){
    let changeSelected = () => {
      let selectedElement = document.getElementsByClassName("selected")[0];
      if(selectedElement) selectedElement.classList.toggle("selected");
      this.contribution.classList.toggle("selected");
    }
    this.contribution.addEventListener("focus", changeSelected);
    this.contribution.addEventListener("select", changeSelected);
  }
}

export default Contribution
