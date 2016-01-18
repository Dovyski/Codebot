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

// Namespace for Codebot.Editor
var Codebot = Codebot || {};
Codebot.Editor = Codebot.Editor || {};

/**
 * A foundation for building Codebot editor. All editor should extend this
 * class if they want some built-in functionalities, such as toolbars.
 *
 * @param  {String} theContainerId Id of the DOM element that is housing this editor.
 */
Codebot.Editor.Base = function(theContainerId) {
    this.mContainerId = theContainerId;
    this.mContainer = $('#' + this.mContainer);

    this.mWorkingArea = {id: '', container: null};
    this.mToolbarArea = {id: '', container: null};
    this.mButtons = {};

    this.buildUI();

    this.mToolbarPanel = new Codebot.Panel('', this.mToolbarArea.id);
    this.init();
};

/**
 * Builds the editor's UI (toolbar, buttons, etc).
 */
Codebot.Editor.Base.prototype.buildUI = function() {
    var aToolbarId,
        aWorkingAreaId;

    this.mToolbarArea.id = 'editor-toolbar-' + ((Math.random() * 1000000) | 0);
    this.mWorkingArea.id = 'editor-working-area-' + ((Math.random() * 1000000) | 0);

    this.mContainer.html(
        '<div class="codebot-editor">' +
            '<div class="toolbar" id="' + this.mToolbarArea.id + '"></div>' +
            '<div class="working-area" id="' + this.mWorkingArea.id + '">d</div>' +
        '</div>');

    this.mToolbarArea.container = this.mContainer.find('div.toolbar');
    this.mWorkingArea.container = this.mContainer.find('div.working-area');
};

/**
 * [function description]
 *
 * @param  {[type]} theContent      [description]
 * @param  {[type]} theCallback     [description]
 * @param  {[type]} theCallbackThis [description]
 * @return {[type]}                 [description]
 */
Codebot.Editor.Base.prototype.addToolbarButton = function(theContent, theCallback, theCallbackThis, theToggleable) {
    var aId,
        aSelf;

    aId = 'toolbar-button-' + ((Math.random() * 1000000) | 0);
    aSelf = this;

    this.mButtons[aId] = {
        callback: theCallback,
        context: theCallbackThis,
        toggleable: theToggleable == undefined ? true : theToggleable
    };

    this.mToolbarPanel.row('<button id="' + aId + '">' + theContent + '</button>');

    $('#' + aId).click(function() {
        var aInfo = aSelf.mButtons[$(this).attr('id')];

        if(aInfo.toggleable) {
            if($(this).hasClass('active')) {
                $(this).removeClass('active');
            } else {
                $(this).addClass('active');
            }
        }

        if(aInfo.callback) {
            aInfo.callback.call(aInfo.context);
        }
    });
};

/**
 * Initializes the editor.
 */
Codebot.Editor.Base.prototype.init = function() {
};

/**
 * [function description]
 * @return {[type]} [description]
 */
Codebot.Editor.Base.prototype.getWorkingArea = function() {
    return this.mWorkingArea;
};

/**
 * [function description]
 * @return {[type]} [description]
 */
Codebot.Editor.Base.prototype.getToolbar = function() {
    return this.mToolbarArea;
};

/**
 * [function description]
 *
 * @param  {[type]} theContent [description]
 * @return {[type]}            [description]
 */
Codebot.Editor.Base.prototype.html = function(theContent) {
    this.mWorkingArea.container.html(theContent);
};
