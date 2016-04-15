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

    aPlugins = this.getContext().getPlugins();

    for(aId in aPlugins.available) {
        aPlugin = aPlugins.available[aId];
        aIsActive = aPlugins.active[aId];

        this.row(
            '<img src="lkj" title="" style="float: left; margin-right: 5px; width: 50px; height: 50px;"/>' +
            '<div class="switch" style="position: absolute; top: 2px; right: 55px;"><input type="checkbox" name="' + aId + '" id="' + aId + '" '+ (aIsActive ? 'checked="checked"' : '') +'><label for="' + aId + '"></label></div>' +
            '<p><strong>'+aPlugin.name+'</strong><br /><i class="fa fa-tag"></i>' + aPlugin.version + '<br /><i class="fa fa-user"></i>Dovyski</p>' +
            '<p>' + aPlugin.description + '</p>' +
            '<div style="width: 100%; height: 2px; border-bottom: 1px solid #505050;" />'
        );
    }

    this.container.find('input[type="checkbox"]').change(function(theEvent) {
        aSelf.handlePluginChange(theEvent.target.id, theEvent.target.checked);
    });
};

Codebot.Settings.Panel.Plugins.prototype.handlePluginChange = function(thePluginId, theActivated) {
    // TODO: activate and deactivate plugins here
    console.log(thePluginId, theActivated);
};

Codebot.Settings.Panel.Plugins.prototype.onDestroy = function() {
    var aSettings = this.getData();

    this.getContext().settings.set({plugins: aSettings});
    this.getContext().settings.saveToDisk();
};
