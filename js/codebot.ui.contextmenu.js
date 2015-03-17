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

var CodebotContextMenu = function() {
    var mCodebot = null;
    var mItems   = {};
    var mSelf    = this;

    var handleAction = function(theNode, theAction, theOptions) {
        console.debug('Selected action "' + theAction + '" on node ', theNode, theNode.data);

        if(mItems[theAction].action) {
            mItems[theAction].action(theNode.data);
        }
    };

    var doRename = function(theNode) {
        theNode.startEdit();
    };

    var doDelete = function(theNode) {
        mCodebot.ui.showDialog({
            keyboard: true,
            title: 'Delete',
            content: 'Are you sure you want to delete this?',
            buttons: {
                'Yes': {css: 'btn-info', dismiss: true, callback: function() {
                    mCodebot.io.delete(theNode, function(e) {
                        if(e) {
                            console.log('Something went wrong when deleting file: ' + e);
                        } else {
                            mCodebot.ui.filesPanel.refreshTree();
                        }
                    });
                }},
                'No': {css: 'btn-default', dismiss: true}
            }
        });
    };

    var doNewFile = function(theNode) {
        var aName = prompt('File name');
        mCodebot.io.createFile(aName, theNode, '', function(theInfo) {
            if(theInfo instanceof Error) {
                console.error('Problem with createFile!' + theInfo);
            } else {
                mCodebot.ui.filesPanel.refreshTree();
                // TODO: open node in new tab
            }
        });
    };

    var doNewFolder = function(theNode) {
        var aName = prompt('Directory name');
        mCodebot.io.createDirectory(aName, theNode, function(theInfo) {
            if(theInfo instanceof Error) {
                console.error('Problem with createDirectory!' + theInfo);
            } else {
                mCodebot.ui.filesPanel.refreshTree();
            }
        });
    };

    var generateMenuItems = function(theNode) {
        var aNode = theNode;
        var aMenu = {};

        for(var aKey in mItems) {
            if(!mItems[aKey].hide && (!mItems[aKey].regex || mItems[aKey].regex.test(aNode.name))) {
                // A registered item has interest on this node.
                // Add the registered item to the menu then.
                aMenu[aKey] = mItems[aKey];
            }
        }

        return aMenu;
    };

    this.addItem = function(theKey, theOptions) {
        mItems[theKey] = theOptions;

        // Add subitems if they exist.
        if(theOptions.items) {
            for(var aKey in theOptions.items) {
                mItems[aKey] = theOptions.items[aKey];
                mItems[aKey].hide = true;
            }
        }
    };

    this.create = function() {
        mSelf.addItem('edit', {regex: /.*/, name: 'Edit', icon: 'edit', action: null});
        mSelf.addItem('rename', {regex: /.*/, name: 'Rename', icon: 'rename', action: doRename});
        mSelf.addItem('delete', {regex: /.*/, name: 'Delete', icon: 'delete', action: doDelete});

        mSelf.addItem('sep1', '--------');

        mSelf.addItem('new', {
            regex: /.*/,
            name: 'New',
            items: {
                'new-folder': { 'name': 'Folder', action: doNewFolder },
                'new-file': { 'name': 'File', action: doNewFile }
            }
        });

        mSelf.addItem('sep2', '--------');

        return {
            menu: generateMenuItems,
            actions: handleAction
        };
    };

    this.init = function(theCodebot) {
        mCodebot = theCodebot;
    };
};
