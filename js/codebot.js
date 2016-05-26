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
    var mPlugins = null;
    var mSelf;

	var handleError = function(theMsg, theUrl, theLineNumber) {
		// Show some nice information to the user
		mUI.toast(Codebot.UI.TOAST_ERROR, '<h2>An error just occured</h2><p>' + theMsg + '</p>');

		// Log the error and run in circles \o/
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
		mPlugins = new Codebot.Plugins();

        mJobs.init();
		mSettings.init(mSelf);

        mSettings.load(function() {
            mEditors.init(mSelf);
            mUI.init(mSelf);
			mPlugins.init(mSelf);

            mPlugins.load();
            mShortcuts.init(mSelf);

            console.log('CODEBOT [core] Done, ready to rock!');
			mSignals.ready.dispatch();

			// Remove the loading icon
			$('#loading').fadeOut();
			$('#wrapper').show();

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
    this.__defineGetter__("plugins", function() { return mPlugins; });
};
