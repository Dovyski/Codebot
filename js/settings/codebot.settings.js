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

/**
 * Handle all things settings, e.g. code editor preferences, etc.
 */
Codebot.Settings = function() {
    var mSelf,
        mSections,
        mCodebot,
        mData,
        mSections;
};

Codebot.Settings.prototype.init = function(theCodebot) {
    mSelf = 0;
    mSections = {};
    mCodebot = theCodebot;
    mData = {};
    mSections = {};

    this.addSection({id: 'editor', title: 'Editor', icon: '<i class="fa fa-code fa-lg"></i>', panel: Codebot.Settings.Panel.Editor});
    this.addSection({id: 'shortcuts', title: 'Shortcuts', icon: '<i class="fa fa-keyboard-o fa-lg"></i>', panel: Codebot.Settings.Panel.Shortcuts});
    this.addSection({id: 'appearance', title: 'UI and Appearance', icon: '<i class="fa fa-picture-o fa-lg"></i>', panel: Codebot.Settings.Panel.UI});
    this.addSection({id: 'plugins', title: 'Plugins', icon: '<i class="fa fa-puzzle-piece fa-lg"></i>', panel: Codebot.Settings.Panel.Plugins});
};

Codebot.Settings.prototype.saveToDisk = function() {
    console.debug('CODEBOT [settings] Saving to disk.');

    mCodebot.io.writeFile({path: 'codebot://settings.json'}, JSON.stringify(mData), function() {
        console.log('CODEBOT [settings] Saved to disk.');
    });
};

Codebot.Settings.prototype.get = function() {
    return mData;
};

Codebot.Settings.prototype.set = function(theObj) {
    $.extend(true, mData, theObj);

    console.debug('CODEBOT [settings] Change: ', theObj);

    // Tell everybody that the preferences have been updated.
    mCodebot.signals.preferencesUpdated.dispatch(theObj);

    // Make it possible to chain methods
    return this;
};

Codebot.Settings.prototype.load = function(theCallback) {
    var aSelf = this,
        aCodebot = mCodebot;

    console.log('CODEBOT [settings] Loading...');

    // First of all, load the default settings
    aCodebot.io.readFile({path: 'codebot://settings.default.json'}, function(theDefault) {
        aSelf.set(JSON.parse(theDefault));

        aCodebot.io.readFile({path: 'codebot://settings.json'}, function(theData) {
            aSelf.set(JSON.parse(theData));
            console.log('CODEBOT [settings] Loaded and ready', aSelf.get());
            theCallback();
        });
    });
};

/**
 * Adds a new section to the settings panel. A section is a link that, when clicked, opens
 * a new panel with more information (e.g. Code editor settings).
 *
 * @param {Object} theObj - an object describing the new section. It has the following structure: <code>{id: string, title: string, icon: string, panel: Codebot.Panel}</code>. The <code>panel</code> property should be a reference to a class that extends <code>Codebot.Panel</code>.
 */
Codebot.Settings.prototype.addSection = function(theObj) {
    mSections[theObj.id] = theObj;
};

/**
 * [function description]
 *
 * @param  {[type]} theObj [description]
 * @return {[type]}        [description]
 */
Codebot.Settings.prototype.getSections = function(theObj) {
    return mSections;
};
