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
	/**
     * Name of the filesystem API, e.g. <code>Node-webkit Filesystem</code>.
     */
    this.driver = 'none';
	
    /**
     * Invoked by Codebot as soon as the filesystem API is loaded. It should initialize internal
     * properties required for the API to work.
     */
    this.init = function() {
		console.error("No IO controller has been loaded!");
	};
	
    /**
     * Moves/rename a file.
     * @param {Node} theOldNode - node that will be moved.
     * @param {Node} theNewNode - node describing how the old node should be changed.
     * @param {function} theCallback - callback with signature <code>func(error)</code>: if everything works, <code>error</code> will be undefined, otherwise it will have information about what went wrong.
     */
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
	 * Shows a native dialog where the user can pick a directory. It is used to
	 * open project folders, for instance.
     *
	 * @param {function} theCallback - callback with signature <code>func(node)</code>, where <code>data</code> contains a node with information related to the selected directory.
	 */
	this.chooseDirectory = function(theCallback) {
		console.error("No IO controller has been loaded!");
	};
	
	/**
	 * Reads a file.
	 *
	 * @param {Node} theNode - node describing the file to be read
     * @param {function} theCallback - callback invoked when the file has been read. It has the following signature: <code>func(data)</code>, where <code>data</code> can be an <code>Error</code> if something goes wrong, or it can be a string with the file's content.
	 */
	this.readFile = function(theNode, theCallback) {
		console.error("No IO controller has been loaded!");
	};
	
	/**
     * Writes data to a file. It creates the file if doesn't exist.
     *
     * @param {Node} theNode - node describing the file to be written.
     * @param {string} theData - data to be written into the file.
     * @param {function} theCallback - callback invoked when the file has been written. It has the following signature: <code>func(error)</code>: if everything works, <code>error</code> will be undefined, otherwise it will have information about what went wrong.
     */
	this.writeFile = function(theNode, theData, theCallback) {
		console.error("No IO controller has been loaded!");
	};
    
    /**
     * Creates a file.
     *
     * @param {string} theName - name of the new file.
     * @param {Node} theNode - node where the new file will be attached to.
     * @param {string} theData - content of the new file
     * @param {function} theCallback - callback invoked when the file has been written. It has the following signature: <code>func(error)</code>: if everything works, <code>error</code> will be undefined, otherwise it will have information about what went wrong.
     */
	this.createFile = function(theName, theNode, theData, theCallback) {
		console.error("No IO controller has been loaded!");
	};
    
    
    /**
     * Deletes a node.
     *
     * @param {Node} theNode - node to be deleted. It can be a file or a directory.
     * @param {function} theCallback - callback invoked when the file has been deleteds. It has the following signature: <code>func(error)</code>: if everything works, <code>error</code> will be undefined, otherwise it will have information about what went wrong.
     */
    this.delete = function(theNode, theCallback) {
		console.error("No IO controller has been loaded!");
	};
	
	/**
     * Creates a new directory.
     *
     * @param {string} theName - name of the new directory
     * @param {Node} theNode - node where the new directory will be created. See {@link getTempDirectory} for information about <code>Node</code> structure.
     * @param {function} theCallback - callback like <code>func(e)</code>, where <code>e</code> will be an error if the operation fails or it will be a node describing the newly created node.
     */
	this.createDirectory = function(theName, theNode, theCallback) {
		console.error("No IO controller has been loaded!");
	};
};