import {selectElements} from './edit.js';

const {button, textarea} = selectElements('button', 'textarea');

textarea.addEventListener("input", () => {
  if(textarea.value != "") button.disabled = false;
  else button.disabled = true;
});
