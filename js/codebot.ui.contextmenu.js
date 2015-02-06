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
    var mSelf    = null;

    var handleAction = function(theNode, theAction, theOptions) {
        console.debug('Selected action "' + theAction + '" on node ', theNode, theNode.data);

        switch(theAction) {
            case 'new-folder':
                var aName = prompt('Directory name');
                mCodebot.io.createDirectory(aName, theNode.data, function(theInfo) {
                    if(theInfo instanceof Error) {
                        console.error('Problem with createDirectory!' + theInfo);
                    } else {
                        mCodebot.ui.filesPanel.refreshTree();
                    }
                });
                break;
            case 'new-file':
                var aName = prompt('File name');
                mCodebot.io.createFile(aName, theNode.data, '', function(theInfo) {
                    if(theInfo instanceof Error) {
                        console.error('Problem with createFile!' + theInfo);
                    } else {
                        mCodebot.ui.filesPanel.refreshTree();
                        // TODO: open node in new tab
                    }
                });
                break;
            case 'rename':
                theNode.startEdit();
                break;

            case 'delete':
                mCodebot.ui.showDialog({
                    keyboard: true,
                    title: 'Delete',
                    content: 'Are you sure you want to delete this?',
                    buttons: {
                        'Yes': {css: 'btn-info', dismiss: true, callback: function() {
                            mCodebot.io.delete(theNode.data, function(e) {
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
                break;
        }
    };

    this.create = function() {
        return {
            menu: {
                'edit': { 'name': 'Edit', 'icon': 'edit' },
                'rename': { 'name': 'Rename', 'icon': 'rename' },
                'delete': { 'name': 'Delete', 'icon': 'delete' },
                'sep1': '---------',
                'new': {
                    'name': 'New',
                    'items': {
                        'new-folder': { 'name': 'Folder' },
                        'new-file': { 'name': 'File' }
                    }
                }
            },
            actions: handleAction
        };
    };

    this.init = function(theCodebot) {
        mSelf    = this;
        mCodebot = theCodebot;
    };
};
