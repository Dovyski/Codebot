/*
	The MIT License (MIT)

	Copyright (c) 2016 Fernando Bevilacqua

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

// Namespaces
Codebot.Settings = Codebot.Settings || {};
Codebot.Settings.Panel = Codebot.Settings.Panel || {};

/**
 * This panel control all settings related to the code editor.
 */
Codebot.Settings.Panel.Shortcuts = function() {
    // Call constructor of base class
    Codebot.Panel.call(this, 'Shortcuts settings');
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Codebot.Settings.Panel.Shortcuts.prototype = Object.create(Codebot.Panel.prototype);
Codebot.Settings.Panel.Shortcuts.prototype.constructor = Codebot.Settings.Panel.Shortcuts;

Codebot.Settings.Panel.Shortcuts.LABELS = {
    'saveActiveTab': 'Save active tab',
    'newFile': 'Create new file',
    'chooseFile': 'Open a file',
    'closeTab': 'Close current tab',
    'renameNode': 'Rename file',
    'exit': 'Quit',
};

Codebot.Settings.Panel.Shortcuts.prototype.render = function() {
    var aSettingsFromDisk,
        aBindings,
        aId;

    Codebot.Panel.prototype.render.call(this);

    aSettingsFromDisk = this.getContext().settings.get().shortcuts;
    aBindings = this.getContext().shortcuts.getBindings();

    for(aId in aSettingsFromDisk) {
        this.pair(
            Codebot.Settings.Panel.Shortcuts.LABELS[aId],
            '<input type="text" name="' + aId + '" value="' + aSettingsFromDisk[aId] + '"/>',
            {label: {style: 'width: 70%'}, content: {style: 'width: 25%'}}
        );
    }
};

Codebot.Settings.Panel.Shortcuts.prototype.onDestroy = function() {
    var aSettings = this.getData();

    this.getContext().settings.set({shortcuts: aSettings});
    this.getContext().settings.saveToDisk();
};
