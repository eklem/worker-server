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
/* ### Fetch event listener + control switch                       ### */

/* ### ########################################################### ### */
/* ### URL regexes for control switch                              ### */
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

const getApiUrl = function (url) {
  const apiUrl = apiUrlRegex.exec(url)
  console.log('### ######### API URL: ' + apiUrl)
  return apiUrl
}

self.addEventListener('fetch', function (event) {
  console.dir(event.request)
  const request = event.request
  const url = decodeURI(request.url)
  if (url.includes('API')) {
    let command = getCommand(url)
    let urlJson = getUrlJSON(url)
    let apiUrl = getApiUrl(url)
    let responseJson = { type: 'result', answer: null }
    console.log('### Command: ' + command)
    console.log('### UrlJson: ' + urlJson)
    console.log('###  apiUrl: ' + apiUrl)
    console.log('### sw.js: fetch eventlistener: ' + url)
    switch (command) {
      case 'add':
        console.log('### Service Worker ADD')
        if (typeof urlJson === 'object') {
          const answer = urlJson.firstNumber + urlJson.secondNumber
          responseJson = { type: 'result', math: urlJson, answer: answer  }
        } else {
          responseJson = { type: 'error', message: 'Not an object.'}
        }
        console.log(responseJson)
        break
      case 'subtract':
        broadcastChannel.postMessage('### sw -> app: subtract')
        break
      case 'multiply':
        broadcastChannel.postMessage('### sw -> app: multiply')
        break
      case 'divide':
        broadcastChannel.postMessage('### sw -> app: divide')
        break
      default:
        // error-message into an object and returing it. To make an error-chekc in the frontend
        console.log('Error: Not a known command or query-part of the URL')
    }

    // ### Responding 
    event.respondWith(
      (async () => {
        let responseHeaders = new Headers({
          'Content-Type': 'application/json; charset=UTF-8'
        })
        console.log(responseHeaders.get('Content-Type'))
        // Just returning a JSON object without hitting the server
        return new Response (JSON.stringify(responseJson), { url: './API', responseHeaders })
      })(),
    )
  }
})