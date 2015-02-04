/*
	The MIT License (MIT)

	Copyright (c) 2015 Fernando Bevilacqua

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

/**
 * The bare minimum to use codebot as a IDE (save buttons, etc)
 */
var CoreIdePlugin = function() {
    this.id         = 'cc.codebot.core.ide';

    var mSelf       = null;
    var mContext    = null;

    this.init = function(theContext) {
        console.debug('CoreIdePlugin::init()');

        mSelf = this;
        mContext = theContext;

        mContext.ui.addButton({ icon: '<i class="fa fa-folder-open"></i>', action: mSelf.openFolder });
        mContext.ui.addButton({ icon: '<i class="fa fa-floppy-o"></i>', action: mSelf.save });
        mContext.ui.addButton({ icon: '<i class="fa fa-play"></i>', action: mSelf.build });
        mContext.ui.addButton({ icon: '<i class="fa fa-wrench"></i>', action: mSelf.settings });
    };

    this.openFolder = function() {
        mContext.ui.filesPanel.showChooseDirectoryDialog();
    };

    this.save = function() {
        var aTab = mContext.ui.tabs.active;

        if(aTab) {
            mContext.writeTabToDisk(aTab);
        }
    };

    this.build = function() {
        var aTab = null;

        aTab = mContext.ui.tabs.add({
            favicon: 'file-text-o', // TODO: dynamic icon?
            title: 'Build',
            file: 'Build.log',
            path: 'build.log',
            node: null,
            editor: null
        });

        aTab.editor = mContext.editors.create(aTab, 'Build started...', {name: 'Mode.swf'});

        mContext.io.build(function(theData) {
            console.log(theData);
            aTab.editor.setContent(theData);
        });
    };

    this.settings = function() {
        mContext.ui.showDialog({
            title: 'Settings',
            content: 'Show project settings.',
            buttons: {
                'Ok, got it!': {dismiss: true}
            }
        });
    };

};

CODEBOT.addPlugin(new CoreIdePlugin());
