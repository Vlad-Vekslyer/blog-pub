import {selectElements} from './edit.js';

const {button, textarea} = selectElements('button', 'textarea');

textarea.addEventListener("input", () => {
  if(textarea.value != "") button.disabled = false;
  else button.disabled = true;
});

textarea.addEventListener("keydown", function(event) {
  if(event.key == "Enter"){
    event.preventDefault();
    let form = this.parentElement;
    let newTextarea = document.createElement("TEXTAREA");
    newTextarea.classList.add('contribution');
    form.appendChild(newTextarea);
  } else {
    // calculated with element width divided by text.length when the text area is at full capacity
    const fontWidth = 7.9;
    const maxSize = Math.ceil(this.getBoundingClientRect().width / fontWidth);
    console.log(this.textLength % maxSize);
    if(this.textLength % maxSize == 0 && event.key != "Backspace") this.style.height = `40px`;
    else if(this.textLength % maxSize == 1 && event.key == "Backspace") this.style.height = "20px";
  }
});
