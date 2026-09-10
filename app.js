/* ### ################################################################# ### */
/* ### BroadcastChannel init + events                                    ### */
/* ### listening to message from worker-server.                          ### */

const broadcastChannel = new BroadcastChannel('workerserver_app')

broadcastChannel.onmessage = (message) => {
  console.log('app.js receiving message:')
  console.log(message.data)
  // do something with message
}

/* ### ################################################################# ### */
/* ### Service worker registration                                       ### */

// ### Removing index.html if it's present in .pathname
const indexRegex = /index\.html/
let pathname = ''
pathname = window.location.pathname.replace(indexRegex, '') 

if ("serviceWorker" in navigator) {
  // ### Register a service worker
  navigator.serviceWorker.register(window.location.origin + pathname + 'webpage-server.js', { 
    type: 'module',
    scope: window.location.origin + window.location.pathname
  })
  .then (
    (registration) => {
      console.log("Service worker registration succeeded:", registration)
    },
    (error) => {
      console.error(`Service worker registration failed: ${error}`)
    },
  )
} else {
  console.error("Service workers are not supported.")
}

/* ### ################################################################# ### */
/* ### Creating HTML to add to document                                  ### */

const populateHTML = function (nodeObject) {
  const result = document.getElementById('result')
  const p = document.createElement('p')
  p.setAttribute('id', 'result');
  const pContent = document.createTextNode(nodeObject.mathProblem + nodeObject.answer)
  p.appendChild(pContent)
  result.replaceWith(p)
}

/* ### ################################################################# ### */
/* ### A: Listen to button clicked                                       ### */
/* ### B: fetch()-request data to worker-api                             ### */
/* ### C: handle response json from fetch()-request                      ### */

// A: Make the object, B: populate it, C: stringify it when fetching

const calculateButton = document.getElementById('calculate')

calculateButton.addEventListener('click', (event) => {
  const arithmeticSymbol = document.getElementById('arithmeticSymbol').value  
  const num1 = Number(document.getElementById('num1').value)
  const num2 = Number(document.getElementById('num2').value)
  const fetchPromise = fetch(encodeURI(window.location.origin + pathname + 'API?' + arithmeticSymbol + '={"num1":' + num1 + ',"num2":' + num2 + '}'))
  fetchPromise
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      populateHTML(data)
    })
    .catch((error) => {
      console.error(`onRejected function called: ${error.message}`)
    })
})
