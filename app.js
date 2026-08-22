/* ### ################################################################# ### */
/* ### BroadcastChannel init + events                                    ### */

const broadcastChannel = new BroadcastChannel('workerserver_app')

broadcastChannel.onmessage = (message) => {
  console.log('app.js receiving message:')
  console.log(message.data)
}

/* ### ################################################################# ### */
/* ### Service worker registration                                       ### */

if ("serviceWorker" in navigator) {

  // ### Removing index.html if it's present in .pathname
  const indexRegex = /index\.html/
  let pathname = ''
  pathname = window.location.pathname.replace(indexRegex, '')    

  // ### Register a service worker
  navigator.serviceWorker.register(window.location.origin + pathname + 'worker-api-server.js', { 
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

/* ### Calculate button action */
/* ### ################################################################# ### */
/* ### A: Listen to button clicked                                       ### */
/* ### B: fetch()-request data to worker-api                             ### */
/* ### C: handle response json from fetch()-request                      ### */

const calculateButton = document.getElementById('calculate')
calculateButton.addEventListener('click', (event) => {
  const arithmeticSymbol = document.getElementById('arithmeticSymbol').value
  console.log('### Arithmetic symbol: ' + arithmeticSymbol)
  const num1 = Number(document.getElementById('num1').value)
  const num2 = Number(document.getElementById('num2').value)
  console.log(num1 + ' ' + num2)
  const fetchPromise = fetch(window.location.origin + pathname + 'API?' + arithmeticSymbol + '={"num1":' + num1 + ',"num2":' + num2 + '}', {mode: 'cors', headers: { 'Access-Control-Allow-Origin': '*'}})
  fetchPromise
    .then((response) => response.json())
    .then((data) => {
      console.log('response from worker-api-server: ' + JSON.stringify(data))
      // Do something with what's returned
    })

})
