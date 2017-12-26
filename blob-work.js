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
