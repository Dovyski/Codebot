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

var CodebotWebDiskFilesystem = function(theContext) {
	// Constants
	const API_URL = 'plugins/webdisk-filesystem/api.php';

	// Public properties
	this.driver = 'Web Disk FileSystem';

	// Private properties
	var mDisk = '';
	var mProjectPath = '';
	var mContext = theContext;

	var runCommand = function(theParams, theDataType, theCallback) {
		theParams.mount = mDisk + '/' + mProjectPath;

		$.ajax({
			url: API_URL,
			method: 'post',
			data: theParams,
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

    this.readDirectory = function(thePath, theCallback) {
		runCommand({method: 'ls'}, 'json', theCallback);
    };

	this.chooseDirectory = function(theCallback) {
        theCallback({path: 'chosenDir', title: 'chosenDir', name: 'chosenDir'});
	};

	this.readFile = function(theNode, theCallback) {
		runCommand({method: 'read', path: theNode.path}, 'text', theCallback);
	};

	this.writeFile = function(theNode, theData, theCallback) {
		runCommand(
			{
				method: 'write',
				path: theNode.node.path,
				data: theData
			},
			'json',
			function(theResponse) {
				console.log(theResponse);
				theCallback();
			}
		);
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
};

/**
* Plugin to enable a database-filesystem.
*/

var WebFileSystemPlugin = function() {
	this.id         = 'cc.codebot.webdisk.filesystem';

	var mSelf       = null;
	var mContext    = null;

	this.init = function(theContext) {
		console.debug('WebFileDiskSystemPlugin::init()');

		mSelf = this;
		mContext = theContext;

		mContext.setIODriver(new CodebotWebDiskFilesystem(mContext));
	};
};

CODEBOT.addPlugin(new WebFileSystemPlugin());
