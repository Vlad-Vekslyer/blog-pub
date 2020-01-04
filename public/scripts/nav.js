const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

if(loginForm && registerForm) {
  loginForm.addEventListener('submit', submission('login'));
  registerForm.addEventListener('submit', submission('register'));
}


const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', () => fetch('/auth/logout').then(() => location.reload()))

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
