# worker-server
JavaScript service worker as a server. Example library on how it can be done. This way you can have a JavaScript server in your browser, doing heavy lifting and not be in the way of the frontend JavaScript.

**app -> service-worker communication:**

```javascript
fetch(.someFileInScope?message={messageObjetc})
```

And a listener in the service-worker triggered by this fetch:

```javascript
self.addEventListener('fetch', function (event) {
  if (url.includes('someFileInScope')) {
    // act on message sent from frontend.
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
