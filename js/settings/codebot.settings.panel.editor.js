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
Codebot.Settings.Panel.Editor = function() {
    // Call constructor of base class
    Codebot.Panel.call(this, 'Editor settings');

    // From: https://github.com/ajaxorg/ace/wiki/Configuring-Ace
    // Where not indicated otherwise option values are boolean.
    this.mEditorPrefs = {
        // Editor
        selectionStyle: {name: 'Selection style', value: ['line', 'text']},
        highlightActiveLine: {name: 'Hightlight active line', value: true},
        highlightSelectedWord: {name: 'Hightlight selected word', value: true, tip: 'This is a tip.'},
        cursorStyle: {name: 'Cursor style', value: ['ace', 'slim', 'smooth', 'wide']},
        behavioursEnabled: {name: 'behavioursEnabled', value: true},
        wrapBehavioursEnabled: {name: 'wrapBehavioursEnabled', value: false},

        // Renderer
        hScrollBarAlwaysVisible: {name: 'hScrollBarAlwaysVisible', value: true},
        vScrollBarAlwaysVisible: {name: 'vScrollBarAlwaysVisible', value: true},
        highlightGutterLine: {name: 'highlightGutterLine', value: true},
        animatedScroll: {name: 'animatedScroll', value: true},
        showInvisibles: {name: 'showInvisibles', value: false},
        showPrintMargin: {name: 'showPrintMargin', value: null},
        printMarginColumn: {name: 'printMarginColumn', value: 'renderer'},
        printMargin: {name: 'printMargin', value: true},
        fadeFoldWidgets: {name: 'fadeFoldWidgets', value: false},
        showFoldWidgets: {name: 'showFoldWidgets', value: true},
        showLineNumbers: {name: 'showLineNumbers', value: true},
        showGutter: {name: 'showGutter', value: false},
        displayIndentGuides: {name: 'displayIndentGuides', value: false},
        fontSize: {name: 'fontSize', value: 20},
        //fontFamily: {name: 'fontFamily', value: ''},
        //maxLines: {name: 'maxLines', value: null},
        //minLines: {name: 'minLines', value: null},
        scrollPastEnd: {name: 'scrollPastEnd', value: false},
        fixedWidthGutter: {name: 'fixedWidthGutter', value: null},
        theme: {name: 'theme', value: ['ace/theme/tomorrow_night_eighties']},

        // session
        firstLineNumber: {name: 'firstLineNumber', value: 1},
        newLineMode: {name: 'newLineMode', value: ['auto', 'windows', 'unix']},
        useWorker: {name: 'useWorker', value: false},
        useSoftTabs: {name: 'useSoftTabs', value: false},
        tabSize: {name: 'tabSize', value: 4},
        wrap: {name: 'wrap', value: false},
        foldStyle: {name: 'foldStyle', value: null},
    };
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Codebot.Settings.Panel.Editor.prototype = Object.create(Codebot.Panel.prototype);
Codebot.Settings.Panel.Editor.prototype.constructor = Codebot.Settings.Panel.Editor;

Codebot.Settings.Panel.Editor.prototype.convertConfigOptionToFormElement = function(theConfigId, theConfigDescription, theDiskValue) {
    var aValue = theConfigDescription.value;
    var aRet = '';

    if(aValue instanceof Array) {
        aRet = '<select name="'+theConfigId+'">';
        for(var i = 0; i < aValue.length; i++) {
            aRet += '<option value="' + aValue[i] + '" '+(theDiskValue == aValue[i] ? ' selected="selected" ' : '')+'>' + aValue[i] + '</option>';
        }
        aRet += '</select>';

    } else if(aValue === null || typeof aValue == 'boolean') {
        aRet = '<input type="checkbox" style="margin-top: -5px" name="' + theConfigId + '" '+(Boolean(theDiskValue) ? ' checked="checked" ' : '')+' />';

    } else {
        aRet = '<input type="text" class="form-control input-sm" style="margin-top: -5px;" name="' + theConfigId + '" value="' + theDiskValue + '" />';
    }

    return aRet;
};

Codebot.Settings.Panel.Editor.prototype.render = function() {
    var aPrefsFromDisk,
        aId,
        aValue,
        aEntry,
        aTip,
        aForm;

    Codebot.Panel.prototype.render.call(this);

    aPrefsFromDisk = CODEBOT.settings.get().editor;

    for(aId in this.mEditorPrefs) {
        aEntry = this.mEditorPrefs[aId];
        aTip = aEntry.tip ? ' <i class="fa fa-question-circle" style="color: #cfcfcf;" title="' + aEntry.tip + '"></i>' : '';
        aValue = aPrefsFromDisk[aId];
        aForm = this.convertConfigOptionToFormElement(aId, aEntry, aValue);

        this.pair(aEntry.name + aTip, aForm, {label: {style: 'width: 60%'}, content: {style: 'width: 30%'}});
    }
};

Codebot.Settings.Panel.Editor.prototype.onDestroy = function() {
    var aSettings = this.getData();

    this.getContext().settings.set({editor: aSettings});
    this.getContext().settings.saveToDisk();
};
