/*
	The MIT License (MIT)

	Copyright (c) 2015 Fernando Bevilacqua

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

// Namespace for the javascript tools plugin
var JavascriptTools = JavascriptTools || {};

// Namespace for panels
JavascriptTools.Panel = JavascriptTools.Panel || {};

/**
 * Represents the panel that will be displayed when the
 * assets plugin button is clicked.
 */
JavascriptTools.Panel.Settings = function() {
    // Call constructor of base class
    Codebot.Panel.call(this, 'Project settings');

    // Set a data manager for this panel. A data manager will save and restore
    // data to any form element in this panel.
    this.setDataManager('cc.codebot.javascript.tools');
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
JavascriptTools.Panel.Settings.prototype = Object.create(Codebot.Panel.prototype);
JavascriptTools.Panel.Settings.prototype.constructor = JavascriptTools.Panel.Settings;

JavascriptTools.Panel.Settings.prototype.render = function() {
    Codebot.Panel.prototype.render.call(this);

    this.divider('Build');
    this.pair('Index file', '<input type="text" name="startFile" value="index.html" />');
    this.pair('Width (px)', '<input type="text" name="width" value="800" />');
    this.pair('Height (px)', '<input type="text" name="height" value="600" />');
};
