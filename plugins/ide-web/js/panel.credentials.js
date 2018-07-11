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
    Codebot.Panel.call(this, 'User information');
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
IdeWeb.Panel.Credentials.prototype = Object.create(Codebot.Panel.prototype);
IdeWeb.Panel.Credentials.prototype.constructor = IdeWeb.Panel.Credentials;

IdeWeb.Panel.Credentials.prototype.render = function() {
    Codebot.Panel.prototype.render.call(this);

    var aIde = this.getContext().plugins.get('cc.codebot.ide.web');
    var aUser = this.getParams().user;
    var aContent = '';

    // Show some nice about info about Codebot
    this.row(
        '<div class="credentials-panel-main">' +
            '<img src="https://www.gravatar.com/avatar/' + aUser.gravatar_hash + '?s=150" title="' + aUser.email + '" class="img-circle" />' +
            '<p class="name">User' + aUser.id + '</p> ' +
            '<p class="email">' + aUser.email + '</p>' +
        '</div>'
    );

    this.divider('Authentication');
    aContent = '<ul>';
    aContent += '<a href="javascript:void(0);" data-section="" class="setting-section"><li><i class="fa fa-sign-out"></i> Sign out</li></a>';
    aContent += '</ul>';
    this.row(aContent);

    this.divider('Account');
    aContent = '<ul>';
    aContent += '<a href="javascript:void(0);" data-section="" class="setting-section"><li><i class="fa fa-user"></i> Edit info</li></a>';
    aContent += '</ul>';
    this.row(aContent);

    this.divider('Personal data');
    aContent = '<ul>';
    aContent += '<a href="javascript:void(0);" data-section="" class="setting-section"><li><i class="fa fa-download"></i> Download</li></a>';
    aContent += '<a href="javascript:void(0);" data-section="" class="setting-section"><li><i class="fa fa-trash"></i> Delete everything</li></a>';
    aContent += '</ul>';
    this.row(aContent);
};
