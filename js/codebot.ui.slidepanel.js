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
    
    var transform3d = function(theElementId, theX, theY, theZ) {
		document.getElementById(theElementId).style.WebkitTransform = 'translate3d('+ theX +','+ theY +','+ theZ +')';
	};
    
    this.pushState = function() {
        // TODO: implement this.
        $('#panel-fr').css( '-webkit-transition', 'all 500ms');
        $('#panel-fr').css( '-webkit-transform', 'translate3d(-600px, 0px, 0px)');
    };
    
    this.popState = function() {
        // TODO: implement this.
    };
    
    this.open = function(theContent) {
        $('#config-dialog').html(theContent);

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