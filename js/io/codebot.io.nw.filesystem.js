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

var fs = require('fs');

var CodebotFS = new function() {
	this.driver = 'cc.codebot.io.nw.FileSystem';
        
	this.init = function() {
	};
	
    // Reference: http://stackoverflow.com/a/6358661/29827
    this.readDirectory = function(thePath, theCallback) {
        var walk = function(theDir) {
            var aResults = [];
            var aList = fs.readdirSync(theDir);
            
            aList.forEach(function(theFile) {
                var aNode = null;
                var aName = theFile;
                
                theFile = theDir + '/' + theFile
                
                var aStat = fs.statSync(theFile)
                
                if(aStat && aStat.isDirectory()) {
                    aNode = {
                        title: aName,
                        folder: true,
                        key: aName,
                        children: walk(theFile),
                        path: theFile,
                        name: aName
                    };
                } else {
                    aNode = {
                        title: aName,
                        path: theFile,
                        name: aName
                    };
                }
                aResults.push(aNode);
            });

            return aResults;
        };
        
        theCallback(walk(thePath));
    };
    
	this.chooseDirectory = function(theCallback) {
        console.log('CodebotFS.chooseDirectory()');
	};
	
	this.readFile = function(theNode, theCallback) {
        fs.readFile(theNode.path, function (theError, theData) {
            if (theError) throw theError;
            theCallback(String(theData));
        });
	};
	
	this.writeFile = function(theNode, theData, theCallback) {
        fs.writeFile(theNode.path, theData, function (theError) {
            if (theError) {
              console.error("Write failed: " + theError);
              return;
            }
        
            console.log("Write completed.");
            theCallback();
        });
	};
	
	this.createDirectory = function(theNode, theCallback) {
		console.log('CodebotFS.createDirectory(' + theNode + ')');
	};
};

CODEBOT.io = CodebotFS;