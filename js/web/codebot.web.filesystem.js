/*
	The MIT License (MIT)

	Copyright (c) 2013 Fernando Bevilacqua

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

var CodebotWebFilesystem = function() {
	// Constants
	const API_URL = 'plugins/ide-web/api/?';

	// Public properties
	this.driver = 'Web Disk FileSystem';

	// Private properties
	var mDisk = '';
	var mProjectPath = '';

	// From here: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
	var readBinary = function(thePath, theCallback) {
		var aReq = new XMLHttpRequest();
		var aUrl = API_URL +
				   'class=disk&method=read&mount=' + encodeURI(mDisk + '/' + mProjectPath) +
				   '&path=' + thePath;

		aReq.open('GET', aUrl, true);
		aReq.responseType = 'blob';

		aReq.onload = function(theEvent) {
			var aBlob = aReq.response;
			theCallback(aBlob);
		};

		aReq.onreadystatechange = function() {
			//console.log(aReq);
		};

		aReq.send();
	};

	var runCommand = function(theParams, theDataType, theCallback) {
		var aParams = $.extend({mount: mDisk + '/' + mProjectPath}, theParams);

		$.ajax({
			url: API_URL + 'class=disk',
			method: 'get',
			data: aParams,
			dataType: theDataType
		}).done(function(theData) {
			theCallback(theData);

		}).fail(function(theJqXHR, theTextStatus, theError) {
			console.error('Error: ' + theTextStatus + ', ' + theError);
		});
	};

	this.setProjectPath = function(thePath) {
		mProjectPath = thePath;
	}

	this.init = function() {
		mDisk = CODEBOT.utils.getURLParamByName('disk');

		if(!mDisk) {
			console.warn('CodebotWebDiskFilesystem::init() - it looks like you directly visited this link without a valid disk information. You will not be able to perform any IO operation, such as opening a project. Go to https://web.codebot.com to fix the problem.');
		}

		console.log('CodebotWebDiskFilesystem::init() - disk id = ' + mDisk);
	};

    this.move = function(theOldNode, theNewNode, theCallback) {
		runCommand({method: 'mv', old: theOldNode.path, new: theNewNode.path}, 'text', function(theResponse) {
			if(theResponse.success) {
				theOldNode.path = theNewNode.path;
				theCallback();
			} else {
				theCallback(theResponse.msg);
			}
		});
    };

    this.getTempDirectory = function(theCallback) {
        theCallback({title: "tmp", path: "/tmp", name: "tmp", folder: true, key: "tmp"});
    };

    this.readDirectory = function(theNode, theCallback) {
		if(theNode.path.indexOf('codebot://') != -1) {
			runCommand({method: 'lsCodebot', path: theNode.path.replace(/codebot:\/\//, '')}, 'json', theCallback);

		} else {
			runCommand({method: 'ls', path: theNode.path}, 'json', theCallback);
		}
    };

	this.chooseDirectory = function(theCallback) {
        theCallback({path: 'chosenDir', title: 'chosenDir', name: 'chosenDir'});
	};

	this.readFile = function(theNode, theCallback) {
		if(theNode.path.indexOf('codebot://') != -1) {
			runCommand({method: 'readCodebot', path: theNode.path.replace(/codebot:\/\//, '')}, 'text', theCallback);

		} else {
			readBinary(theNode.path, theCallback);
		}
	};

	this.writeFile = function(theNode, theData, theCallback) {
		if(theNode.path.indexOf('codebot://') != -1) {
			runCommand({method: 'writeCodebot', path: theNode.path.replace(/codebot:\/\//, ''), data: theData}, 'json', theCallback);

		} else {
			runCommand(
				{
					method: 'write',
					path: theNode.path,
					data: theData
				},
				'json',
				function(theResponse) {
					console.log(theResponse);
					theCallback();
				}
			);
		}
	};

	this.createFile = function(theName, theNode, theData, theCallback) {
		runCommand({method: 'write', path: theNode.path + '/' + theName, data: theData}, 'json', theCallback);
	};

    this.delete = function(theNode, theCallback) {
		runCommand({method: 'rm', path: theNode.path}, 'json', function(theResponse) {
			theCallback(theResponse.success ? null : theResponse.msg);
		});
	};

	this.createDirectory = function(theName, theNode, theCallback) {
		runCommand({method: 'mkdir', path: theNode.path + '/' + theName}, 'json', theCallback);
	};

	this.getAPIEndpoint = function() {
		return API_URL + 'class=disk&mount=' + mDisk + '/' + mProjectPath;
	};
};
