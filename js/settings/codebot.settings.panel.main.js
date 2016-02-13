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
 * This is the panel displayed when the user clicks the settings icon (cogs)
 * at the bottom right of the screen. It orchestrates all other panels
 * related to settings in general, e.g. code editor.
 */
Codebot.Settings.Panel.Main = function() {
    // Call constructor of base class
    Codebot.Panel.call(this, 'Codebot');
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Codebot.Settings.Panel.Main.prototype = Object.create(Codebot.Panel.prototype);
Codebot.Settings.Panel.Main.prototype.constructor = Codebot.Settings.Panel.Main;

Codebot.Settings.Panel.Main.prototype.init = function() {
};

Codebot.Settings.Panel.Main.prototype.render = function() {
    var aSections,
        aContent = '',
        aSelf = this;
        i;

    Codebot.Panel.prototype.render.call(this);

    // Show some nice about info about Codebot
    this.row('<img src="./img/logo/codebot-logo.png" title="Codebot" /><p>Codebot</p><p>Version 1.0.0-ALPHA</p>');

    // Show all settings sections
    this.divider('Settings');

    aSections = this.getContext().settings.getSections();

    aContent += '<ul>';
    for(i in aSections) {
        aContent += '<a href="javascript:void(0);" data-section="' + i + '" class="setting-section"><li>' + aSections[i].icon + ' ' + aSections[i].title + '</li></a>';
    }
    aContent += '</ul>';

    this.row(aContent);

    // Make all sections clickable
    this.container.find('a.setting-section').each(function(theIndex, theElement) {
        $(theElement).click(function() {
            var aId = $(this).data('section');
            aSelf.open(aSections[aId].panel);
        });
    });
};
