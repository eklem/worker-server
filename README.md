# worker-server
JavaScript service worker as a server. Example library on how it can be done.

app -> service-worker communication:
```javascript
fetch(.someFileInScope?message={messageObjetc})
```

 service-worker->app:
 ```javascript
const broadcast = new BroadcastChannel('sw_app_serviceworker)
broadcast.postMessage({messageObject})
 ```

## WIP

Will use what I figure out in [Stortinget-repository](https://github.om/eklem/stortinget/), more specifically [fetch(./minimalFile?someApiCall{...}) from app.js](https://github.com/eklem/stortinget/issues/67)
