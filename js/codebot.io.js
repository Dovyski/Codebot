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

var CODEBOT = CODEBOT || {};

CODEBOT.io = new function() {
	this.driver = 'none';
	
	this.init = function() {
		console.error("No IO controller has been loaded!");
	};
	
    
    /**
	 *
	 *
	 * theCallback: function(data)
	 *
	 * "data" structure:
	 *	 [
	 *		{title: "Test.as", path: "/proj/folder/Test.as", name: "Test.as"},
	 *		{title: "Folder 2", folder: true, key: "folder2",
	 *		  children: [
	 *			{title: "Test2.as", path: "/proj/folder/Test2.as", name: "Test2.as"},
	 *			{title: "Test3.as", path: "/proj/folder/Test3.as", name: "Test3.as"}
	 *		  ]
	 *		},
	 *		{title: "Test4.as", path: "/proj/folder/Test4.as", name: "Test4.as"}
	 *	]
	 */
    this.openDirectory = function(thePath, theCallback) {
        console.error("No IO controller has been loaded!");
    };
    
	/**
	 *
	 *
	 * theCallback: function(data)
	 *
	 * "data" structure:
	 *	 [
	 *		{title: "Test.as", path: "/proj/folder/Test.as", name: "Test.as"},
	 *		{title: "Folder 2", folder: true, key: "folder2",
	 *		  children: [
	 *			{title: "Test2.as", path: "/proj/folder/Test2.as", name: "Test2.as"},
	 *			{title: "Test3.as", path: "/proj/folder/Test3.as", name: "Test3.as"}
	 *		  ]
	 *		},
	 *		{title: "Test4.as", path: "/proj/folder/Test4.as", name: "Test4.as"}
	 *	]
	 */
	this.chooseDirectory = function(theCallback) {
		console.error("No IO controller has been loaded!");
	};
	
	/**
	 *
	 *
	 * theCallback: function(data)
	 */
	this.openFile = function(thePath, theCallback) {
		console.error("No IO controller has been loaded!");
	};
	
	// Write content to file. Create file if not exist.
	this.writeFile = function(thePath, theData, theCallback) {
		console.error("No IO controller has been loaded!");
	};
	
	// Creates a new directory.
	this.createDirectory = function(thePath, theCallback) {
		console.error("No IO controller has been loaded!");
	};
};