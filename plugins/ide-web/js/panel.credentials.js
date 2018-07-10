/*
	The MIT License (MIT)

	Copyright (c) 2018 Fernando Bevilacqua

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

// Namespace for IDE (web)
var IdeWeb = IdeWeb || {};

// Namespace for panels
IdeWeb.Panel = IdeWeb.Panel || {};

/**
 * Show info about the currently authenticated user.
 */
IdeWeb.Panel.Credentials = function() {
    // Call constructor of base class
    Codebot.Panel.call(this, 'Credentials');
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
IdeWeb.Panel.Credentials.prototype = Object.create(Codebot.Panel.prototype);
IdeWeb.Panel.Credentials.prototype.constructor = IdeWeb.Panel.Credentials;

IdeWeb.Panel.Credentials.prototype.render = function() {
    var aSelf,
        aIde;

    Codebot.Panel.prototype.render.call(this);

    aSelf = this;
    aIde = this.getContext().plugins.get('cc.codebot.ide.web');

    this.row('<div id="user-credentials"><img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50" /></div>');
};
