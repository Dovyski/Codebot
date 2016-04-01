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
Codebot.Settings.Panel.UI = function() {
    // Call constructor of base class
    Codebot.Panel.call(this, 'UI settings');
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Codebot.Settings.Panel.UI.prototype = Object.create(Codebot.Panel.prototype);
Codebot.Settings.Panel.UI.prototype.constructor = Codebot.Settings.Panel.UI;

Codebot.Settings.Panel.UI.prototype.render = function() {
    var aSettings;

    Codebot.Panel.prototype.render.call(this);

    aSettings = CODEBOT.settings.get().ui;

    this.pair(
        'Use animation',
        '<input type="checkbox" style="margin-top: -5px" name="slidePanelAnimation" '+(Boolean(aSettings.slidePanelAnimation) ? ' checked="checked" ' : '')+' />',
        {label: {style: 'width: 60%'}, content: {style: 'width: 30%'}}
    );

    this.pair(
        'Animation duration (ms)',
        '<input type="text" class="form-control input-sm" style="margin-top: -5px;" name="slidePanelAnimationDuration" value="' + aSettings.slidePanelAnimationDuration + '" />',
        {label: {style: 'width: 60%'}, content: {style: 'width: 30%'}}
    );
};

Codebot.Settings.Panel.UI.prototype.onDestroy = function() {
    var aSettings = this.getData();
    this.getContext().settings.set({ui: aSettings}).saveToDisk();
};
