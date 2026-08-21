import { add, subtract, multiply, divide } from './math-lib.js'

/* ### ########################################################### ### */
/* ### BroadcastChannel init + events                              ### */

const broadcastChannel = new BroadcastChannel('workerserver_app')

broadcastChannel.onmessage = (message) => {
  console.log('app.js receiving message:')
  console.log(message.data)
}

/* ### ########################################################### ### */
/* ### Fetch event listener + control switch                       ### */

// ### URL regexes and regex functions
const switchRegex = /(?<=\/API\?)\w*(?=={)/
const objectRegex = /{.*}$/
const apiUrlRegex = /.*(?=\?)/

const getCommand = function (url) {
  let command = switchRegex.exec(url)
  command = command[0]
  return command
}

const getUrlJSON = function (url) {
  let urlJson = objectRegex.exec(url)
  urlJson = urlJson[0]
  urlJson = JSON.parse(urlJson)
  return urlJson
}

// ### fetch() event listener
self.addEventListener('fetch', function (event) {
  const request = event.request
  const url = decodeURI(request.url)
  if (url.includes('API')) {
    let command = getCommand(url)
    let urlJson = getUrlJSON(url)
    // Firefox doesn't look at input as JSON (respons header issue difficult to get right)
    urlJson = JSON.parse(JSON.stringify(urlJson))
    let responseJson

    switch (command) {
      case 'add':
        responseJson = add(urlJson.firstNumber, urlJson.secondNumber)
        break
      case 'subtract':
        responseJson = subtract(urlJson.firstNumber, urlJson.secondNumber)
        break
      case 'multiply':
        responseJson = multiply(urlJson.firstNumber, urlJson.secondNumber)
        break
      case 'divide':
        responseJson = divide(urlJson.firstNumber, urlJson.secondNumber)
        break
      default:
        // error-message into an object and returing it. To make an error-chekc in the frontend
        console.log('### Servide Worker ERROR')
        responseJson = { type: 'error', message: 'Error: Not a known command or query-part of the URL' }
    }

    // ### Response back to app.js
    event.respondWith(
      (async () => {
        let responseHeaders = new Headers({
          'Content-Type': 'application/json; charset=UTF-8'
        })
        // Just returning a JSON object without hitting the server
        return new Response (JSON.stringify(responseJson), { url: './API', responseHeaders })
      })(2000),
    )
  }
})