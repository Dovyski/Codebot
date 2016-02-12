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
        mData;
};

Codebot.Settings.prototype.init = function(theCodebot) {
    mSelf = 0;
    mSections = {};
    mCodebot = theCodebot;
    mData = {};
};


Codebot.Settings.prototype.saveToDisk = function() {
    mCodebot.io.writeFile({path: 'codebot://./data/prefs.default.json'}, JSON.stringify(mData), function() {
        console.log('CODEBOT [prefs] Saved to disk');
    });
};

Codebot.Settings.prototype.get = function() {
    return mData;
};

Codebot.Settings.prototype.set = function(theObj) {
    $.extend(true, mData, theObj);
};

// TODO: remove this method, I think...
Codebot.Settings.prototype.add = function(theKey, theValue) {
    mData[theKey] = theValue;
    console.log('CODEBOT [prefs] Entry updated:', theKey, theValue);

    // Tell everybody that the preferences have been updated.
    mCodebot.signals.preferencesUpdated.dispatch([theKey, theValue]);

    this.saveToDisk();
};

Codebot.Settings.prototype.load = function(theCallback) {
    var aSelf = this;

    console.log('CODEBOT [prefs] Loading preferences...');

    // TODO: fix this, it breaks IO layer
    mCodebot.io.readFile({path: 'codebot://./data/prefs.default.json'}, function(theData) {
        eval('aSelf.set('+theData+')');
        console.log('CODEBOT [prefs] Preferences loaded!', aSelf.get());
        theCallback();
    });
};
