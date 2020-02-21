// GENERIC INITIALIZATION
const flashCloseBtn = document.getElementById('close-btn');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// MOBILE INITIALIZATION
const hamburger = document.getElementById('hamburger');
const latestArtBtn = document.querySelector('#nav-footer #latest-articles-btn');
const latestArtBackBtn = document.querySelector('#nav-footer aside button');
const loginBtnMobile = document.querySelector('#nav-footer #login-btn');
const registerBtnMobile = document.querySelector('#nav-footer #register-btn');
const loginBackMobile = document.querySelector('#login-form .mobile-btn:nth-of-type(2)');
const registerBackMobile = document.querySelector("#register-form .mobile-btn:nth-of-type(2)");

// DESKTOP INITIALIZATION
const loginBtn = document.querySelector('nav #login-btn');
const logoutBtns = Array.from(document.getElementsByClassName('logout-btn'));
const registerBtn = document.querySelector('nav #register-btn');

// EVENT LISTENERS
if(flashCloseBtn){
  flashCloseBtn.addEventListener('click', function() {
    const parent = this.parentElement;
    const grandparent = parent.parentElement;
    grandparent.removeChild(parent);
  })
}

hamburger.addEventListener('click', () => document.querySelector('#nav-footer .menu').classList.toggle('drop'));
logoutBtns.forEach(button => {
  button.addEventListener('click', () => fetch('/auth/logout.php').then(() => location.reload()));
});

loginBackMobile.addEventListener('click', formBack('login'));
registerBackMobile.addEventListener('click', formBack('register'));
loginBtn.addEventListener('click', formReveal('login'));
registerBtn.addEventListener('click', formReveal('register'));
loginBtnMobile.addEventListener('click', formReveal('login', true));
registerBtnMobile.addEventListener('click', formReveal('register', true));
latestArtBtn.addEventListener('click', moveLatest('reveal'));
latestArtBackBtn.addEventListener('click', moveLatest('hide'));
loginForm.addEventListener('submit', submission('login'));
registerForm.addEventListener('submit', submission('register'));

// FUNCTION DEFINITIONS
function moveLatest(type){
  const bottomList = document.getElementById('bottom').classList;
  const sidebarList = document.querySelector('#nav-footer aside').classList;
  return function(){
    if(type === 'reveal') {
      bottomList.add('slide');
      sidebarList.add('reveal');
    } else if(type === 'hide'){
      bottomList.remove('slide');
      sidebarList.remove('reveal');
    }
  }
}

function formBack(type) {
  return function(event) {
    event.preventDefault();
    document.getElementById('bottom').classList.remove('slide');
    document.getElementById(`${type}-form`).classList.add('hidden');
  }
}

// higher order function that will handle form revealing after user clicks login/register on nav
function formReveal(type, isMobile = false) {
  return function(){
    if(isMobile === true) document.getElementById('bottom').classList.add('slide');
    else {
      const secondButton = type === 'login' ? registerBtn : loginBtn;
      secondButton.classList.remove('current');
      this.classList.toggle('current');
    }
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
    fetch('/auth/' + type + '.php', {
      method: 'POST',
      mode: 'same-origin',
      body: body
    })
    .then(() => location.reload());
  }
}
