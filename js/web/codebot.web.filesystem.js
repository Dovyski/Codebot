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
	this.driver = 'Web FileSystem';
        
	this.init = function() {
	};
    
    this.move = function(theOldNode, theNewNode, theCallback) {
        console.log('Move \''+theOldNode.path+'\' to \''+theNewNode.path+'\'');
        theOldNode.path = theNewNode.path;
        
        theCallback();
    };
    
    this.getTempDirectory = function(theCallback) {
        theCallback({title: "tmp", path: "/tmp", name: "tmp", folder: true, key: "tmp"});
    };
	
    // Reference: http://stackoverflow.com/a/6358661/29827
    this.readDirectory = function(thePath, theCallback) {
        theCallback([
	 		{title: "Test.as", path: "/proj/Test.as", name: "Test.as"},
	 		{title: "Folder 2", folder: true, key: "folder2", path: "/proj/Folder 2/", name: "Folder 2",
	 		  children: [
	 			{title: "Test2.as", path: "/proj/Folder 2/Test2.as", name: "Test2.as"},
	 			{title: "Test3.as", path: "/proj/Folder 2/Test3.as", name: "Test3.as"}
	 		  ]
	 		},
            {title: "Folder 3", folder: true, key: "folder3", path: "/proj/Folder 3/", name: "Folder 3",
	 		  children: [
	 			{title: "Test33.as", path: "/proj/Folder 3/Test33.as", name: "Test33.as"},
	 			{title: "Test34.as", path: "/proj/Folder 3/Test34.as", name: "Test34.as"}
	 		  ]
	 		},
	 		{title: "Test4.as", path: "/proj/Test4.as", name: "Test4.as"}
        ]);
    };
    
	this.chooseDirectory = function(theCallback) {
        theCallback({path: 'chosenDir', title: 'chosenDir', name: 'chosenDir'});
	};
	
	this.readFile = function(theNode, theCallback) {
        theCallback('{ content:\'' + theNode.path + '\'}');
	};
	
	this.writeFile = function(theNode, theData, theCallback) {
        theCallback();
	};
    
	this.createFile = function(theName, theNode, theData, theCallback) {
        console.log('CodebotFS.createFile(' + theNode + '/'+theName+')');
		theCallback();
	};
	
	this.createDirectory = function(theName, theNode, theCallback) {
		console.log('CodebotFS.createDirectory(' + theNode + '/'+theName+')');
        theCallback();
	};
};