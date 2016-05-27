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

// Namespace for Codebot.Editor
var Codebot = Codebot || {};
Codebot.Editor = Codebot.Editor || {};

/**
 * A text editor based on Ace. It can be used to view or edit
 * any text-based file.
 *
 * @param  {[type]} theContainer [description]
 * @param  {[type]} theTab       [description]
 */
Codebot.Editor.Code = function(theContainer, theTab) {
	this.mContainer = theContainer;
	this.mTab = theTab;
	this.mAce = ace.edit(theTab.container);

	this.initInPlaceOverlay();
};

/**
 * Editor factory. This method can create a new instance of the audio editor.
 *
 * @param  {Codebot.Tab} theTab    The tab where this editor was placed.
 * @param  {Blob} theContent       The content of the file being opened.
 * @param  {Codebot.Node} theNode  The node (file) being opened.
 * @return {Codebot.Editor.Audio}
 */
Codebot.Editor.Code.create = function(theTab, theContent, theNode) {
    var aEditor = new Codebot.Editor.Code(theTab.container, theTab);

	aEditor.init();
    aEditor.load(theContent);

	return aEditor;
};


Codebot.Editor.Code.prototype.init = function() {
	var aSelf = this,
		aAce = this.mAce,
		i;

	aAce.setTheme("ace/theme/tomorrow_night_eighties"); // TODO: get theme from Codebot?
	aAce.getSession().setMode("ace/mode/javascript"); // TODO: choose mode based on file extension.
	aAce.getSession().setOption("useWorker", false);

	// TODO: remove this CODEBOT singleton call.
	for(i in CODEBOT.settings.get().editor) {
		aAce.setOption(i, CODEBOT.settings.get().editor[i]);
	}

	aAce.getSession().on('change', function(e) {
		aSelf.onContentChange(e);
	});

	aAce.getSession().selection.on('changeCursor', function(e) {
		aSelf.onCursorMove(e);
	});
};

Codebot.Editor.Code.prototype.load = function(theContent) {
	var aReader,
		aAce = this.mAce,
		aTab = this.mTab;

	if(theContent instanceof Blob) {
		aReader = new FileReader();
		aReader.readAsText(theContent);

		aReader.onloadend = function() {
			aAce.setValue(aReader.result);
			aAce.session.selection.clearSelection();
			aTab.setDirty(false);
		};
	} else {
		aAce.setValue(theContent);
		aAce.session.selection.clearSelection();
	}
};

Codebot.Editor.Code.prototype.initInPlaceOverlay = function() {
	var aId = 'cb-editor-code-overlay';

	this.mOverlay = $('#' + aId);

	if(this.mOverlay.length == 0) {
		$('#' + this.mContainer).append('<div id="' + aId + '" class="codebot-editor-incode-overlay" style="overlay: none; position: absolute; width: 200px; height: 200px; z-index: 9999;"></div>');
		this.mOverlay = $('#' + aId);
	}
};

Codebot.Editor.Code.prototype.onContentChange = function(theEvent) {
	this.mTab.setDirty(true);
};

Codebot.Editor.Code.prototype.onCursorMove = function(theEvent) {
	this.handleInteligentInPlaceTools(theEvent);
};

Codebot.Editor.Code.prototype.handleInteligentInPlaceTools = function(theEvent) {
	var aSelection = this.mAce.getSelectionRange(),
		aLine = aSelection.start.row,
		aCol = aSelection.start.column,
		aContent = this.mAce.getSession().getLine(aLine),
		aFragment = this.getInterestingFragmentAroundCursor(aContent, aCol);

	console.debug('Interesting fragment: ', aFragment);

	if(aFragment.match(/.*\.(png|jpe?g|gif)/g) != null) {
		this.showInPlaceImagePreview(aFragment);
	} else {
		this.mOverlay.fadeOut('fast');
	}
};

Codebot.Editor.Code.prototype.showInPlaceImagePreview = function(theImagePath) {
	this.mOverlay.html('<img src="https://cloud.githubusercontent.com/assets/512405/6548137/e344ebea-c5cd-11e4-800e-adfe8472884c.png" /><br />' + theImagePath);
	this.mOverlay.fadeIn('fast');

	this.placeElementAtCursorPosition(this.mOverlay);
};

Codebot.Editor.Code.prototype.lengthInPixels = function(theString, theUntilColumn) {
	var i,
		aTotal,
		aSize = 0,
		aTabSize = this.mAce.getSession().getTabSize(),
		aCharSize = 9;

	aTotal = theString.length;
	theUntilColumn = theUntilColumn || aTotal;

	for(i = 0; i < aTotal && i < theUntilColumn; i++) {
		if(theString.charAt(i) == '\t') {
			aSize += aTabSize * aCharSize;
		} else {
			aSize += aCharSize;
		}
	}

	return aSize;
};

Codebot.Editor.Code.prototype.placeElementAtCursorPosition = function(theElement, theOrientation) {
	var aSelection = this.mAce.getSelectionRange(),
		aCurrentLine = aSelection.start.row,
		aLineHeight = this.mAce.getFontSize() + 2,
		aLineContent = this.mAce.getSession().getLine(aCurrentLine),
		aRelativeLine,
		aTop,
		aLeft;

	aRelativeLine = aCurrentLine - this.mAce.getSession().getScrollTop() / aLineHeight;

	theOrientation = theOrientation || 'lineEndMiddle';

	// Default positioning: top-left corner of element stays at
	// the cursor position (as best as possible)
	aTop = aRelativeLine * aLineHeight + theElement.height() * 0.8;
	aLeft = this.lengthInPixels(aLineContent, aSelection.start.column) + theElement.width() / 2;

	switch (theOrientation) {
		case 'above':
			aTop -= theElement.height() + aLineHeight;
			break;
		case 'lineEndBelow':
		case 'lineEndAbove':
		case 'lineEndMiddle':
			aLeft = this.lengthInPixels(aLineContent) + theElement.width() / 2;

			if(theOrientation == 'lineEndMiddle') {
				aTop -= theElement.height() / 2;
			} else if(theOrientation == 'lineEndAbove'){
				aTop -= theElement.height() + aLineHeight * 2;
			}
			break;
		default:
	}

	theElement.css({top: aTop, left: aLeft});
};

Codebot.Editor.Code.prototype.getInterestingFragmentAroundCursor = function(theLineContent, theCursorPosition) {
	var aLeft = '',
		aRight = '',
		aChar = '',
		i;

	i = theCursorPosition - 1;
	while(i++ < theLineContent.length) {
		aChar = theLineContent.charAt(i);

		if(aChar == ' ' || aChar == '"' || aChar == '\'') { // TODO: improve those comparisons
			break;
		} else {
			aRight += aChar;
		}
	}

	i = theCursorPosition;
	while(i-- >= 0) {
		aChar = theLineContent.charAt(i);

		if(aChar == ' ' || aChar == '"' || aChar == '\'') { // TODO: improve those comparisons
			break;
		} else {
			aLeft = aChar + aLeft;
		}
	}

	return aLeft + aRight;
};
