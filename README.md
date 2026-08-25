# worker-server
JavaScript service worker as a server. Example library on how it can be done. 

Advantages:

* Having a JavaScript server in your browser
* Easy to maintain. Browser updates fixes most issues
* Create a server that others easily can plug in to their project
* Only static files needed, perfect for i.e. GitHub Pages.

**[worker-server-example]()**

## Files and their function

### index.html

THe HTML for your web app. Static file (All files are static).

### app.js

Frontend code and initiator of the worker-server (a service worker). Communicates with the service worker by:

**Request:**

```javascript
fetch(./API?command={someDataObject})
```

**Response:**
```
{<JSON object>}
```

### worker-server.js

A service worker that intercepts requests to an `API`-file. Then extracts the command and JSON from the URL, do stuff with it and return some JSON to the frontend.

A switch statement with a case for each command extracted from the URL.

For tasks taking a long time, the worker-server will use postMessage over a broadcastChannel to message the app.js about progress. 

### API

Actually not needed, not even an empty file. If you request this file with a fetch(), the worker-server.js will intercept the request and return a response as if it comes from the non-existing API-file.

### manifest.webmanifest

Manifest file. Main function is to make the web app installable on desktops and smartphones.

### mat-lib.js

Just an example code library. This will be the main library you want do do some heavy lifting with. Import in `worker-server.js` and call the functions you need when you get a command and data from the frontend.


## Old stuff, reformatting needed

```javascript
fetch(.someFileInScope?message={messageObjetc})
```

And a listener in the service-worker triggered by this fetch:

```javascript
self.addEventListener('fetch', function (event) {
  if (url.includes('someFileInScope')) {
    // act on message sent from frontend app.
  }
})
```

 **service-worker->app:**
 ```javascript
const broadcast = new BroadcastChannel('sw_app_serviceworker)
broadcast.postMessage({messageObject})
 ```

## WIP

Will use what I figure out in [Stortinget-repository](https://github.om/eklem/stortinget/), more specifically [fetch(./minimalFile?someApiCall{...}) from app.js](https://github.com/eklem/stortinget/issues/67). I need to se if I can cache `someFileInScipe` even if it has parameters attatched through `?message={messageObject}`
