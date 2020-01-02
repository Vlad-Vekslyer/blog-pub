import Contribution from './js/Contribution.js';
import decorate from "./js/decorate.js";
import {updateInputs} from '/scripts/DOMHelper.js';
new Contribution();

// initialize decorators
const decoratorBtns = document.getElementById('decorator').children;

for(let i = 0; i < decoratorBtns.length; i++){
  decoratorBtns[i].addEventListener("click", function() {
    let selectedCont = document.getElementsByClassName("selected")[0];
    let selectedContName = selectedCont.attributes.name.nodeValue;
    let input = document.querySelector(`input[name="${selectedContName}"]`);
    let decoratedCont = decorate(input.value, selectedCont.textContent, this.name);
    updateInputs(decoratedCont, selectedCont, input, this.name);
  });
}

// initialize hidden form
const commitButton = document.getElementById("commit-btn");
const contributions = document.querySelectorAll("input[type='hidden']");

contributions.forEach(input => input.removeAttribute('value'));

commitButton.addEventListener("click", () => {
  let form = document.getElementsByTagName("form")[0];
  let title = document.getElementById("title-input");
  if(title) document.getElementById("title-form").value = title.value;
  form.submit();
});
