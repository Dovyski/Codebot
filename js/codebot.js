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
    var mPlugins = {};
    var mPreferences = {}; // TODO: default prefs here?
    var mSelf;
    
    var loadPreferences = function(theCallback) {
        console.log('CODEBOT [prefs] Loading preferences...');
        
        // TODO: read another preference file?
        mIO.readFile({path: './data/prefs.default.json'}, function(theData) {
            eval('CODEBOT.setPrefs('+theData+')');
            console.log('CODEBOT [prefs] Preferences loaded!', CODEBOT.getPrefs());
            theCallback();
        });
    };
    
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
			mIO.writeFile(theTab, aEditor.getValue(), function() { console.log('Tab data written to disk!');} );
		}
    };
        
    this.getPlugin = function(theId) {
        return mPlugins[theId];
    };
	
	this.addPlugin = function(theObj) {
		console.log('CODEBOT [plugin added] ' + theObj.id);
		
		mPlugins[theObj.id] = theObj;
		
        CODEBOT.utils.invoke(mPlugins[theObj.id], 'init', {
            ui: mUI,
            panel: mUI.slidePanel
        });
	};
    
    this.getPrefs = function() {
        return mPreferences;
    };
    
    this.setPrefs = function(theObj) {
        mPreferences = theObj;
    };
    
    this.showDebugger= function() {
        if(typeof(require) == 'function') {
            var aGui = require('nw.gui');
            var aWin = aGui.Window.get();

            aWin.showDevTools();
        }
    };
    
    this.createEditor = function(theContainer, theContent, theNode) {
        var aEditorPrefs = {};
        
        $.extend(aEditorPrefs, mSelf.getPrefs().editor);

        var editor = ace.edit(theContainer);
        editor.setTheme("ace/theme/twilight");
        editor.getSession().setMode("ace/mode/javascript");
        editor.setValue(theContent);
        
        editor.session.selection.clearSelection();

        for(var i in aEditorPrefs) {
            editor.setOption(i, aEditorPrefs[i]);
        }
        
        return editor;
    };
	
	this.init = function(theIODriver) {
        console.log('CODEBOT [core] Initializing...');		
        
        mSelf = this;
        
        mIO = theIODriver || new CodebotIO();
        console.log('CODEBOT [IO driver] ' + mIO.driver);
        mIO.init();
        
        mEditors = new CodebotEditors();
        mShortcuts = new CodebotShortcuts();
        mUI = new CodebotUI();
        
        loadPreferences(function() {
            mEditors.init(mPreferences);
            mUI.init(mIO, mEditors);
            
            loadPlugins();
            
            mShortcuts.init(mUI, mIO, mPreferences);
            
            console.log('CODEBOT [core] Done, ready to rock!');
            
            mSelf.showDebugger();
        });
	};
};