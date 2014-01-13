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
                                    entry: item,
                                    path: item.fullPath,
                                    name: item.name
                                };
                                
                                loadDirEntry(item, aNode, theCallback);
                            } else {
                                aNode = {
                                    entry: item,
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
    };
    
    var readAsText = function(fileEntry, callback) {
        fileEntry.file(function(file) {
            var reader = new FileReader();
        
            reader.onerror = errorHandler;
            reader.onload = function(e) {
                callback(e.target.result);
            };
        
            reader.readAsText(file);
        });
    };
    
    var writeFileEntry = function(writableEntry, opt_blob, callback) {
        if (!writableEntry) {
            console.error('No file has been selected!');
            return;
        }
    
        writableEntry.createWriter(function(writer) {
            writer.onerror = errorHandler;
            writer.onwriteend = callback;
    
            // If we have data, write it to the file. Otherwise, just use the file we
            // loaded.
            if (opt_blob) {
                writer.truncate(opt_blob.size);
                waitForIO(writer, function() {
                    writer.seek(0);
                    writer.write(opt_blob);
                });
            } else {
                // TODO: remove this else block?
                chosenEntry.file(function(file) {
                    writer.truncate(file.fileSize);
                    waitForIO(writer, function() {
                        writer.seek(0);
                        writer.write(file);
                    });
                });
            }
        }, errorHandler);
    };
    
    var waitForIO = function(writer, callback) {
        // set a watchdog to avoid eventual locking:
        var start = Date.now();
        // wait for a few seconds
        var reentrant = function() {
            if (writer.readyState===writer.WRITING && Date.now()-start<4000) {
                setTimeout(reentrant, 100);
                return;
            }
            if (writer.readyState===writer.WRITING) {
                console.error("Write operation taking too long, aborting!"+
                              " (current writer readyState is "+writer.readyState+")");
                writer.abort();
            } else {
                callback();
            }
        };
        setTimeout(reentrant, 100);
    };
    
	this.init = function() {
	};
	
    this.readDirectory = function(thePath, theCallback) {
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
	
	this.readFile = function(theNode, theCallback) {
        var aEntry = theNode.entry;

        aEntry.file(function(file) {
            readAsText(aEntry, function(result) {
                if(theCallback) {
                    theCallback(result);
                }
            });
        });
	};
	
	this.writeFile = function(theNode, theData, theCallback) {
        var aBlob = new Blob([theData], {type: 'text/plain'});

        writeFileEntry(theNode.entry, aBlob, function(e) {
            console.log('CodebotFS.writeFile(' + theNode.path + ')');
        });
	};
	
	this.createDirectory = function(theNode, theCallback) {
		console.log('CodebotFS.createDirectory(' + theNode + ')');
	};
};

CODEBOT.io = CodebotFS;