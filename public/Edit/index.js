import Contribution from './Contribution.js';
import initDecorator from "./decorate.js";
new Contribution();
initDecorator();

const commitButton = document.getElementById("commit-btn");

commitButton.addEventListener("click", () => {
  let form = document.getElementsByTagName("form")[0];
  let title = document.getElementById("title-input");
  if(title) document.getElementById("title-form").value = title.value;
  form.submit();
});
