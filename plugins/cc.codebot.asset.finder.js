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
var AssetFinder = AssetFinder || {};

/**
 * Search for assets on the interwebs.
 */
AssetFinder.Plugin = function() {
    // Call constructor of base class
    Codebot.Plugin.call(this);

    // Initialize personal stuff
    this.id         = 'cc.codebot.asset.finder';
    this.licenses   = [];
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
AssetFinder.Plugin.prototype = Object.create(Codebot.Plugin.prototype);
AssetFinder.Plugin.prototype.constructor = AssetFinder.Plugin;

AssetFinder.Plugin.prototype.savePanelData = function(thePanel, theData) {
    console.debug('AssetFinder::savePanelData', thePanel, theData);
};

AssetFinder.Plugin.prototype.getPanelData = function(thePanel) {
    return null;
};

AssetFinder.Plugin.prototype.initUIAfterProjectOpened = function(theProjectInfo) {
    this.context.ui.addButton(this.id + 'mainPanel', { icon: '<i class="fa fa-picture-o"></i>', panel: AssetFinder.Panel.Main });
};

AssetFinder.Plugin.prototype.loadLicenses = function() {
    // TODO: load this from API endpoint.
    this.licenses = [
        {id: 1, name: 'CC-BY 3.0'},
        {id: 2, name: 'CC-BY-SA 3.0'},
        {id: 4, name: 'GPL 3.0'}
    ];
};

AssetFinder.Plugin.prototype.getLicenses = function() {
    return this.licenses;
};

AssetFinder.Plugin.prototype.init = function(theContext) {
    // Call super class init method.
    Codebot.Plugin.prototype.init.call(this, theContext);

    console.debug('AssetFinder.Plugin:init()');

    // Load all required scripts
    this.context.loadScript('./plugins/asset-finder/js/panel.main.js');
    this.context.loadScript('./plugins/asset-finder/js/panel.info.js');

    this.loadLicenses();

    this.context.signals.projectOpened.add(this.initUIAfterProjectOpened, this);
};

CODEBOT.addPlugin(new AssetFinder.Plugin());
