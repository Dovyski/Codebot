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
	var mSettings = null;
	var mSignals = null;
	var mJobs = null;
    var mPlugins = {active: {}, available: {}};
    var mSelf;

    var loadPlugins = function() {
        console.log('CODEBOT [plugins] Loading plugins...');

        mIO.readDirectory({path: 'codebot://./plugins'}, function(theData) {
            for(var i in theData[0].children) {
                var aItem = theData[0].children[i];

                if(aItem.title.lastIndexOf('.js') != -1) {
                    $('body').append('<script type="text/javascript" src="'+aItem.path+'"></script>');
                }
            }
        });

        console.log('CODEBOT [plugins] Plugins loaded.');
    };

	var handleError = function(theMsg, theUrl, theLineNumber) {
		console.error("Error occured: " + theMsg);
		return false;
	};

	this.loadScript = function(thePath) {
		console.log('CODEBOT [core] Loading script: ' + thePath);
		$('body').append('<script type="text/javascript" src="' + thePath + '"></script>');
	};

	this.loadStyle = function(thePath) {
		console.log('CODEBOT [core] Loading style: ' + thePath);
		$('body').append('<link href="' + thePath + '" rel="stylesheet" type="text/css">');
	};

    this.writeTabToDisk = function(theTab) {
		var aEditor = theTab.editor;

		if(aEditor) {
			mIO.writeFile(theTab.node, aEditor.getValue(), function() { theTab.setDirty(false); console.log('Tab data written to disk!');} );
		}
    };

    this.getPlugin = function(theId) {
        return mPlugins.active[theId];
    };

	this.addPlugin = function(thePluginInfo) {
		mPlugins.available[thePluginInfo.id] = thePluginInfo;
		console.log('CODEBOT [plugin] Added: ' + thePluginInfo.id);

		if(mSettings.get().plugins[thePluginInfo.id]) {
			console.log('CODEBOT [plugin] Activating ' + thePluginInfo.id + ' based on settings');

			mPlugins.active[thePluginInfo.id] = new thePluginInfo.className();
			mPlugins.active[thePluginInfo.id].init(mSelf);
		}
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

		// Make Codebot catch all erros.
		window.onerror = handleError;

		mSelf.setIODriver(theIODriver || new CodebotIO());

        mJobs = new CodebotJobs();
		mEditors = new Codebot.Editors();
        mShortcuts = new Codebot.Shortcuts();
        mUI = new CodebotUI();
		mSettings = new Codebot.Settings();
		mSignals = new CodebotSignals();

        mJobs.init();
		mSettings.init(mSelf);

        mSettings.load(function() {
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
	this.__defineGetter__("settings", function() { return mSettings; });
    this.__defineGetter__("shortcuts", function() { return mShortcuts; });
    this.__defineGetter__("signals", function() { return mSignals; });
    this.__defineGetter__("jobs", function() { return mJobs; });
};
