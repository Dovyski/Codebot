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

var Codebot = Codebot || {};

Codebot.Editors = function() {
    var mSelf = null;
    var mCodebot = null;
    var mExtensionsMap = {};

    /**
     * Regiter an editor able to open an specific file type. The editor used
     * to open a file is selected based on the file extension. e.g. .html means HTML file.
     *
     * @param {string|array} theFileExtension - extension of the file able to be open by the editor, without the point. E.g.: <code>html</code>. It can be an array of extensions.
     * @param {function} theEditorFactory - function invoked by Codebot to create an editor. The function signature is <code>func(theContainer, theContent, theNode)</code>, the <code>theContainer</code> is the id of a div where the editor will be placed, <code>theContent</code> is the file content and <code>theNode</code> is a filesystem node describing the file.
     */
    this.register = function(theFileExtension, theEditorFactory) {
        var aExt = '';

        if(theFileExtension instanceof Array) {
            for(var i = 0; i < theFileExtension.length; i++) {
                aExt = theFileExtension[i].replace('.', '');
                mExtensionsMap[aExt] = theEditorFactory;
            }

        } else {
            aExt = theFileExtension.replace('.', '');
            mExtensionsMap[aExt] = theEditorFactory;
        }

        console.log('CODEBOT [editor added]', theFileExtension);
    };

    /**
     * Creates an instance of a editor to manipulate a file.
     *
     * @param {CodebotTab} theTab - tab where the editor will be inserted.
     * @param {string} theContent -  file content
     * @param {Node} theNode - filesystem node describing the file.
     */
    this.create = function(theTab, theContent, theNode) {
        var aExtension = CODEBOT.utils.getExtension(theNode.name);
        var aEditorFactory = null;

        // Does the extension has an editor to open it?
        if(aExtension in mExtensionsMap) {
            // Yeah, it has. Let's use it then.
            aEditorFactory = mExtensionsMap[aExtension];

        } else {
            // No editor for that extension. Let's use the default code editor.
            aEditorFactory = mExtensionsMap['*'];
        }

        return aEditorFactory(theTab, theContent, theNode);
    };

    this.init = function(theCodebot) {
        mSelf = this;
        mCodebot = theCodebot;

        // Register a few default editor for common file types
        mSelf.register(['png', 'jpeg', 'jpg', 'gif'], CodebotEditorGraphic.create);
        mSelf.register(['wav', 'mp3', 'ogg'], Codebot.Editor.Audio.create);
        mSelf.register('*', CodebotEditorAce.create);
    };
};
