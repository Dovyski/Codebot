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
    
    var onClick = function(theEvent, theItem) {
        console.debug('FilesPanel.click() ', theEvent, theItem);
	};
	
	var onDoubleClick = function(theEvent, theItem) {
		var aData = theItem.node.data;
		
		console.debug('File panel double click: ' + theEvent + ' , folder: ' + theItem.node.folder);
		
		if(!theItem.node.folder) {
			mUI.openTab(aData);
		}
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
    
    this.load = function(theData) {
		if(theData && theData.length > 0) {
            // TODO: improve this! fancytree should init just once
			$("#folders").fancytree({
                extensions: ['dnd', 'edit', 'awesome', 'contextMenu'],
				click: onClick,
				dblclick: onDoubleClick,
				source: theData,
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
                    triggerStart: ['f2', 'shift+click'],
                },
                contextMenu: {
                    menu: {
                        'edit': { 'name': 'Edit', 'icon': 'edit' },
                        'cut': { 'name': 'Cut', 'icon': 'cut' },
                        'copy': { 'name': 'Copy', 'icon': 'copy' },
                        'paste': { 'name': 'Paste', 'icon': 'paste' },
                        'delete': { 'name': 'Delete', 'icon': 'delete', 'disabled': true },
                        'sep1': '---------',
                        'quit': { 'name': 'Quit', 'icon': 'quit' },
                        'sep2': '---------',
                        'fold1': {
                            'name': 'Sub group',
                            'items': {
                                'fold1-key1': { 'name': 'Foo bar' },
                                'fold2': {
                                    'name': 'Sub group 2',
                                    'items': {
                                        'fold2-key1': { 'name': 'alpha' },
                                        'fold2-key2': { 'name': 'bravo' },
                                        'fold2-key3': { 'name': 'charlie' }
                                    }
                                },
                                'fold1-key3': { 'name': 'delta' }
                            }
                        },
                        'fold1a': {
                            'name': 'Other group',
                            'items': {
                                'fold1a-key1': { 'name': 'echo' },
                                'fold1a-key2': { 'name': 'foxtrot' },
                                'fold1a-key3': { 'name': 'golf' }
                            }
                        }
                    },
                    actions: function(node, action, options) {
                        console.debug('Selected action "' + action + '" on node ' + node);
                    }
                },
			});
			
			var aDirs = $("#folders").fancytree("getTree");
			aDirs.reload();
			
		} else {
			$("#folders").html('<div class="">no</div>');
		}
	};
    
    this.init = function(theUI, theIO) {
        mUI = theUI;
        mIO = theIO;
        
        $('#files-panel header a').on('click', function() {
            mIO.chooseDirectory(function(thePath) {
                mIO.readDirectory(thePath, CODEBOT.ui.refreshFilesPanel);
            });
        });
    };
};