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

var Dummy = Dummy || {};

Dummy.Panel = function() {
    // Call constructor of base class
    Codebot.Panel.call(this, 'Dummy panel');

    // Set a data manager for this panel
    this.setDataManager('com.dummy.plugin');
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Dummy.Panel.prototype = Object.create(Codebot.Panel.prototype);
Dummy.Panel.prototype.constructor = Dummy.Panel;

Dummy.Panel.prototype.render = function() {
    var aSelf = this;

    Codebot.Panel.prototype.render.call(this);

    // Show some nice about info about Codebot
    this.row('<a href="javascript:void(0);" data-action="push" class="inf">Push itself</a>');
    this.row('<a href="javascript:void(0);" data-action="pop" class="inf">Pop itself</a>');

    this.container.find('a.inf').each(function(theElement) {
        $(this).click(function() {
            if($(this).data('action') == 'push') {
                aSelf.push(Dummy.Panel);
            } else if($(this).data('action') == 'pop'){
                aSelf.pop();
            }
        })
    });
};

/**
 * This is a boilerplate for plugin creation.
 */
Dummy.Plugin = function() {
    // Call constructor of base class
    Codebot.Plugin.call(this);
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Dummy.Plugin.prototype = Object.create(Codebot.Plugin.prototype);
Dummy.Plugin.prototype.constructor = Dummy.Plugin;

Dummy.Plugin.prototype.savePanelData = function(thePanel, theData) {
    console.debug('Dummy::savePanelData', thePanel, theData);
};

Dummy.Plugin.prototype.getPanelData = function(thePanel) {
    return null;
};

Dummy.Plugin.prototype.init = function(theContext) {
    Codebot.Plugin.prototype.init.call(this, theContext);

    console.debug('DummyPlugin::init()');

    this.context.ui.addButton('dummyBtn', {
        icon: '<i class="fa fa-puzzle-piece"></i>',
        //action: mSelf.anotherMethod,
        panel: Dummy.Panel
    });
};

Dummy.Plugin.meta = {
    className: Dummy.Plugin,
    id: 'com.dummy.plugin',
    name: 'Dummy plugin',
    description: 'Use this plugin as a boilerplate to create a new plugin.',
    version: '1.0.0'
};

CODEBOT.plugins.add(Dummy.Plugin.meta);
