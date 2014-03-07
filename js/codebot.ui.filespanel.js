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

var CodebotFilesPanel = function() {
    var mUI = null;
    var mIO = null;
    var mSelf = null;
    var mFocusedNode = null;
    var mRootNode = null;
    var mTree = null;
    
    var onClick = function(theEvent, theItem) {
        // If the currently focused node has the rename form active,
        // close it and finish the renaming process.
        if(mFocusedNode && mFocusedNode.node.isEditing()) {
            mFocusedNode.node.endEdit();
        }
        mFocusedNode = theItem;
        console.debug('FilesPanel.click() ', theEvent, theItem);
	};
	
	var onDoubleClick = function(theEvent, theItem) {
		var aNode = theItem.node;
		
		console.debug('File panel double click: ' + theEvent + ' , folder: ' + aNode.folder);
		
		if(!aNode.folder) {
            openNodeInTab(aNode);    
		}
	};
    
    var openNodeInTab = function(theNode) {
        var aEditorPrefs = {};
        $.extend(aEditorPrefs, CODEBOT.getPrefs().editor);

        aEditorPrefs.mode        = 'javascript', // TODO: dynamic mode?
        aEditorPrefs.value       = '';
        aEditorPrefs.autofocus   = true;

        // Create a new tab based on node data    
        mIO.readFile(theNode.data, function(theData) {
            aEditorPrefs.value = theData;

            mUI.tabs.add({
                favicon: 'file-text-o', // TODO: dynamic icon?
                title: theNode.data.name,
                editor: CodeMirror(document.getElementById('working-area'), aEditorPrefs),
                file: theNode.data.name,
                path: theNode.data.path
                //TODO: add "entry: theNodeData.entry" for Chrome Packaged Apps
            });            
        });
    };
    
    var onDragStart = function(theNode, theDragData) {
        /** This function MUST be defined to enable dragging for the tree.
         *  Return false to cancel dragging of node.
         */
        return true;
    };
    
    var onDragEnter = function(theDestinationNode, theDragData) {
        /** data.otherNode may be null for non-fancytree droppables.
         *  Return false to disallow dropping on node. In this case
         *  dragOver and dragLeave are not called.
         *  Return 'over', 'before, or 'after' to force a hitMode.
         *  Return ['before', 'after'] to restrict available hitModes.
         *  Any other return value will calc the hitMode from the cursor position.
         */
        // Prevent dropping a parent below another parent (only sort
        // nodes under the same parent)
        //if(node.parent !== data.otherNode.parent){
        //    return false;
        //}
        // Don't allow dropping *over* a node (would create a child)
        //return ["before", "after"];

        if(!theDestinationNode.folder) {
            return ['after', 'before'];
            
        } else {
            return true;
        }
    };
    
    /**
     * Called when a node is dropped in the files panel.
     *
     * @theDestinationNode the node used to guide the dragging process.
     * @theDragData An object containing information regarding the dragging process, e.g. node being dragged, destination, hit strategy.
     */
    var onDragDrop = function(theDestinationNode, theDragData) {
        var aNodeBeingDragged = theDragData.otherNode;
        
        console.debug('Drag and drop event', theDragData);
        
        aNodeBeingDragged.moveTo(theDestinationNode, theDragData.hitMode);
        
        var aOldPath = aNodeBeingDragged.data.path;
        var aNewPath = null;
        
        if(theDragData.hitMode == "over") {
            // Dragging node into a folder. In that case, the destination node (the folder)
            // already has a nice path to be used. e.g. /proj/test/folder/
            aNewPath = theDestinationNode.data.path;
            
        } else {
            // Dragging node after or before another node. In that case, we need to get the
            // path to this neighbour file, removing the file name.
            aNewPath = CODEBOT.utils.dirName(theDestinationNode.data.path);
        }
        
        aNewPath += aNodeBeingDragged.data.name;
        
        // TODO: only move the UI item when the IO opperation informs everything went ok.
        mIO.move(aOldPath, aNewPath, function(theError) {
            if(theError) {
                console.log('Problem with move!');
                // TODO: warn about error and reload tree.
            }
        });
    };
    
    var onRename = function(theEvent, theData) {
        var aNode    = theData.node;
        var aNewName = theData.value;

        if(aNewName != aNode.data.name) {
            var aNewPath = CODEBOT.utils.dirName(aNode.data.path) + aNewName;
            
            mIO.move(aNode.data.path, aNewPath, function(theError) {
                if(theError) {
                    console.log('Problem with rename/move!');
                    // TODO: warn about error and reload tree.
                }
            });
            
            // TODO: update open tab containing the renamed node.
        }
    }; 
    
    var onContexAction = function(theNode, theAction, theOptions) {
        console.debug('Selected action "' + theAction + '" on node ', theNode, theNode.data);
        
        switch(theAction) {
            case 'new-folder':
                var aName = prompt('Directory name');
                mIO.createDirectory(aName, theNode, function(theError) {
                    if(theError) {
                        console.error('Problem with createDirectory!');
                    } else {
                        // TODO: refreash filesPanel
                        mIO.readDirectory('/Users/fernando/Downloads/codebot_test', mSelf.populateTree);
                    }
                });
                break;
        }
    };
    
    var initTree = function() {
        $("#folders").fancytree({
            extensions: ['dnd', 'edit', 'awesome', 'contextMenu'],
            click: onClick,
            dblclick: onDoubleClick,
            source: [],
            checkbox: false,
            selectMode: 3,
            debugLevel: 0,

            dnd: {
                preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
                preventRecursiveMoves: true, // Prevent dropping nodes on own descendants
                autoExpandMS: 400,
                dragStart: onDragStart,
                dragEnter: onDragEnter,
                dragDrop: onDragDrop
            },
            edit: {
                save: onRename,
                triggerCancel: ['esc', 'tab', 'click'],
                triggerStart: ['f2']
            },
            contextMenu: {
                menu: {
                    'edit': { 'name': 'Edit', 'icon': 'edit' },
                    'rename': { 'name': 'Rename', 'icon': 'rename' },
                    'delete': { 'name': 'Delete', 'icon': 'delete', 'disabled': true },
                    'sep1': '---------',
                    'new': {
                        'name': 'New',
                        'items': {
                            'new-folder': { 'name': 'Folder' },
                            'new-file': { 'name': 'File' }
                        }
                    }
                },
                actions: onContexAction
            }
        });
			
        mTree = $("#folders").fancytree("getTree");
	};
    
    this.renameFocusedNode = function() {
        if(mFocusedNode) {
            mFocusedNode.node.startEdit();
            console.log('Open rename panel', mFocusedNode);
        }
    };
    
    this.populateTree = function(theNodes) {
        if(theNodes && theNodes.length > 0) {
            mTree.reload([{title: 'Project', folder: true, key: 'root', expanded: true, children: theNodes}]); // TODO: this should come from IO layer.
            console.debug('Tree has been populated.');
        }
    };
    
    this.init = function(theUI, theIO) {
        mUI = theUI;
        mIO = theIO;
        mSelf = this;
        
        initTree();
                
        $('#files-panel header a').on('click', function() {
            mIO.chooseDirectory(function(thePath) {
                mIO.readDirectory(thePath, mSelf.populateTree);
            });
        });
    };
};