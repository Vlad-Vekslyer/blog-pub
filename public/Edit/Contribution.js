import {allTags} from "./tags.js";

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
      this.addEvents(this.toggleCommit, this.toggleSelection, this.createContribution, this.updateForm, this.updateChildNodes);
      contributions.appendChild(newParagraph);
      newParagraph.focus();
    } else {
      alert("Reached maximum number of contributions");
    }
  }

  addEvents(...callbacks){
    callbacks.forEach(callback => callback.call(this));
  }

  // creates a new textarea when user presses enter
  createContribution(){
    this.contribution.addEventListener("keydown", function(event) {
      if(event.key == "Enter"){
        event.preventDefault();
        new Contribution();
      }
    });
  }

  updateForm(){
    this.contribution.addEventListener("keyup", function(event) {
      if(event.key == "Enter") return;
      let name = this.attributes.getNamedItem("name").nodeValue;
      let inputArr = document.querySelector(`input[name="${name}"]`).value.split('');
      let newArr = [], i = 0, paragraphArr = this.innerText.split('');
      while(paragraphArr.length > 0 || i < inputArr.length){
        let front = inputArr[i] + inputArr[i + 1];
        let back = inputArr[i] + inputArr[i - 1];
        if(allTags.indexOf(front) === -1 && allTags.indexOf(back) === -1) newArr.push(paragraphArr.shift());
        else newArr.push(inputArr[i]);
        i++;
      }
      document.querySelector(`input[name="${name}"]`).value = newArr.join('');
    })
  }

  updateChildNodes(){
    this.contribution.addEventListener("keyup", function() {
      let prevLength, prevStart;
      this.childNodes.forEach((node, index) => {
        let startIndex;
        if(index === 0) startIndex = 0;
        else startIndex = prevLength + prevStart;
        if(node.length){
          prevLength = node.length;
          node.startIndex = startIndex;
        } else if(node.firstChild) {
          prevLength = node.textContent.length;
          node.firstChild.startIndex = startIndex;
          node.startIndex = startIndex;
        }
        prevStart = node.startIndex;
      });
    });
  }

  // control whether the user can submit the form
  toggleCommit(){
    let button = document.getElementById('commit-btn');
    button.disabled = true;
    this.contribution.addEventListener("input", () => {
      if(this.contribution.textContent != "") button.disabled = false;
      else button.disabled = true;
    });
  }

  toggleSelection(){
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
