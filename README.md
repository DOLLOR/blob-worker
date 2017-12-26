# blob-worker
Writing workers without separated files.

```javascript
var createBlobWorker = function(workerFunction){
    var
        workerBlob = new Blob(
            [workerFunction.toString().replace(/^function .+\{?|\}$/g, '')],
            { type: 'text/javascript' }
        ),
        workerBlobUrl = URL.createObjectURL(workerBlob),
        worker = new Worker(workerBlobUrl);
    return worker;
};

var worker = createBlobWorker(function(){
    self.onmessage = function (event) {
        console.log(event);
        postMessage('bar');
    }
});

worker.postMessage('foo');

worker.onmessage = function (event) {
    console.log(event);
};
```
