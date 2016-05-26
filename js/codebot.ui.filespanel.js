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
    var mCodebot = null;
    var mSelf = null;
    var mFocusedNode = null;
    var mRootNode = null;
    var mTreeData = {};
    var mTree = null;
    var mContextMenu = null;
    var mFoldersState = {};
    var mShadowNodes = {};
    var mPendingActivities = {};

    var onClick = function(theEvent, theItem) {
        // If the currently focused node has the rename form active,
        // close it and finish the renaming process.
        if(mFocusedNode && mFocusedNode.node.isEditing()) {
            mFocusedNode.node.endEdit();
        }
        mFocusedNode = theItem;

        if(theItem.node.folder) {
            mFoldersState[theItem.node.key] = !theItem.node.expanded;
        }

        mCodebot.signals.filesPanelItemClicked.dispatch([theItem]);
	};

	var onDoubleClick = function(theEvent, theItem) {
		var aNode = theItem.node;

        mCodebot.signals.filesPanelItemDoubleClicked.dispatch([theItem]);

		if(!aNode.folder && !aNode.data.shadow) {
            mCodebot.ui.tabs.openNode(aNode);
		}
	};

    var onDragStart = function(theNode, theDragData) {
        /** This function MUST be defined to enable dragging for the tree.
         *  Return false to cancel dragging of node.
         */
        return !theDragData.shadow;
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

        if(aNodeBeingDragged.data.shadow) {
            // Shadow nodes cannot be dragged around.
            console.debug('Drag and drop cancelled because node is a shadow node');
            return;
        }

        console.debug('Drag and drop event', theDragData);

        aNodeBeingDragged.moveTo(theDestinationNode, theDragData.hitMode);

        var aOldPath = aNodeBeingDragged.data;
        var aNewPath = null;

        if(theDragData.hitMode == "over") {
            // Dragging node into a folder. In that case, the destination node (the folder)
            // already has a nice path to be used. e.g. /proj/test/folder/
            aNewPath = theDestinationNode.data.path + '/';

        } else {
            // Dragging node after or before another node. In that case, we need to get the
            // path to this neighbour file, removing the file name.
            aNewPath = CODEBOT.utils.dirName(theDestinationNode.data.path);
        }

        aNewPath += aNodeBeingDragged.data.name;

        // TODO: only move the UI item when the IO opperation informs everything went ok.
        // TODO: fix the {path: } because it breaks IO layer.
        mCodebot.io.move(aOldPath, {path: aNewPath}, function(theError) {
            if(theError) {
                console.log('Problem with move!');
                // TODO: warn about error and reload tree.
            }
        });

        mSelf.sortTree();
    };

    var onRename = function(theEvent, theData) {
        var aNode    = theData.node;
        var aNewName = theData.value;

        if(aNewName != aNode.data.name) {
            var aNewNode = {path: CODEBOT.utils.dirName(aNode.data.path, aNode.folder ? 3 : 1) + aNewName}; // TODO: fix this, it breaks IO layer.

            mCodebot.io.move(aNode.data, aNewNode, function(theError) {
                if(theError) {
                    console.log('Problem with rename/move!');
                    // TODO: warn about error and reload tree.
                }
            });

            mSelf.sortTree();
            // TODO: update open tab containing the renamed node.
        }
    };

    var restoreFoldersStatus = function(theNode) {
        if(!theNode || !theNode.folder) {
            return;
        }

        // Was the folder expanded?
        if(mFoldersState[theNode.key]) {
            theNode.expanded = true;
        }

        // Check all children, if any.
        if(theNode.children) {
            for(var i = 0, t = theNode.children.length; i < t; i++) {
                if(theNode.children[i].folder) {
                    restoreFoldersStatus(theNode.children[i]);
                }
            }
        }
    };

    var refreshPendingActivitiesBadge = function() {
        var aText = '', aActivity;

        for(var aKey in mPendingActivities) {
            aActivity = mPendingActivities[aKey];

            if(aActivity != null) {
                aText += '<li><strong>' + mPendingActivities[aKey].name + '</strong> ' + mPendingActivities[aKey].description + '</li>';
            }
        }

        if(aText != '') {
            $('#files-panel-pending-activities div ul').html(aText);
            $('#files-panel-pending-activities a').show();
        } else {
            $('#files-panel-pending-activities a').hide();
        }
    };

    var initPendingActivitiesBadge = function() {
        $('#files-panel').append(
            '<div id="files-panel-pending-activities">' +
                '<a href="javascript:void(0);"><i class="fa fa-circle-o-notch fa-spin"></i></a>' +
                '<div><ul></ul></div>' +
            '</div>'
        );

        $('#files-panel-pending-activities a').hover(
            function() {
                $('#files-panel-pending-activities div').show();
            },
            function() {
                $('#files-panel-pending-activities div').hide();
            }
        );
    }

    var initTree = function() {
        $("#folders").fancytree({
            extensions: ['dnd', 'edit', 'awesome', 'contextMenu'],
            click: onClick,
            dblclick: onDoubleClick,
            clickFolderMode: 2, // 1:activate, 2:expand, 3:activate and expand, 4:activate (dblclick expands)
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
            contextMenu: mContextMenu.create()
        });

        mTree = $("#folders").fancytree("getTree");
	};

    var addShadowNodesToRendedTree = function() {
        var aKey,
            aEntry;

        for(aKey in mShadowNodes) {
            aEntry = mShadowNodes[aKey];
            aEntry.parent.addChildren(aEntry.node);
        }
    };

    this.sortTree = function() {
        var aNode = $('#folders').fancytree('getRootNode');

        aNode.sortChildren(function(theA, theB) {
            var x = theA.data.name.toLowerCase(),
				y = theB.data.name.toLowerCase();
			return x === y ? 0 : x > y ? 1 : -1;
        }, true);
    };

    this.showMessage = function(theMessage) {
        $('#folders .fancytree-container').hide();
        $('#folders .message').html(theMessage).fadeIn();
    };

    this.hideMessage = function() {
        $('#folders .message').fadeOut();
        $('#folders .fancytree-container').show();
    };

    this.renameFocusedNode = function() {
        if(mFocusedNode && !mFocusedNode.node.data.shadow) {
            mFocusedNode.node.startEdit();
            console.log('Open rename panel', mFocusedNode);
        }
    };

    this.reloadTreeData = function() {
        mCodebot.io.readDirectory(mRootNode, mSelf.populateTree);
    };

    this.refreshTree = function() {
        // Tell everybody that the files panel is about to
        // refresh. Plugins can change the tree structure,
        // for instance.
        mCodebot.signals.beforeFilesPanelRefresh.dispatch([mRootNode]);

        restoreFoldersStatus(mTreeData);
        mTree.reload(mTreeData);
        addShadowNodesToRendedTree();
        mSelf.sortTree();
    };

    this.addShadowNode = function(theNode, theParent) {
        var aNewNode = {};

        if(theNode == null || !theNode.key) {
            throw new Error('Shadow node is null or has no key property.');
        }

        $.extend(aNewNode, theNode);
        aNewNode.shadow = true;

        mShadowNodes[aNewNode.key] = {
            node: aNewNode,
            parent: theParent || $('#folders').fancytree('getRootNode')
        }
    };

    this.populateTree = function(theNodes) {
        if(theNodes && theNodes.length > 0) {
            mTreeData = theNodes;
            mRootNode = mTreeData[0];

            mSelf.refreshTree();

            console.debug('Tree has been populated.', mRootNode);
        }
    };

    this.init = function(theCodebot) {
        mCodebot     = theCodebot;
        mSelf        = this;
        mContextMenu = new CodebotContextMenu();

        $('#folders').append('<div class="message"></div>');

        mContextMenu.init(mCodebot);
        initPendingActivitiesBadge();
        initTree();

        // If a new project is open, clear the folder status cache.
        mCodebot.signals.projectOpened.add(function() {
            mFoldersState = null;
            mFoldersState = {};
        });
    };

    this.addPendingActivity = function(theKey, theName, theDescription) {
        mPendingActivities[theKey] = {
            name: theName, description: theDescription
        };

        refreshPendingActivitiesBadge();
    };

    this.removePendingActivity = function(theKey) {
        mPendingActivities[theKey] = null;
        refreshPendingActivitiesBadge();
    }

    this.__defineGetter__("contextMenu", function(){ return mContextMenu; });
    this.__defineGetter__("tree", function(){ return mTree.rootNode.children[0]; });
};
