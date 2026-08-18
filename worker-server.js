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

self.addEventListener('fetch', function (event) {
  console.dir(event.request)
  const request = event.request
  const url = decodeURI(request.url)
  if (url.includes('API')) {
    let command = getCommand(url)
    let urlJson = getUrlJSON(url)
    let apiUrl = getCacheUrl(url)
    console.log('### Command: ' + command)
    console.log('### UrlJson: ' + JSON.stringify(urlJson))
    console.log('###  apiUrl: ' + apiUrl)
    console.log('### sw.js: fetch eventlistener: ' + url)
    switch (command) {
      case 'apiFetch':
        getSessions(urlJson.url)
        broadcastMeta.postMessage('### sw -> app: apiFetch: ' + urlJson)
        break
      case 'query':
        broadcastMeta.postMessage('### sw -> app: query: ' + urlJson.query)
        break
      default:
        console.log('Andre kommandoer');
    }

    // ### Fake response since the request is the point
    event.respondWith(
      (async () => {
        // Try to get the response from a cache.
        const cachedResponse = await caches.match(event.request);
        // Return it if we found one.
        if (cachedResponse) return cachedResponse;
        // If we didn't find a match in the cache, use the network.
        return new Response (null, { status: 204, url: './API' })
      })(),
    )
  }
})