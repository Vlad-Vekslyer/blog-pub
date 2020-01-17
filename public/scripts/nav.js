const flashClose = document.getElementById('close-btn');

flashClose.addEventListener('click', function() {
    const parent = this.parentElement;
    const grandparent = parent.parentElement;
    grandparent.removeChild(parent);
})

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
