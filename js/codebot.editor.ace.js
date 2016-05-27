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
		console.log(theContent);
		aAce.setValue(theContent);
		aAce.session.selection.clearSelection();
	}
};

Codebot.Editor.Code.prototype.onContentChange = function(theEvent) {
	this.mTab.setDirty(true);
};

Codebot.Editor.Code.prototype.onCursorMove = function(theEvent) {
	var aCurrentLine = this.mAce.getSelectionRange().start.row;
	console.log(this.mAce.getSession().getLine(aCurrentLine), this.mAce.getCursorPositionScreen());
};
