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

// Namespace for the SFX central
var SoundCentral = SoundCentral || {};

/**
 * Searchers and generates SFX/music.
 */
SoundCentral.Plugin = function() {
    // Call constructor of base class
    Codebot.Plugin.call(this);
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
SoundCentral.Plugin.prototype = Object.create(Codebot.Plugin.prototype);
SoundCentral.Plugin.prototype.constructor = SoundCentral.Plugin;

SoundCentral.Plugin.prototype.savePanelData = function(thePanel, theData) {
};

SoundCentral.Plugin.prototype.getPanelData = function(thePanel) {
    return null;
};

SoundCentral.Plugin.prototype.init = function(theContext) {
    // Call super class init method.
    Codebot.Plugin.prototype.init.call(this, theContext);

    console.debug('SoundCentral.Plugin:init()');

    // Load all required scripts
    this.context.loadScript('./plugins/sound-central/js/jsfxr/riffwave.js');
    this.context.loadScript('./plugins/sound-central/js/jsfxr/sfxr.js');
    this.context.loadScript('./plugins/sound-central/js/panel.main.js');

    // Add sound central button only after a project has been loaded
    this.context.signals.projectOpened.add(function(theProjectInfo) {
        this.context.ui.addButton(SoundCentral.Plugin.meta.id + 'mainPanel', { icon: '<i class="fa fa-volume-up"></i>', panel: SoundCentral.Panel.Main });
    }, this);
};

SoundCentral.Plugin.meta = {
    className: SoundCentral.Plugin,
    id: 'cc.codebot.sound.central',
    name: 'Sound Central',
    description: 'Description here',
    version: '1.0.0-ALPHA'
};

CODEBOT.addPlugin(SoundCentral.Plugin.meta);
