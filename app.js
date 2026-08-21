/* ### ########################################################### ### */
/* ### BroadcastChannel init + events                              ### */

const broadcastChannel = new BroadcastChannel('workerserver_app')

broadcastChannel.onmessage = (message) => {
  console.log('app.js receiving message:')
  console.log(message.data)
}



/* ### ########################################################### ### */
/* ### Service worker registration                                 ### */

if ("serviceWorker" in navigator) {

  // Checking for index.html in pathname and removing if true
  const indexRegex = /index\.html/
  let windowLocationPathname = ''
  console.log(indexRegex.test(window.location.pathname))
  if (indexRegex.test(window.location.pathname)) {
    console.log('### ### Hello index.html')
    windowLocationPathname = window.location.pathname.replace(indexRegex, '')    
  } else {
    windowLocationPathname = window.location.pathname
  }
  // Register a service worker hosted at the root of the
  navigator.serviceWorker.register(window.location.origin + windowLocationPathname + 'worker-api-server.js', { 
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
const calculateButton = document.getElementById('calculate')

calculateButton.addEventListener('click', (event) => {
  const arithmeticSymbol = document.getElementById('arithmeticSymbol').value
  const firstNumber = Number(document.getElementById('firstNumber').value)
  const secondNumber = Number(document.getElementById('secondNumber').value)
  console.log('calculating: ' + firstNumber + ' ' + arithmeticSymbol + ' ' + secondNumber)
  const fetchPromise = fetch(window.location.origin + window.location.pathname + 'API?' + arithmeticSymbol + '={"firstNumber":' + firstNumber + ',"secondNumber":' + secondNumber + '}', {mode: 'cors', headers: { 'Access-Control-Allow-Origin': '*'}})
  fetchPromise
    .then((response) => response.json())
    .then((data) => {
      console.log('response from worker-api-server: ' + JSON.stringify(data))
      // Do something with what's returned
    })

})
