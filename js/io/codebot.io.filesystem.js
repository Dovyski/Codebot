/*
Copyright 2012 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Author: Eric Bidelman (ericbidelman@chromium.org)
Updated: Joe Marini (joemarini@google.com)
Adaptation: Fernando Bevilacqua (dovyski@gmail.com)
*/

var CodebotFS = new function() {
	this.driver = 'cc.codebot.io.FileSystem';
    
    var errorHandler = function(e) {
        console.error(e);
    };
    
    var displayEntryData = function(theEntry) {
        if (theEntry.isFile) {
            chrome.fileSystem.getDisplayPath(theEntry, function(path) {
                CODEBOT.ui.log('short: ' + path);
            });
            theEntry.getMetadata(function(data) {
                CODEBOT.ui.log('Size: ' + data.size);
            });    
        } else {
            CODEBOT.ui.log('full: ' + theEntry.fullPath);
        }
    };
	
    var loadDirEntry = function(theEntry, theParent, theCallback) {
        var chosenEntry = theEntry;
        
        if (chosenEntry.isDirectory && chosenEntry.name.charAt(0) != '.') {
            var dirReader = chosenEntry.createReader();
            var entries = [];
    
            // Call the reader.readEntries() until no more results are returned.
            var readEntries = function() {
                dirReader.readEntries (function(results) {
                    if (!results.length) {
                        if(theParent) {
                            theParent.children = entries;
                        }
                        // TODO: improve this! Call only once, at the end of the loading process.
                        theCallback(entries);
                    } else {
                        results.forEach(function(item) {                             
                            var aNode = null;
                            
                            if(item.name.charAt(0) == '.') return;
                            
                            if(item.isDirectory) {
                                aNode = {
                                    title: item.name,
                                    folder: true,
                                    key: item.name,
                                    children: [],
                                    path: item.fullPath,
                                    name: item.name
                                };
                                
                                loadDirEntry(item, aNode, theCallback);
                            } else {
                                aNode = {
                                    title: item.name,
                                    path: item.fullPath,
                                    name: item.name
                                };
                            }
                            
                            entries = entries.concat(aNode);
                        });
                        readEntries();
                    }
                }, errorHandler);
            };
    
            readEntries(); // Start reading dirs and files
        }
    }
    
	this.init = function() {
	};
	
    this.openDirectory = function(thePath, theCallback) {
        console.log('CodebotFS.openDirectory(' + thePath + ')');
    };
    
	this.chooseDirectory = function(theCallback) {
        chrome.fileSystem.chooseEntry({type: 'openDirectory'}, function(thePath) {
            if (!thePath) {
                console.error('No Directory selected.');
                return;
            }
            // use local storage to retain access to this file
            chrome.storage.local.set({'chosenFile': chrome.fileSystem.retainEntry(thePath)});
            
            var aNode = {
                title: '/root',
                folder: true,
                key: '/root',
                children: [],
                path: '/root',
                name: '/root'
            };
            
            loadDirEntry(thePath, aNode, theCallback);
        });
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