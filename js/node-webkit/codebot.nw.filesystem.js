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
var NodeWebkitFileSystem = function() {
    var mSelf = null;
    var fs = require('fs');
    var os = require('os');
    
	this.driver = 'Node-webkit FileSystem';
    this.console = console;
        
	this.init = function() {
        // Allow native dialogs to read directories. Needed by chooseDirectory().
        if(typeof($) == 'Function') {
            $('body').append('<input style="display:none;" id="codebotNWFileDialog" type="file" nwdirectory />');
        }
        
        mSelf = this;
	};
    
    this.move = function(theOldNode, theNewNode, theCallback) {
        fs.rename(theOldNode.path, theNewNode.path, function (theError) {
            mSelf.console.log('Rename "'+theOldNode.path+'" to "'+theNewNode.path+'"');
            
            if(!theError) {
                theOldNode.path = theNewNode.path;
                // TODO: change title, name , etc here.
            }
            
            theCallback(theError);
        });
    };
    
    this.getTempDirectory = function(theCallback) {
        theCallback({
            title: 'tmp',
            folder: true,
            key: 'tmp',
            children: [],
            path: os.tmpdir(),
            name: 'tmp'
        });
    };
	
    // Reference: http://stackoverflow.com/a/6358661/29827
    this.readDirectory = function(theNode, theCallback) {
        var walk = function(theDir) {
            var aResults = [];
            var aList = fs.readdirSync(theDir);

            aList.forEach(function(theFile) {
                var aNode = null;
                var aName = theFile;
                
                theFile = theDir + '/' + theFile;
                
                var aStat = fs.statSync(theFile)

                if(aStat && aStat.isDirectory()) {
                    aNode = {
                        title: aName,
                        folder: true,
                        key: aName,
                        children: walk(theFile),
                        path: theFile + '/',
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

        theCallback([{
            title: theNode.name,
            folder: true,
            key: theNode.key,
            children: walk(theNode.path),
            path: theNode.path,
            name: theNode.name
        }]);
    };
    
	this.chooseDirectory = function(theCallback) {
        var aChooser = $('#codebotNWFileDialog');
        
        aChooser.unbind();
        aChooser.change(function(e) {
            theCallback($(this).val());
        });
    
        aChooser.trigger('click');
	};
	
	this.readFile = function(theNode, theCallback) {
        fs.readFile(theNode.path, function (theError, theData) {
            theCallback(theError || String(theData));
        });
	};
	
	this.writeFile = function(theNode, theData, theCallback) {
        try {
            fs.writeFileSync(theNode.path, theData);
            
        } catch (e) { 
            mSelf.console.error("Write failed: " + e);
            theCallback(e);
            return;
        }
        
        mSelf.console.log("Write completed.");
        theCallback();
	};
    
    this.createFile = function(theName, theNode, theData, theCallback) {
		mSelf.writeFile({path: theNode.path + theName}, theData, theCallback);
	};
	
	this.createDirectory = function(theName, theNode, theCallback) {
        var aPath = theNode.folder ? theNode.path : CODEBOT.utils.dirName(theNode.path);
        
        aPath += theName;
        
        mSelf.console.log('Create directory "'+aPath+'"');
        
		fs.mkdir(aPath, 0777, function (theError) {
            theCallback(theError || {
                title: theName,
                folder: true,
                key: theName,
                children: [],
                path: aPath + '/',
                name: theName
            });
        });
	};
};