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
    console.log('### Command: ' + command)
    console.log('### UrlJson: ' + JSON.stringify(urlJson))
    console.log('###  apiUrl: ' + apiUrl)
    console.log('### sw.js: fetch eventlistener: ' + url)
    switch (command) {
      case 'add':
        broadcastChannel.postMessage('### sw -> app: add')
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
        console.log('Andre kommandoer');
    }

    // ### Fake response since the request is the point
    event.respondWith(
      (async () => {
        let responseHeaders = new Headers({
          'Content-Type': 'application/json; charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
        })
        console.log(responseHeaders.get('Content-Type'))
        // If we didn't find a match in the cache, use the network.
        return new Response (JSON.stringify(urlJson), { url: './API', responseHeaders })
      })(),
    )
  }
})