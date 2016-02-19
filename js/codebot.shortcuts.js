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

var Codebot = Codebot || {};

/**
 * Handle all actions related to shortcuts/keybindings
 */
Codebot.Shortcuts = function() {
    var mCodebot,
        mBindings;
};

Codebot.Shortcuts.prototype.saveActiveTab = function() {
    var aTab = mCodebot.ui.tabs.active;

    if(aTab) {
        mCodebot.writeTabToDisk(aTab);
    }

    console.debug('Save active tab to disk.');
};

Codebot.Shortcuts.prototype.newFile = function() {
    console.debug('Open new tab with empty file');
};

Codebot.Shortcuts.prototype.chooseFile = function() {
    console.debug('Show dialog to open file');
};

Codebot.Shortcuts.prototype.renameNode = function() {
    mCodebot.ui.filesPanel.renameFocusedNode();
    console.debug('Rename node');
};

Codebot.Shortcuts.prototype.exit = function() {
    console.debug('Exit application!');
    return false;
};

Codebot.Shortcuts.prototype.closeTab = function() {
    var aTab = mCodebot.ui.tabs.active;

    if(aTab) {
        mCodebot.ui.tabs.remove(aTab);
    }

    console.debug('Close current tab!');
    return false; // prevent browser's default behavior
};

Codebot.Shortcuts.prototype.createKeyBindingsFromSettings = function() {
    var aShortcuts = mCodebot.settings.get().shortcuts,
        aCommand = null,
        aKey = null;

    for(aCommand in aShortcuts) {
        aKey = aShortcuts[aCommand];

        if(typeof this[aCommand] == 'function') {
            this.set(aCommand, aKey, this[aCommand], this);

        } else {
            console.warn('CODEBOT [keybind] Unknown command "' + aCommand + '" to bind to "' + aKey + '"');
        }
    }
};

Codebot.Shortcuts.prototype.handleBindPressed = function(theEvent, theKeys) {
    var aAction,
        aEntry;

    // Stop usual broser behavior.
    theEvent.preventDefault();

    for(aAction in mBindings) {
        if(mBindings[aAction].key == theKeys) {
            console.debug('CODEBOT [shortcut] ' + aAction);
            mBindings[aAction].callback.call(mBindings[aAction].context);
            break;
        }
    }
};

Codebot.Shortcuts.prototype.set = function(theAction, theKey, theCallback, theCallbackContext) {
    mBindings[theAction] = {
        key: theKey,
        callback: theCallback,
        context: theCallbackContext
    };

    Mousetrap.bindGlobal(theKey, this.handleBindPressed);
    console.debug('CODEBOT [keybind] ' + theKey + ' = ' + theAction);
};

Codebot.Shortcuts.prototype.getBindings = function() {
    return mBindings;
};

Codebot.Shortcuts.prototype.init = function(theCodebot) {
    mCodebot = theCodebot;
    mBindings = {};

    this.createKeyBindingsFromSettings();
};
