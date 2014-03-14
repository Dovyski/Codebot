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
    var mUI = null;
    var mSelf = null;
    var mIds = 0;
    var mStack = [];
    
    var transform3d = function(theElementId, theX, theY, theZ) {
		document.getElementById(theElementId).style.WebkitTransform = 'translate3d('+ theX +','+ theY +','+ theZ +')';
	};
        
    var clearStates = function() {
        // TODO: remove all stack elements from dom
        $('#config-dialog').empty();
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
            var aStackTop = mStack[mStack.length - 1];
            
            $('#' + aStackTop).css('-webkit-transition', 'all 2000ms');
            $('#' + aStackTop).css('-webkit-transform', 'translate3d(-'+(aPanelWidth * 2)+'px, 0px, 0px)');
        }
        
        var aId = mIds++;
        var aContainerId = 'panel-content-' + aId;
        
        $('#config-dialog').append('<div id="' + aContainerId + '" style="position: absolute;"></div>');

        $('#' + aContainerId).css('left', aPanelWidth + 'px');
        theStateRender($('#' + aContainerId));
        
        mStack.push(aContainerId);
        
        setTimeout(function() {
            $('#' + aContainerId).css('-webkit-transition', 'all '+(mStack.length != 1 ? '2000' : '1')+'ms');
            $('#' + aContainerId).css( '-webkit-transform', 'translate3d(-'+aPanelWidth+'px, 0px, 0px)');
        }, 500);
    };
    
    this.popState = function() {
        var aPanelWidth = getSliderPanelWidth();
        
        for(var i = 0; i < 2; i++) {
            if(mStack.length > 0) {
                var aStackTop = mStack[mStack.length - 1 - i];

                $('#' + aStackTop).css('-webkit-transition', 'all 2000ms');
                $('#' + aStackTop).css('-webkit-transform', 'translate3d('+(i == 1 ? '-'+aPanelWidth+'px' : '0')+', 0px, 0px)');
            }
        }
        
        setTimeout(function() {
            var aElement = mStack.pop();
            $('#' + aElement).remove();
        }, 2000);
    };
    
    this.open = function(theStateRender) {
        clearStates();
        mSelf.pushState(theStateRender);
        
        // TODO: remove the hardcoded value
        transform3d('content', '-600px', '0', '0');
        transform3d('config-dialog', '-600px', '0', '0');
    };
    
    this.close = function() {
        transform3d('content', '0', '0', '0');
        transform3d('config-dialog', '0', '0', '0');
    }
    
    this.init = function(theUI) {
        mSelf = this;
        mUI = theUI;
    };
};