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

var CodebotSlidePanel = function() {
    var SLIDE_DURATION = 500; // in ms

    var mCodebot = null;
    var mSelf = null;
    var mIds = 0;
    var mStack = [];
    var mCurrentStateRender = null;

    var transform3d = function(theElementId, theX, theY, theZ) {
		document.getElementById(theElementId).style.WebkitTransform = 'translate3d('+ theX +','+ theY +','+ theZ +')';
	};

    var slideElement = function(theId, theX, theDuration) {
        $('#' + theId).css({
            '-webkit-transition': 'all ' + (theDuration || SLIDE_DURATION) + 'ms',
            '-webkit-transform': 'translate3d('+theX+'px, 0px, 0px)'
        });
    }

    var clearStates = function() {
        $('#config-dialog').empty();

        for(var i = 0; i < mStack.length; i++) {
            $('#' + mStack[i]).remove();
        }
        mStack.splice(0);
    };

    var getSliderPanelWidth = function() {
        return $('#config-dialog').width();
    };

    this.pushState = function(theStateRender) {
        var aPanelWidth = getSliderPanelWidth();

        if(!theStateRender || typeof(theStateRender) != 'function') {
            console.error('Unable to push slide panel state. The provided state render is invalid: it should be a function, e.g. func(jQueryNode).');
            return;
        }

        if(mStack.length > 0) {
            slideElement(mStack[mStack.length - 1], aPanelWidth * -2);
        }

        var aId = mIds++;
        var aContainerId = 'panel-content-' + aId;

        $('#config-dialog').append('<div id="' + aContainerId + '" class="content-slide-panel"></div>');

        $('#' + aContainerId).css('left', aPanelWidth + 'px');
        theStateRender($('#' + aContainerId), mCodebot);

        mStack.push(aContainerId);

        mCurrentStateRender = theStateRender;

        setTimeout(function() {
            slideElement(aContainerId, -aPanelWidth, mStack.length != 1 ? SLIDE_DURATION : 1);
        }, 50);
    };

    this.popState = function() {
        var aPanelWidth = getSliderPanelWidth();

        if(mStack.length == 1) {
            mSelf.close();

        } else {
            for(var i = 0; i < 2; i++) {
                if(mStack.length > 0) {
                    var aStackTop = mStack[mStack.length - 1 - i];
                    slideElement(aStackTop, i == 1 ? -aPanelWidth : 0);
                }
            }

            mCurrentStateRender = mStack[mStack.length - 1];
        }

        setTimeout(function() { $('#' + mStack.pop()).remove(); }, SLIDE_DURATION);
    };

    this.open = function(theStateRender, theForce) {
        if(!theForce) {
            if(mCurrentStateRender == theStateRender) {
                // Trying to open an already open panel. Let's close it then.
                mSelf.close();
                return;
            }
        }

        clearStates();
        mSelf.pushState(theStateRender);

        slideElement('content', -getSliderPanelWidth());
        slideElement('config-dialog', -getSliderPanelWidth());
    };

    this.close = function() {
        slideElement('content', 0);
        slideElement('config-dialog', 0);

        if(mStack.length == 1) {
            mCurrentStateRender = null;
        }
    }

    this.init = function(theCodebot) {
        mSelf = this;
        mCodebot = theCodebot;
    };
};
