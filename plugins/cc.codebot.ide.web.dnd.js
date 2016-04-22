/*
	The MIT License (MIT)

	Copyright (c) 2015 Fernando Bevilacqua

	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * Allows drag and drop of files into Codebot.
 */
var DragDropPlugin = function() {
    var mSelf           = null;
    var mContext        = null;

    var updateUploadProgressBar = function(theProgress) {
        $('#dnd-upload-bar div.progress').css('width', (theProgress * 100) + '%');
    }

    var showUploadProgressBar = function(theStatus) {
        if(theStatus) {
            $('#files-panel').append(
                '<div id="dnd-upload-bar" style="display: none; position: absolute; bottom: 10px; z-index: 100; width: 256px; height: 20px; background: #3d3d3d; padding: 3px; border: 1px solid #444;">'+
                    '<i class="fa fa-upload" style="float: left;"></i>' +
                    '<div style="position: relative; width: 90%; margin: 5px 0 0 20px;">' +
                      '<div style="position: absolute; width: 100%; z-index: 2; height: 3px; background: #2a2a2a;"></div>' +
                      '<div class="progress" style="position: absolute; width: 0; z-index: 3; height: 3px; background: #75BFFF;"></div>' +
                    '</div>' +
                '</div>'
            );
            $('#dnd-upload-bar').fadeIn();

        } else {
            $('#dnd-upload-bar').fadeOut(function() {
                $(this).remove();
            });
        }
    }

    var handleUploadResponse = function(theEvent) {
        switch(theEvent.type) {
            case 'progress':
                if (theEvent.lengthComputable) {
                    var aPercent = theEvent.loaded / theEvent.total;
                    updateUploadProgressBar(aPercent);
                    console.debug(aPercent);

                } else {
                    // Unable to compute progress information since the total size is unknown
                    console.debug('Uploading, no progress info....');
                }
                break;

            case 'load':
                console.debug('Upload complete!');
                var aWebIde = mContext.plugins.get('cc.codebot.ide.web');
                aWebIde.refreshProjectFileList();
                showUploadProgressBar(false);
                break;

            case 'error':
            case 'abort':
                console.debug('Upload stopped!');
                break;
        }
    };

    var uploadFile = function(theFile, theFileReader) {
        var aFormData = new FormData();
        var aXmlHttpRequest = new XMLHttpRequest();

        aFormData.append('path', theFile.name);
        aFormData.append('method', 'write');
        aFormData.append('file', theFile);

        aXmlHttpRequest.upload.addEventListener("progress", handleUploadResponse, false);
        aXmlHttpRequest.upload.addEventListener("load", handleUploadResponse, false);
        aXmlHttpRequest.upload.addEventListener("error", handleUploadResponse, false);
        aXmlHttpRequest.upload.addEventListener("abort", handleUploadResponse, false);

        aXmlHttpRequest.open("POST", mContext.io.getAPIEndpoint(), true);
        aXmlHttpRequest.send(aFormData);

        console.debug('Sending file to server');
    };

    var handleFileSelect = function(theEvent) {
        theEvent.stopPropagation();
        theEvent.preventDefault();

        var aFiles = theEvent.dataTransfer.files; // FileList object.

        // files is a FileList of File objects. List some properties.
        for (var i = 0, f; f = aFiles[i]; i++) {
            var aReader = new FileReader();

            // Closure to capture the file information.
            aReader.onload = (function(theFile) {
                return function(theEvt) {
                    uploadFile(theFile, theEvt.target);
                };
            })(f);

            console.debug('Adding file to browser');

            showUploadProgressBar(true);
            aReader.readAsArrayBuffer(f);
        }
    };

    var handleDragOver = function(theEvt) {
        theEvt.stopPropagation();
        theEvt.preventDefault();
        theEvt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    };

    this.init = function(theContext) {
        console.debug('DragDropPlugin:init()');

        mSelf = this;
        mContext = theContext;

        // Setup the dnd listeners.
        var aDropZone = document.getElementById('folders');
        aDropZone.addEventListener('dragover', handleDragOver, false);
        aDropZone.addEventListener('drop', handleFileSelect, false);
    };
};

DragDropPlugin.meta = {
    className: DragDropPlugin,
    id: 'cc.codebot.ide.web.dnd',
    name: 'Drag and drop',
    description: 'Description here',
    version: '1.0.0-ALPHA'
};

CODEBOT.plugins.add(DragDropPlugin.meta);
