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

var CODEBOT = new function() {
	var mShortcuts = null;
	var mUI = null;
	var mIO = null;
	var mEditors = null;
	var mPreferences = null;
	var mSignals = null;
    var mPlugins = {};
    var mSelf;

    var loadPlugins = function() {
        console.log('CODEBOT [plugins] Loading plugins...');

        // TODO: fix the {path: , etc} below because it breaks IO layer.
        mIO.readDirectory({path: './plugins'}, function(theData) {
            for(var i in theData[0].children) {
                var aItem = theData[0].children[i];

                if(aItem.title.lastIndexOf('.js') != -1) {
                    $('body').append('<script type="text/javascript" src="'+aItem.path+'"></script>');
                }
            }
        });

        console.log('CODEBOT [plugins] Plugins loaded.');
    };

    this.writeTabToDisk = function(theTab) {
		var aEditor = theTab.editor;

		if(aEditor) {
			// TODO: change to theTab.node?
			mIO.writeFile(theTab, aEditor.getValue(), function() { theTab.setDirty(false); console.log('Tab data written to disk!');} );
		}
    };

    this.getPlugin = function(theId) {
        return mPlugins[theId];
    };

	this.addPlugin = function(theObj) {
		console.log('CODEBOT [plugin added] ' + theObj.id);

		mPlugins[theObj.id] = theObj;

        CODEBOT.utils.invoke(mPlugins[theObj.id], 'init', mSelf);
	};

    this.showDebugger= function() {
        if(typeof(require) == 'function') {
            var aGui = require('nw.gui');
            var aWin = aGui.Window.get();

            aWin.showDevTools();
        }
    };

	this.setIODriver = function(theIODriver) {
		mIO = theIODriver;
		console.log('CODEBOT [IO driver] ' + mIO.driver);
		mIO.init();
	};

	this.init = function(theIODriver) {
        console.log('CODEBOT [core] Initializing...');

        mSelf = this;

		mSelf.setIODriver(theIODriver || new CodebotIO());

        mEditors = new CodebotEditors();
        mShortcuts = new CodebotShortcuts();
        mUI = new CodebotUI();
        mPreferences = new CodebotPreferences();
		mSignals = new CodebotSignals();

        mPreferences.init(mSelf);

        mPreferences.load(function() {
            mEditors.init(mSelf);
            mUI.init(mSelf);

            loadPlugins();

            mShortcuts.init(mSelf);

            console.log('CODEBOT [core] Done, ready to rock!');
			mSignals.ready.dispatch();

            mSelf.showDebugger();
        });
	};

    // getters
    this.__defineGetter__("editors", function() { return mEditors; });
    this.__defineGetter__("ui", function() { return mUI; });
    this.__defineGetter__("io", function() { return mIO; });
    this.__defineGetter__("preferences", function() { return mPreferences; });
    this.__defineGetter__("signals", function() { return mSignals; });
};
