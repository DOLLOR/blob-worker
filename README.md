# blob-worker
Writing workers without separated files.

BLOB version
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
		[workerFunction.toString().replace(/^function.+\{?|\}$/g, '')],
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

DataURI version
```javascript
var createDataURLWorker = function(workerFunction){
	"use strict";
	var func2str = function(func){
		return func.toString().replace(/^function.+\{?|\}$/g, '') + `\n//# sourceURL=workerJS:///worker${Date.now()}.js`;
	};
	var dataurl = 'data:text/javascript,' + encodeURIComponent(func2str(workerFunction));
	var worker = new Worker(dataurl);
	return worker;
};

var worker = createDataURLWorker(function(){
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

Eval in worker
```javascript
// in worker
onmessage = function(ev){
	this.eval(`(${ev.data.func})\n//# sourceURL=workerJS:///workerEval${Date.now()}.js`)
		.apply(this,ev.data.argList);
};
```
```javascript
// in main script
worker.postMessage({
	func:func.toString(),
	argList,
});
```
