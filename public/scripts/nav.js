const flashClose = document.getElementById('close-btn');
const loginBtn = document.querySelector('nav #login-btn');
const registerBtn = document.querySelector('#nav-footer #register-btn');
const loginBtnMobile = document.querySelector('#nav-footer #login-btn');
const registerBtnMobile = document.querySelector('nav #register-btn');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const hamburger = document.getElementById('hamburger');

if(flashClose){
  flashClose.addEventListener('click', function() {
    const parent = this.parentElement;
    const grandparent = parent.parentElement;
    grandparent.removeChild(parent);
  })
}

hamburger.addEventListener('click', () => document.querySelector('#nav-footer .menu').classList.toggle('drop'));

loginBtn.addEventListener('click', formReveal('login'));
registerBtn.addEventListener('click', formReveal('register'));
loginBtnMobile.addEventListener('click', formReveal('login'));
registerBtnMobile.addEventListener('click', formReveal('register'));
loginForm.addEventListener('submit', submission('login'));
registerForm.addEventListener('submit', submission('register'));

// higher order function that will handle form revealing after user clicks login/register on nav
function formReveal(type) {
  return function(){
    const secondButton = type === 'login' ? registerBtn : loginBtn;
    secondButton.classList.remove('current');
    this.classList.toggle('current');
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
