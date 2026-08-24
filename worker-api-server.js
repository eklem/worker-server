import { add, subtract, multiply, divide } from './math-lib.js'

/* ### ################################################################# ### */
/* ### BroadcastChannel init + event listener                            ### */

const broadcastChannel = new BroadcastChannel('workerserver_app')

broadcastChannel.onmessage = (message) => {
  console.log('app.js receiving message:')
  console.log(message.data)
}

/* ### ################################################################# ### */
/* ### Sets the service worker in controll of all clients                ### */

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim())
})

/* ### ################################################################# ### */
/* ### Fetch event listener + control switch                             ### */


// ### Url parts extraction                                              ### */
const regexUrl = function (url) {
  let urlParts = {
    query: null,
    json: null
  }

  const queryRegex = /(?<=\/API\?).(?=={)/
  const jsonRegex = /{.*}$/
  
  urlParts.query = queryRegex.exec(url)
  urlParts.query = urlParts.query[0]
  urlParts.json = jsonRegex.exec(url)
  urlParts.json = urlParts.json[0]
  if (urlParts.json !== 'object') { urlParts.json = JSON.parse(urlParts.json) }
  
  return urlParts
}

// ### fetch() event listener                                            ### */
self.addEventListener('fetch', function (event) {
  let responseJson
  // const url = decodeURI(eventrequest.url)
  if (decodeURI(event.request.url).includes('API')) {
    let urlParts = regexUrl(decodeURI(event.request.url))
    switch (urlParts.query) {
      case '+':
        console.log(urlParts.json.num1 + ' + ' + urlParts.json.num2)
        responseJson = add(urlParts.json.num1, urlParts.json.num2)
        break
      case '-':
        responseJson = subtract(urlParts.json.num1, urlParts.json.num2)
        break
      case '*':
        responseJson = multiply(urlParts.json.num1, urlParts.json.num2)
        break
      case '/':
        responseJson = divide(urlParts.json.num1, urlParts.json.num2)
        break
      default:
        // error-message into an object and returing it. To make an error-chekc in the frontend
        console.log('### Servide Worker ERROR')
        responseJson = { type: 'error', message: 'Error: Not a known query-part in the URL' }
    }

    // ### Response back to app.js                                       ### */
    event.respondWith(
      (async () => {
        let responseHeaders = new Headers({
          'Content-Type': 'application/json',
          'mode': 'cors'
        })
        // Just returning a JSON object without hitting the server
        console.log('### response JSON: ' + JSON.stringify(responseJson))
        return new Response (JSON.stringify(responseJson), { url: './API', responseHeaders })
      })(),
    )
  }
})