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

// ### URL regexes for mathSymbol and JSON object
const switchRegex = /(?<=\/API\?).(?=={)/
const objectRegex = /{.*}$/

const getCommand = function (url) {
  console.log(url)
  let command = switchRegex.exec(url)
  command = command[0]
  return command
}

const getUrlJSON = function (url) {
  let urlJson = objectRegex.exec(url)
  urlJson = urlJson[0]
  // Firefox doesn't look at input as JSON (respons header issue difficult to get right)
  if (urlJson !== 'object') { urlJson = JSON.parse(urlJson) }
  return urlJson
}

// ### fetch() event listener
self.addEventListener('fetch', function (event) {
  let responseJson
  const request = event.request
  const url = decodeURI(request.url)
  if (url.includes('API')) {
    let command = getCommand(url)
    console.log('### command: ' + command)
    let urlJson = getUrlJSON(url)
    console.log('urlJson: ' + JSON.stringify(urlJson))
    console.dir(urlJson)

    switch (command) {
      case '+':
        console.log(urlJson.num1 + ' + ' + urlJson.num2)
        responseJson = add(urlJson.num1, urlJson.num2)
        break
      case '-':
        responseJson = subtract(urlJson.num1, urlJson.num2)
        break
      case '*':
        responseJson = multiply(urlJson.num1, urlJson.num2)
        break
      case '/':
        responseJson = divide(urlJson.num1, urlJson.num2)
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