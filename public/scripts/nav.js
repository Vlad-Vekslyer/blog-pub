const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const body = new FormData(loginForm);
  fetch('/auth/login', {
    method: 'POST',
    mode: 'same-origin',
    body: body
  })
  .then(() => location.reload());
})
