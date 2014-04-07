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

var CodebotPreferences = function() {
    var mSelf = 0;
    var mCodebot = null;
    var mData = {};
    
    this.get = function() {
        return mData;
    };
    
    this.set = function(theObj) {
        $.extend(true, mData, theObj);
    };
    
    this.renderMainPanel = function(theContainer, theContext) {        
        theContainer.append('<a href="#" id="myLink">pushState()<a/>');
        theContainer.append('<a href="#" id="myAnotherPopHere">popState()<a/>');
        theContainer.css('background', '#ff0000');
        theContainer.css('width', '100%');
        theContainer.css('height', '100%');
        
        $('#myLink').click(function() {
            theContext.ui.slidePanel.pushState(mSelf.renderAnotherPanel);
        });
        
        $('#myAnotherPopHere').click(function() {
            theContext.ui.slidePanel.popState();
        });
    };
    
    this.load = function(theCallback) {
        console.log('CODEBOT [prefs] Loading preferences...');
        
        // TODO: fix this, it breaks IO layer
        mCodebot.io.readFile({path: './data/prefs.default.json'}, function(theData) {
            eval('mSelf.set('+theData+')');
            console.log('CODEBOT [prefs] Preferences loaded!', mSelf.get());
            theCallback();
        });
    };
    
    this.init = function(theCodebot) {
        mSelf = this;
        mCodebot = theCodebot;
    };
};