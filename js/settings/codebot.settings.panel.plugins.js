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
 * This panel control all settings related to the code editor.
 */
Codebot.Settings.Panel.Plugins = function() {
    // Call constructor of base class
    Codebot.Panel.call(this, 'Plugins');
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Codebot.Settings.Panel.Plugins.prototype = Object.create(Codebot.Panel.prototype);
Codebot.Settings.Panel.Plugins.prototype.constructor = Codebot.Settings.Panel.Plugins;

Codebot.Settings.Panel.Plugins.prototype.render = function() {
    var aId,
        aPlugins,
        aIsActive,
        aPlugin,
        aSelf = this;

    Codebot.Panel.prototype.render.call(this);

    aPlugins = this.getContext().plugins.available();

    for(aId in aPlugins) {
        aPlugin = aPlugins[aId];
        aIsActive = this.getContext().plugins.isActive(aId);

        this.row(
            '<div class="plugin">' +
                '<img src="./img/logo/codebot-logo.png" title="' + aId + '" class="plugin-img" />' +
                '<div class="switch"><input type="checkbox" name="' + aId + '" id="' + aId + '" '+ (aIsActive ? 'checked="checked"' : '') +'><label for="' + aId + '"></label></div>' +
                '<h2>'+aPlugin.name+'</h2>' +
                '<span><i class="fa fa-tag"></i>' + aPlugin.version + '</span>' +
                '<span><i class="fa fa-user"></i>Dovyski</span>' +
                '<p>' + aPlugin.description + '</p>' +
            '<div/>'
        );
    }

    this.container.find('input[type="checkbox"]').change(function(theEvent) {
        aSelf.handlePluginChange(theEvent.target.id, theEvent.target.checked);
    });
};

Codebot.Settings.Panel.Plugins.prototype.handlePluginChange = function(thePluginId, theActivate) {
    if(theActivate) {
        this.getContext().plugins.activate(thePluginId);
    } else {
        this.getContext().plugins.deactivate(thePluginId);
    }
};

Codebot.Settings.Panel.Plugins.prototype.onDestroy = function() {
    var aSettings = this.getData();

    this.getContext().settings.set({plugins: aSettings});
    this.getContext().settings.saveToDisk();
};
