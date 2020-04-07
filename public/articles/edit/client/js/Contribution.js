import {allTags} from "/scripts/tags.js";

let contributionNum = 1;

class Contribution {
  contribution;

  constructor() {
    if (contributionNum < 5){
      let contributions = document.querySelector(".contributions");
      let newParagraph = document.createElement("P");
      newParagraph.classList.add("contribution");
      newParagraph.setAttribute("name", `contribution-${contributionNum}`);
      newParagraph.setAttribute("contenteditable", 'true');
      this.contribution = newParagraph;
      this.addEvents(this.toggleSelection, this.createContribution, this.updateForm, this.updateChildNodes);
      if(contributionNum === 1) this.addEvents(this.addPlaceholder, this.handleEmpty);
      contributions.appendChild(newParagraph);
      newParagraph.focus();
      contributionNum++;
    } else {
      alert("Reached maximum number of paragraphs");
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

  // update the form corresponding to the contribution being edited
  updateForm(){
    this.contribution.addEventListener("keyup", function(event) {
      if(event.key == "Enter") return;
      let name = this.attributes.getNamedItem("name").nodeValue;
      // get array of chars in the corresponding form
      let inputArr = document.querySelector(`input[name="${name}"]`).value.split('');
      let newArr = [], i = 0, paragraphArr = this.textContent.split('');
      while(paragraphArr.length > 0 || i < inputArr.length){
        let front = inputArr[i] + inputArr[i + 1];
        let back = inputArr[i] + inputArr[i - 1];
        /* if front\back strings are tags, then add the tags to newArr.
        Otherwise, shift off a char from the contribution array and add it to newArr */
        if(allTags.indexOf(front) === -1 && allTags.indexOf(back) === -1) newArr.push(paragraphArr.shift());
        else newArr.push(inputArr[i]);
        i++;
      }
      document.querySelector(`input[name="${name}"]`).value = newArr.join('');
    })
  }

  // adds the placeholder span inside of the first contribution
  addPlaceholder(){
    let placeholderSpan = document.createElement("SPAN");
    placeholderSpan.classList.add('placeholder');
    placeholderSpan.innerText = "Write your contribution here...";
    let contributions = document.querySelector(".contributions");
    contributions.appendChild(placeholderSpan);
  }

  // adds placeholder text if contribution is empty
  handleEmpty(){
    this.contribution.addEventListener("keydown", function(event) {
      if(event.key === "Enter") return;
      const placeholder = document.querySelector('.placeholder');
      if(!this.textContent) {
        placeholder.classList.add('hidden');
        this.focus();
      }
    });
  }

  updateChildNodes(){
    this.contribution.addEventListener("keyup", function() {
      let prevLength, prevStart;
      this.childNodes.forEach((node, index) => {
        let startIndex;
        if(index === 0) startIndex = 0;
        else startIndex = prevLength + prevStart;
        if(node.length) prevLength = node.length;
        else if(node.firstChild) {
          prevLength = node.textContent.length;
          node.firstChild.startIndex = startIndex;
        }
        node.startIndex = startIndex;
        node.endIndex = startIndex + prevLength;
        prevStart = node.startIndex;
      });
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
