const flashClose = document.getElementById('close-btn');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

if(flashClose){
  flashClose.addEventListener('click', function() {
    const parent = this.parentElement;
    const grandparent = parent.parentElement;
    grandparent.removeChild(parent);
  })
}

loginBtn.addEventListener('click', formReveal('login'));
registerBtn.addEventListener('click', formReveal('register'));

loginForm.addEventListener('submit', submission('login'));
registerForm.addEventListener('submit', submission('register'));

// higher order function that will handle form revealing after user clicks login/register on nav
function formReveal(type) {
  return function(){
    const form = document.getElementById(`${type}-form`);
    const prevForm = type === 'login' ? registerForm : loginForm;
    form.classList.toggle('hidden');
    prevForm.classList.add('hidden');
  }
}

// higher-order function that will handle the form submission of the login and register form
function submission(type){
  return function(event){
    event.preventDefault();
    const body = new FormData(this);
    fetch('/auth/' + type, {
      method: 'POST',
      mode: 'same-origin',
      body: body
    })
    .then(() => location.reload());
  }
}
