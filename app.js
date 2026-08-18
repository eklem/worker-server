/* ### ########################################################### ### */
/* ### BroadcastChannel init + events                              ### */

const broadcastChannel = new BroadcastChannel('workerserver_app')

broadcastChannel.onmessage = (message) => {
  console.log('app.js receiving message:')
  console.log(message.data)
}

broadcastChannel.onmessageerror = (error) => {
  console.log('onMessageError: something happened:')
  console.log(error)
}

/* ### ########################################################### ### */
/* ### Service worker registration                                 ### */

if ("serviceWorker" in navigator) {
  // Register a service worker hosted at the root of the
  navigator.serviceWorker.register(window.location.origin + window.location.pathname + 'worker-server.js', { 
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
  const firstNumber = document.getElementById('firstNumber').value
  const arithmeticSymbol = document.getElementById('arithmeticSymbol').value
  const secondNumber = document.getElementById('secondNumber').value
  console.log('calculating: ' + firstNumber + ' ' + arithmeticSymbol + ' ' + secondNumber)
  fetch(window.location.origin + window.location.pathname + 'API?' + arithmeticSymbol + '={"firstNumber": "' + firstNumber + '", "secondNumber": "' + secondNumber + '"}')
})
