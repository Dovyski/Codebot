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

var CodebotFS = new function() {
	this.driver = 'cc.codebot.io.FileSystem';
	
	this.init = function() {
	};
	
	this.openDirectory = function(thePath, theCallback) {
		if(theCallback) {
			console.log('CodebotFS.openDirectory(' + thePath + ')');
			
			var aStructure = [
				{title: "Test.as", path: "/proj/folder/Test.as", name: "Test.as"},
				{title: "Folder 2", folder: true, key: "folder2",
				  children: [
					{title: "Test2.as", path: "/proj/folder/Test2.as", name: "Test2.as"},
					{title: "Test3.as", path: "/proj/folder/Test3.as", name: "Test3.as"}
				  ]
				},
				{title: "Test4.as", path: "/proj/folder/Test4.as", name: "Test4.as"}
			];
			
			theCallback(aStructure);
		}
	};
	
	this.openFile = function(thePath, theCallback) {
		if(theCallback) {
			console.log('CodebotFS.openFile(' + thePath + ')');
			theCallback('data found in ' + thePath);
		}
	};
	
	this.writeFile = function(thePath, theData, theCallback) {
		console.log('CodebotFS.writeFile(' + thePath + ')');
	};
	
	this.createDirectory = function(thePath, theCallback) {
		console.log('CodebotFS.createDirectory(' + thePath + ')');
	};
};

CODEBOT.io = CodebotFS;