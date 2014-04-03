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

/**
 * This is a boilerplate for plugin creation.
 */
var DummyPlugin = function() {
    this.id         = 'cc.codebot.dummy';
    
    var mSelf       = null;
    var mContext    = null;
    
    this.init = function(theContext) {
        console.debug('DummyPlugin::init()');

        mSelf = this;
        mContext = theContext;

        mContext.ui.addButton({
            icon: 'puzzle-piece',
            customIcon: 'R',
            //action: mSelf.anotherMethod,
            panel: mSelf.renderPanel
        });
    };
    
    this.anotherMethod = function() {
        mContext.ui.showDialog({
            title: 'Dialog',
            content: 'Hello world!',
            buttons: {
                'Ok, got it!': {dismiss: true}
            }
        });
    };
        
    this.renderPanel = function(theContainer) {        
        theContainer.append('<a href="#" id="myLink">pushState()<a/>');
        theContainer.append('<a href="#" id="myAnotherPopHere">popState()<a/>');
        theContainer.css('background', '#ff0000');
        theContainer.css('width', '100%');
        theContainer.css('height', '100%');
        
        $('#myLink').click(function() {
            console.log('HERE!', mContext);
            mContext.ui.slidePanel.pushState(mSelf.renderAnotherPanel);
        });
        
        $('#myAnotherPopHere').click(function() {
            mContext.ui.slidePanel.popState();
        });
    };
    
    this.renderAnotherPanel = function(theContainer) {
        theContainer.css('background', '#00ff00');
        //theContainer.css('width', '100%');
        //theContainer.css('height', '100%');
        theContainer.append('<a href="#" id="myAnother">pushState()<a/>');
        theContainer.append('<a href="#" id="myAnotherPop">popState()<a/>');
        
        $('#myAnother').click(function() {
            console.log('HERE!', mContext);
            mContext.ui.slidePanel.pushState(mSelf.renderAnotherNewPanel);
        });
        
        $('#myAnotherPop').click(function() {
            console.log('HERE!', mContext);
            mContext.ui.slidePanel.popState();
        });
    };
    
    this.renderAnotherNewPanel = function(theContainer) {
        theContainer.css('background', '#0d00cf');
        theContainer.html('<a href="#" id="myAnotherNew">popState()<a/>');
        
        $('#myAnotherNew').click(function() {
            console.log('HERE!', mContext);
            mContext.ui.slidePanel.popState();
        });
    };
};

CODEBOT.addPlugin(new DummyPlugin());