import Contribution from './js/Contribution.js';
import initDecorator from "./js/decorate.js";
new Contribution();
initDecorator();

const commitButton = document.getElementById("commit-btn");
const contributions = document.querySelectorAll("input[type='hidden']");

contributions.forEach(input => input.removeAttribute('value'));

commitButton.addEventListener("click", () => {
  let form = document.getElementsByTagName("form")[0];
  let title = document.getElementById("title-input");
  if(title) document.getElementById("title-form").value = title.value;
  form.submit();
});
