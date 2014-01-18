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

var CODEBOT = CODEBOT || {};

CODEBOT.ui = new function() {
	var mTabs 				= null;
	var mCurrentTab 		= null;
	var mTextArea 			= null;
	
	var filePanelClick = function(theEvent, theItem) {
	};
	
	var filePanelDoubleClick = function(theEvent, theItem) {
		var aData = theItem.node.data;
		
		console.debug('File panel double click: ' + theEvent + ' , folder: ' + theItem.node.folder);
		
		if(!theItem.node.folder) {
			openTab(aData);
		}
	};
    
    var filePanelDragStart = function(theNode, theDragData) {
        /** This function MUST be defined to enable dragging for the tree.
         *  Return false to cancel dragging of node.
         */
        return true;
    };
    
    var filePanelDragEnter = function(theDestinationNode, theDragData) {
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
    var filePanelDragDrop = function(theDestinationNode, theDragData) {
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
        CODEBOT.io.move(aOldPath, aNewPath, function(theError) {
            if(theError) {
                console.log('Problem with move!');
                // TODO: warn about error and reload tree.
            }
        });
    };
    
    var filePanelRename = function(theEvent, theData) {
        console.log('filePanelRename', theEvent, theData);
    };
    
    var filePanelBeforeRename = function(theEvent, theData) {
        console.log('filePanelBeforeRename', theEvent, theData);
    };
	
	var transform3d = function(theElementId, theX, theY, theZ) {
		document.getElementById(theElementId).style.WebkitTransform = 'translate3d('+ theX +','+ theY +','+ theZ +')';
	};
	
	var tabClosed = function(theTab) {
		var aData = theTab.data('tabData').data;
		var aEditor = aData.editor;
		var aEditorNode = aEditor ? aEditor.getWrapperElement() : null;
		
		// TODO: make a pretty confirm dialog.
		// TODO: only confirm if content has changed.
		if(aEditor && CODEBOT.ui.confirm("Save content before closing?")) {
			CODEBOT.io.writeFile(aData, aEditor.getDoc().getValue(), function() { console.log('Data written!');} );
		}

		if(aEditorNode) {
            aEditorNode.parentNode.removeChild(aEditorNode);
        }
		aData.editor = null;
		
		console.debug('Tab closed', theTab.index(), ', title:', $.trim(theTab.text()), ', data:', aData);
	};
	
	var tabDeactivated = function(theTab) {
		var aTabEditor = null;
		
		aTabEditor = theTab.data('tabData').data.editor;
        
        if(aTabEditor) {
		  aTabEditor.getWrapperElement().style.display = 'none';
        }
		
		console.debug('Tab deactivated', theTab.index(), ', title:', $.trim(theTab.text()), ', data:', theTab.data('tabData').data);
	};
	
	var tabActivated = function(theTab) {
		var aTabEditor = null;
		
		mCurrentTab = theTab;
		
		// Show the content of the newly active tab.
		aTabEditor = mCurrentTab.data('tabData').data.editor;
        
		if(aTabEditor) {
            aTabEditor.getWrapperElement().style.display = 'block';
        }
		
		// Index: mCurrentTab.index()
		// Title: $.trim(mCurrentTab.text())
		// Data: mCurrentTab.data('tabData').data
		console.debug('Tab activated', mCurrentTab.index(), ', title:', $.trim(mCurrentTab.text()), ', data:', mCurrentTab.data('tabData').data);
	};
	
	var openTab = function(theNodeData) {
		CODEBOT.io.readFile(theNodeData, function(theData) {
			mTabs.add({
				favicon: 'file-text-o', // TODO: dynamic icon?
				title: theNodeData.name,
				data: {
					editor: CodeMirror(document.getElementById('working-area'), {
						mode: 'javascript', // TODO: dynamic mode?
						value: theData
					}),
					file: theNodeData.name,
					path: theNodeData.path,
                    entry: theNodeData.entry
				}
			});
		});
	};
    
    // TODO: implement a pretty confirm dialog/panel
    this.confirm = function(theMessage) {
        CODEBOT.ui.log('Confirm? ' + theMessage);
        return true;
    };
    
    this.log = function(theText) {
        $('#console').append(theText + '<br />');
    };
		
	this.showConfigDialog = function(theStatus, theContent) {
		if(theStatus) {
			$('#config-dialog').html(theContent);
			
			// TODO: remove the hardcoded value
			transform3d('content', '-600px', '0', '0');
			transform3d('config-dialog', '-600px', '0', '0');
		} else {
			transform3d('content', '0', '0', '0');
			transform3d('config-dialog', '0', '0', '0');
		}
	};
	
	this.refreshFilesPanel = function(theData) {
		if(theData && theData.length > 0) {
            // TODO: improve this! fancytree should init just once
			$("#folders").fancytree({
                extensions: ['dnd', 'edit'],
				click: filePanelClick,
				dblclick: filePanelDoubleClick,
				source: theData,
				checkbox: false,
				selectMode: 3,
                
                dnd: {
                    preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
                    preventRecursiveMoves: true, // Prevent dropping nodes on own descendants
                    autoExpandMS: 400,
                    dragStart: filePanelDragStart,
                    dragEnter: filePanelDragEnter,
                    dragDrop: filePanelDragDrop
                },
                edit: {
                    beforeEdit: filePanelBeforeRename,
                    edit: filePanelRename
                },
			});
			
			var aDirs = $("#folders").fancytree("getTree");
			aDirs.reload();
			
		} else {
			$("#folders").html('<div class="">no</div>');
		}
	};

	this.addPlugin = function(theId, theObj) {
		$('#config-bar').html(
			$('#config-bar').html() +
			'<a href="#" data-plugin="'+theId+'"><i class="fa fa-'+theObj.icon+'"></i></a>'
		);
		
		$('#config-bar a').click(function() {
			CODEBOT.handlePluginClick($(this).data('plugin'));
		});
	};
	
	this.init = function() {
        console.log('CODEBOT [ui] Building UI');
        
		// TODO: read data from disk, using last open directory.
		CODEBOT.io.readDirectory('/Users/fernando/Downloads/codebot_test', CODEBOT.ui.refreshFilesPanel);
		
		// get tab context from codebot.ui.tabs.js
		mTabs = window.chromeTabs;
		
		mTabs.init({
			container: '.chrome-tabs-shell',
			minWidth: 20,
			maxWidth: 100,
			
			deactivated: tabDeactivated,
			activated: tabActivated,
			closed: tabClosed
		});
        
        // Init core UI
        $('#files-panel header a').on('click', function() {
            CODEBOT.io.chooseDirectory(function(thePath) {
                CODEBOT.io.readDirectory(thePath, CODEBOT.ui.refreshFilesPanel);
            });
        });
	};
};