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


// Namespace for the Javascript central
var JavascriptTools = JavascriptTools || {};

/**
 * A plugin that enables Codebot to work with Javascript/HTML5 projects.
 */
JavascriptTools.Plugin = function() {
    // Call constructor of base class
    Codebot.Plugin.call(this);
    this.mTestWindow = null;
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
JavascriptTools.Plugin.prototype = Object.create(Codebot.Plugin.prototype);
JavascriptTools.Plugin.prototype.constructor = JavascriptTools.Plugin;

JavascriptTools.Plugin.prototype.saveProjectSettings = function(theData) {
    var aIdeWeb         = this.context.plugins.get('cc.codebot.ide.web');
    var aActiveProject  = aIdeWeb.getActiveProject();

    console.debug('Saving project settings', theData);

    aActiveProject.settings = theData;

    // TODO: save the content of project settings in a regular file.
    aIdeWeb.api('project', 'update', {id: aActiveProject.id, settings: JSON.stringify(theData)}, function(theReturn) {
        if(theReturn.success) {
            console.debug('Project settings saved successfuly!');
        } else {
            console.warn('Unable to save project settings: ' + theReturn.msg);
        }
    });
};

JavascriptTools.Plugin.prototype.createTestWindow = function(theUrl, theWidth, theHeight) {
    if(this.mTestWindow) {
        this.mTestWindow.close();
    }
    this.mTestWindow = window.open(theUrl, 'Test', 'menubar=no,location=no,resizable=yes,scrollbars=no,status=no,width='+theWidth+',height=' + theHeight);
};

JavascriptTools.Plugin.prototype.initAfterProjectOpened = function(theProjectInfo) {
    // Remove all JS stuff from the UI.
    this.context.ui.removeButton(JavascriptTools.Plugin.meta.id + 'build');
    this.context.ui.removeButton(JavascriptTools.Plugin.meta.id + 'settings');

    // If the newly opened project is a JS one,
    // add all the JS UI back.
    if(theProjectInfo.type == "js") {
        // Add build and settings buttons.
        this.context.ui.addButton(JavascriptTools.Plugin.meta.id + 'build', { icon: '<i class="fa fa-play"></i>', action: this.build, context: this });
        this.context.ui.addButton(JavascriptTools.Plugin.meta.id + 'settings', { icon: '<i class="fa fa-wrench"></i>', panel: JavascriptTools.Panel.Settings });
    }
};

JavascriptTools.Plugin.prototype.build = function(theContext, theButton) {
    var aTab = null,
        aIde = this.context.plugins.get('cc.codebot.ide.web'),
        aActiveProject = aIde.getActiveProject(),
        aSettings = aActiveProject.settings,
        aSelf = this;


    theButton.html('<i class="fa fa-refresh fa-spin"></i>');

    console.log('Requesting remote build');

    aIde.api('javascript', 'build', {project: aActiveProject.id}, function(theData) {
        console.log('Remote build received!', theData);

        theButton.html('<i class="fa fa-play"></i>');

        if(theData.success) {
            aSelf.createTestWindow(theData.testingFileUrl, aSettings.width, aSettings.height);

        } else {
            aTab = aSelf.context.ui.tabs.add({
                favicon: 'file-text-o', // TODO: dynamic icon?
                title: 'Build',
                file: 'Build.log',
                path: 'build.log',
                node: null,
                editor: null
            });

            // TODO: make a viewer for this?
            console.error(theData.log);
        }
    });
};

JavascriptTools.Plugin.prototype.savePanelData = function(thePanel, theData) {
    console.debug('JavascriptTools::savePanelData()', theData);

    if(thePanel instanceof JavascriptTools.Panel.Settings) {
        this.saveProjectSettings(theData);
    }
};

JavascriptTools.Plugin.prototype.getPanelData = function(theContainerId) {
    var aIdeWeb         = this.context.plugins.get('cc.codebot.ide.web');
    var aActiveProject  = aIdeWeb.getActiveProject();

    return aActiveProject ? aActiveProject.settings : null;
};

JavascriptTools.Plugin.prototype.init = function(theContext) {
    // Call super class init method.
    Codebot.Plugin.prototype.init.call(this, theContext);
    console.debug('JavascriptTools.Plugin:init()');

    // Load all required scripts
    this.context.loadScript('./plugins/javascript-tools/js/panel.settings.js');
    // Init everything only when a new (JS) project is opened.
    this.context.signals.projectOpened.add(this.initAfterProjectOpened, this);
};

JavascriptTools.Plugin.meta = {
    className: JavascriptTools.Plugin,
    id: 'cc.codebot.javascript.tools',
    name: 'Javascript Tools',
    description: 'Enable the development of HTML5/Javascript projects.',
    version: '1.0.0-ALPHA'
};

CODEBOT.plugins.add(JavascriptTools.Plugin.meta);
