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
 * A simple audio editor/viewer. It is able to play common
 * audio files (e.g. mp3, wave, ogg) and perform simple editions,
 * such as cutting a selection of the audio stream.
 *
 * @param  {[type]} theContainer [description]
 */
Codebot.Editor.Audio = function(theContainer) {
    this.mContainer = theContainer;
    this.mWaveSurfer = null;
};

/**
 * Editor factory. This method can create a new instance of the audio editor.
 *
 * @param  {Codebot.Tab} theTab    The tab where this editor was placed.
 * @param  {Blob} theContent       The content of the file being opened.
 * @param  {Codebot.Node} theNode  The node (file) being opened.
 * @return {Codebot.Editor.Audio}
 */
Codebot.Editor.Audio.create = function(theTab, theContent, theNode) {
    var aEditor = new Codebot.Editor.Audio(theTab.container);

    if(theContent instanceof Blob) {
        var aUrlCreator = window.URL || window.webkitURL;
        aEditor.init(theContent);
    }

    return aEditor;
};

/**
 * [function description]
 *
 * @param  {Blob} theBlob [description]
 * @return {[type]}        [description]
 */
Codebot.Editor.Audio.prototype.init = function(theBlob) {
    var aSelf = this;

    $('#' + this.mContainer).html('Audio: <div id="test"></div>');

    this.mWaveSurfer = WaveSurfer.create({
        container: '#test',
        waveColor: 'violet',
        progressColor: 'purple'
    });

    this.mWaveSurfer.on('ready', function () {
        aSelf.mWaveSurfer.play();
    });

    this.mWaveSurfer.loadBlob(theBlob);
};
