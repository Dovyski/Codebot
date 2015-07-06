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

var CodebotPreferencesUI = function() {
    var mSelf = 0;
    var mSections = {};
    var mCodebot = null;

    // From: https://github.com/ajaxorg/ace/wiki/Configuring-Ace
    // Where not indicated otherwise option values are boolean.
    var mEditorPrefs = {
        // editor
        selectionStyle: {name: 'Selection style', value: ["line", "text"]},
        highlightActiveLine: {name: 'Hightlight active line', value: null},
        highlightSelectedWord: {name: 'Hightlight selected word', value: Number, tip: 'This is a tip.'}
        /*
        readOnly: ,
        cursorStyle: "ace"|"slim"|"smooth"|"wide",
        mergeUndoDeltas: false true "always",
        behavioursEnabled: ,
        wrapBehavioursEnabled:,
        autoScrollEditorIntoView: ,// this is needed if editor is inside scrollable page

        // renderer
        hScrollBarAlwaysVisible: ,
        vScrollBarAlwaysVisible: ,
        highlightGutterLine: ,
        animatedScroll: ,
        showInvisibles:,
        showPrintMargin:,
        printMarginColumn:,
        printMargin:,
        fadeFoldWidgets:,
        showFoldWidgets:,
        showLineNumbers:,
        showGutter:,
        displayIndentGuides:,
        fontSize: number or css font-size string,
        fontFamily: css,
        maxLines: ,
        minLines:,
        scrollPastEnd: ,
        fixedWidthGutter:,
        theme: path to a theme e.g "ace/theme/textmate",

        // mouse
        scrollSpeed: number,
        dragDelay:  number,
        dragEnabled:,
        focusTimout: number,
        tooltipFollowsMouse:,

        // session
        firstLineNumber: number,
        overwrite:,
        newLineMode:,
        useWorker:,
        useSoftTabs:,
        tabSize: number,
        wrap: ,
        foldStyle:,
        mode: path to a mode e.g "ace/mode/text"*/
    };

    var convertConfigOptionToFormElement = function(theConfigId, theConfigDescription, theValues) {
        var aValue = theConfigDescription.value;
        var aRet = '';
        var aDiskValue = theValues ? theValues[theConfigId] || '' : '';

        if(aValue instanceof Array) {
            aRet = '<select name="'+theConfigId+'">';
            for(var i = 0; i < aValue.length; i++) {
                aRet += '<option value="' + aValue[i] + '" '+(aDiskValue == aValue[i] ? ' selected="selected" ' : '')+'>' + aValue[i] + '</option>';
            }
            aRet += '</select>';

        } else if(aValue === null) {
            aRet = '<input type="checkbox" style="margin-top: -5px" id="' + theConfigId + '" value="' + aDiskValue + '" '+(Boolean(aDiskValue) ? ' checked="checked" ' : '')+' />';

        } else {
            aRet = '<input type="text" class="form-control input-sm" style="margin-top: -5px;" id="' + theConfigId + '" value="' + aDiskValue + '" />';
        }

        return aRet;
    };

    /**
     * Add a new section to the preferences panel. A section is a link that, when clicked, opens
     * a new panel with more preferences (e.g. UI preferences).
     *
     * @param {Object} theObj - an object describing the new section. It has the following structure: <code>{id: string, title: string, icon: string, panel: function}</code>. The <code>panel</code> property should be a function able to render a panel.
     */
    this.addSection = function(theObj) {
        mSections[theObj.id] = theObj;
    }

    var editor = function(theContainer, theContext) {
        var aContent = '';
        var aPrefsFromDisk = mCodebot.preferences.get().editor;

        aContent += '<div class="panel panel-default" style="height: 100%;">';
            aContent += '<div class="panel-heading" style="height: 40px;">'+
                            '<h2 class="panel-title pull-right">Editor <i class="fa fa-code"></i></h2>'+
                            '<a href="#" id="codebotPrefEditorBackButton" class="pull-left"><i class="fa fa-arrow-circle-o-left fa-2x"></i><a/>'+
                        '</div>';

            aContent += '<form class="form-horizontal" role="form">';

            for(var aId in mEditorPrefs) {
                aContent += '<li class="list-group-item">';

                  aContent += '<div style="height: 20px;">'+
                                '<div class="col-sm-8">' + mEditorPrefs[aId].name +
                                    (mEditorPrefs[aId].tip ? ' <i class="fa fa-question-circle" style="color: #cfcfcf;" title="'+mEditorPrefs[aId].tip+'"></i>' : '') +
                                '</div>'+
                                '<div class="col-sm-4">'+
                                    convertConfigOptionToFormElement(aId, mEditorPrefs[aId], aPrefsFromDisk) +
                                '</div>'+
                              '</div>';
                aContent += '</li>';
            }

            aContent += '</form>';
        aContent += '</div>';

        theContainer.append(aContent);

        $('#codebotPrefEditorBackButton').click(function() {
            theContext.ui.slidePanel.popState();
        });
    };

    var shortcuts = function(theContainer, theContext) {
        var aContent = '';

        aContent += '<div class="panel panel-default" style="height: 100%;">';
            aContent += '<div class="panel-heading" style="height: 40px;">'+
                            '<h2 class="panel-title pull-right">Shortcuts <i class="fa fa-keyboard-o"></i></h2>'+
                            '<a href="#" id="codebotPrefEditorBackButton" class="pull-left"><i class="fa fa-arrow-circle-o-left fa-2x"></i><a/>'+
                        '</div>';
        aContent += '</div>';

        theContainer.append(aContent);

        $('#codebotPrefEditorBackButton').click(function() {
            theContext.ui.slidePanel.popState();
        });
    };

    var appearance = function(theContainer, theContext) {
        var aContent = '';

        aContent += '<div class="panel panel-default" style="height: 100%;">';
            aContent += '<div class="panel-heading" style="height: 40px;">'+
                            '<h2 class="panel-title pull-right">UI and Appearance <i class="fa fa-picture-o"></i></h2>'+
                            '<a href="#" id="codebotPrefEditorBackButton" class="pull-left"><i class="fa fa-arrow-circle-o-left fa-2x"></i><a/>'+
                        '</div>';
        aContent += '</div>';

        theContainer.append(aContent);

        $('#codebotPrefEditorBackButton').click(function() {
            theContext.ui.slidePanel.popState();
        });
    };

    var extensions = function(theContainer, theContext) {
        var aContent = '';

        aContent += '<div class="panel panel-default" style="height: 100%;">';
            aContent += '<div class="panel-heading" style="height: 40px;">'+
                            '<h2 class="panel-title pull-right">Extensions <i class="fa fa-puzzle-piece"></i></h2>'+
                            '<a href="#" id="codebotPrefEditorBackButton" class="pull-left"><i class="fa fa-arrow-circle-o-left fa-2x"></i><a/>'+
                        '</div>';
        aContent += '</div>';

        theContainer.append(aContent);

        $('#codebotPrefEditorBackButton').click(function() {
            theContext.ui.slidePanel.popState();
        });
    };

    var devenvs = function(theContainer, theContext) {
        var aContent = '';

        aContent += '<div class="panel panel-default" style="height: 100%;">';
            aContent += '<div class="panel-heading" style="height: 40px;">'+
                            '<h2 class="panel-title pull-right">Development Environments <i class="fa fa-flask"></i></h2>'+
                            '<a href="#" id="codebotPrefEditorBackButton" class="pull-left"><i class="fa fa-arrow-circle-o-left fa-2x"></i><a/>'+
                        '</div>';
        aContent += '</div>';

        theContainer.append(aContent);

        $('#codebotPrefEditorBackButton').click(function() {
            theContext.ui.slidePanel.popState();
        });
    };

    var about = function(theContainer, theContext) {
        var aContent = '';

        aContent += '<div class="panel panel-default" style="height: 100%;">';
            aContent += '<div class="panel-heading" style="height: 40px;">'+
                            '<h2 class="panel-title pull-right">About <i class="fa fa-question-circle"></i></h2>'+
                            '<a href="#" id="codebotPrefEditorBackButton" class="pull-left"><i class="fa fa-arrow-circle-o-left fa-2x"></i><a/>'+
                        '</div>';
        aContent += '</div>';

        theContainer.append(aContent);

        $('#codebotPrefEditorBackButton').click(function() {
            theContext.ui.slidePanel.popState();
        });
    };

    var bugs = function(theContainer, theContext) {
        var aContent = '';

        aContent += '<div class="panel panel-default" style="height: 100%;">';
            aContent += '<div class="panel-heading" style="height: 40px;">'+
                            '<h2 class="panel-title pull-right">Bugs <i class="fa fa-bug"></i></h2>'+
                            '<a href="#" id="codebotPrefEditorBackButton" class="pull-left"><i class="fa fa-arrow-circle-o-left fa-2x"></i><a/>'+
                        '</div>';
        aContent += '</div>';

        theContainer.append(aContent);

        $('#codebotPrefEditorBackButton').click(function() {
            theContext.ui.slidePanel.popState();
        });
    };

    this.main = function(theContainer, theContext) {
        var aContent = '';
        var aPanel = new CodebotFancyPanel('Preferences');

        var aFolder = aPanel.addFolder('', 'preferences');

        for(var aId in mSections) {
            aFolder.add('', mSections[aId].title, aId, 'function');
        }

        aContent += aPanel.html();

        theContainer.append(aContent);

        theContainer.find('li.function').each(function(i, e) {
            $(e).click(function() {
                var aId = $(this).data('section');
                theContext.ui.slidePanel.pushState(mSections[aId].panel);
            });
        });
    };

    this.init = function(theCodebot) {
        mSelf = this;
        mCodebot = theCodebot;

        // TODO: move it to a better place?
        mSelf.addSection({id: 'editor', title: 'Editor', icon: '<i class="fa fa-code fa-lg"></i>', panel: editor});
        mSelf.addSection({id: 'shortcuts', title: 'Shortcuts', icon: '<i class="fa fa-keyboard-o fa-lg"></i>', panel: shortcuts});
        mSelf.addSection({id: 'appearance', title: 'UI and Appearance', icon: '<i class="fa fa-picture-o fa-lg"></i>', panel: appearance});
        mSelf.addSection({id: 'extensions', title: 'Extensions', icon: '<i class="fa fa-puzzle-piece fa-lg"></i>', panel: extensions});
        mSelf.addSection({id: 'devenvs', title: 'Development Environments', icon: '<i class="fa fa-flask fa-lg"></i>', panel: devenvs});
        mSelf.addSection({id: 'about', title: 'About and Updates', icon: '<i class="fa fa-question-circle fa-lg"></i>', panel: about});
        mSelf.addSection({id: 'bugs', title: 'Feedback and Bug Report', icon: '<i class="fa fa-bug fa-lg"></i>', panel: bugs});
    };
};
