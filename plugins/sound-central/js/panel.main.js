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

// Namespace for the asset finder plugin
var SoundCentral = SoundCentral || {};

// Namespace for panels
SoundCentral.Panel = SoundCentral.Panel || {};
/**
 * The main panel to be displayed when the user clicks the
 * sound central icon.
 */
SoundCentral.Panel.Main = function() {
    // Call constructor of base class
    Codebot.Panel.call(this, 'SFX and Music');
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
SoundCentral.Panel.Main.prototype = Object.create(Codebot.Panel.prototype);
SoundCentral.Panel.Main.prototype.constructor = SoundCentral.Panel.Main;

SoundCentral.Panel.Main.prototype.render = function() {
    var aSelf = this;

    Codebot.Panel.prototype.render.call(this);

    this.divider('Save to project');
    this.row('buttons');

    this.divider('Generators');
    this.row('buttons');

    this.divider('Manual settings');
    this.row('buttons');
};
