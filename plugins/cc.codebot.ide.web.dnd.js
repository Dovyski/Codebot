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
    // Constants
    const API_URL       = 'plugins/webdisk-filesystem/api.php'; // get this from IO.

    this.id             = 'cc.codebot.ide.web.dnd';

    var mSelf           = null;
    var mContext        = null;

    var uploadFile = function(theFile, theFileReader) {
        console.log(theFile, theFileReader);

        var formData = new FormData();
        formData.append("mount", "6303e4ea85abb38dc7140c9a33279a24/Test1423246069"); // TODO: get this from IO
        formData.append("path", theFile.name);
        formData.append("method", "write");
        formData.append("file", theFile);

        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open("POST", API_URL, true);

        xmlHttpRequest.send(formData);
    };

    var handleFileSelect = function(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        var files = evt.dataTransfer.files; // FileList object.

        // files is a FileList of File objects. List some properties.
        var output = [];
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                    uploadFile(theFile, e.target);
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsArrayBuffer(f);
        }
    };

    var handleDragOver = function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    };

    var initFilesDragDrop = function() {
        console.debug('DragDropPlugin:initFilesDragDrop()');

        // Setup the dnd listeners.
        var dropZone = document.getElementById('folders');
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', handleFileSelect, false);
    };

    this.init = function(theContext) {
        mSelf = this;
        mContext = theContext;

        initFilesDragDrop();
    };
};

CODEBOT.addPlugin(new DragDropPlugin());
