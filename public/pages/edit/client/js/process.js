// sends decorated text to the backend for processing and returns the procesed text
function processText(decoratedText){
  let body = JSON.stringify({contributions : [decoratedText]});
  return fetch("/edit/process", {
    method: 'POST',
    mode: "same-origin",
    body: body,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(res => res.contributions[0])
  .catch(error => console.error("Fetch error:" + error.message))
}

export {processText};
