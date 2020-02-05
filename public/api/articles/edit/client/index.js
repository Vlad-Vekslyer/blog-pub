import Contribution from './js/Contribution.js';
import decorate from "./js/decorate.js";
import {updateInputs, getIncoming, getCurrent} from './js/process.js';
new Contribution();

// initialize decorators
const decoratorBtns = document.getElementById('decorator').children;

for(let i = 0; i < decoratorBtns.length; i++){
  decoratorBtns[i].addEventListener("click", function() {
    let selectedCont = document.getElementsByClassName("selected")[0];
    let selectedContName = selectedCont.attributes.name.nodeValue;
    let input = document.querySelector(`input[name="${selectedContName}"]`);
    let decoratedCont = decorate(input.value.replace(/\n/g, ''), selectedCont.textContent, this.name);
    updateInputs(decoratedCont, selectedCont, input, this.name);
  });
}

// show the decorator over the selected text
document.addEventListener('selectionchange', () => {
  const selection = window.getSelection();
  const isContribution = document.activeElement.classList.contains('selected');
  const decorator = document.getElementById('decorator');
  if(!selection.isCollapsed && isContribution){
    const domRect = selection.getRangeAt(0).getBoundingClientRect();
    decorator.classList.add('show');
    if(domRect.height > 26) {
      decorator.style.left = `${domRect.x + (domRect.width * 0.40)}px`;
    } else {
      decorator.style.left = `${domRect.x}px`;
    }
    decorator.style.top = `${domRect.y - 50 + window.scrollY}px`;
  } else if(selection.isCollapsed) decorator.classList.remove('show');
});

// initialize hidden form
const commitButton = document.getElementById("commit-btn");
const inputs = document.querySelectorAll("input[type='hidden']");

inputs.forEach(input => input.removeAttribute('value'));

commitButton.addEventListener("click",async () => {
  const incoming = getIncoming(document.querySelectorAll("p[contenteditable='true']"));
  const current = getCurrent(document.querySelectorAll(".prev-contribution"));
  const url = new URL(document.querySelector('meta[name="cors-host"]').content + "/compare");
  const {isRelevant} = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({current, incoming}),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json());
  if(isRelevant){
    submitForm();
  } else document.getElementById('popup').classList.remove('hidden');
});

const closePopup = document.getElementById('close-popup');
const commitPopup = document.getElementById('commit-sure');

closePopup.addEventListener('click', () => document.getElementById('popup').classList.add('hidden'));
commitPopup.addEventListener('click', submitForm);

function submitForm(){
  const form = document.getElementById("contribution-form");
  const title = document.getElementById("title-input");
  if(title) document.getElementById("title-form").value = title.value;
  form.submit();
}
