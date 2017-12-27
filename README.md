# blob-worker
Writing workers without separated files.

```javascript
var createBlobWorker = function(workerFunction){
	"use strict";
	/**
	 * @type {URL}
	 */
	var URL = window.URL || window.webkitURL;
	/**
	 * @type {Blob}
	 */
	var Blob = window.Blob || window.WebKitBlob || window.MozBlob;
	var workerBlob = new Blob(
		[workerFunction.toString().replace(/^function .+\{?|\}$/g, '')],
		{ type: 'text/javascript' }
	);
	var workerBlobUrl = URL.createObjectURL(workerBlob);
	var worker = new Worker(workerBlobUrl);
	URL.revokeObjectURL(workerBlobUrl);
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
