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

var CodebotIO = function() {
	this.driver = 'none';
	
	this.init = function() {
		console.error("No IO controller has been loaded!");
	};
	
    // TODO: make all IO methods receive "nodes" (directly from fancyfree). It's easier
    // to abstract and implement new IO drivers.
    
    // theCallback(theError) - if theError == null, Ok, else it contains the error info.
    this.move = function(theOldNode, theNewNode, theCallback) {
        console.error("No IO controller has been loaded!");
    };
    
    /**
     * Gets a pointer to the temp directory where Codebot can write/read freely.
     *
     * @param {Function} theCallback - callback with signarure <code>func(node)</code>, where <code>node</code> has the following structure: <code>{title: string, folder: true, key: string, children: [nodes, ...], path: string, name: string}</code>.
     */
    this.getTempDirectory = function(theCallback) {
        console.error("No IO controller has been loaded!");
    };
        
    /**
	 * Reads a directory, returning its structure as an array of nodes.
	 *
     * @param {Node} theNode - node to be used as the starting point. This node is first in the list returned by the method, containing all the directory structure as its children.
     * @param {function} theCallback - callback invoked when the reading is done. It has thestructure <code>func(data)</code>, where <code>data</code> is:
	 *
	 * <code>
	 *	 [
     *      {title: "theNode.title", path: "theNode.path", name: "theNode.name", folder: true, key: "theNode.key",
     *          children: [
	 *		       {title: "Test.as", path: "/proj/folder/Test.as", name: "Test.as"},
	 *		       {title: "Folder 2", path: "/proj/folder/Folder 2", name: "Folder 2", folder: true, key: "folder2",
	 *		           children: [
	 *			          {title: "Test2.as", path: "/proj/folder/Test2.as", name: "Test2.as"},
	 *			          {title: "Test3.as", path: "/proj/folder/Test3.as", name: "Test3.as"}
	 *		           ]
	 *		       },
	 *		       {title: "Test4.as", path: "/proj/folder/Test4.as", name: "Test4.as"}
     *          ]
     *      }
	 *	]
     * </code>
	 */
    this.readDirectory = function(theNode, theCallback) {
        console.error("No IO controller has been loaded!");
    };
    
	/**
	 *
	 *
	 * theCallback: function(data)
	 *
	 * "data" is the path to the directory.
	 */
	this.chooseDirectory = function(theCallback) {
		console.error("No IO controller has been loaded!");
	};
	
	/**
	 *
	 *
	 * theCallback: function(data)
	 */
	this.readFile = function(theNode, theCallback) {
		console.error("No IO controller has been loaded!");
	};
	
	// Write content to file. Create file if not exist.
	this.writeFile = function(theNode, theData, theCallback) {
		console.error("No IO controller has been loaded!");
	};
    
    // Creates a file
	this.createFile = function(theName, theNode, theData, theCallback) {
		console.error("No IO controller has been loaded!");
	};
	
	/**
     * Creates a new directory.
     *
     * @param {string} theName - name of the new directory
     * @param {Node} theNode - node where the new directory will be created. See {@link getTempDirectory} for information about <code>Node</code> structure.
     * @param {function} theCallback - callback like <code>func(err)</code>, where <code>err</code> will be not null if the operation fails.
     */
	this.createDirectory = function(theName, theNode, theCallback) {
		console.error("No IO controller has been loaded!");
	};
};