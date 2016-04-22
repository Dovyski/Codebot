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


var FlashToolsCompilerOutputViewer = function(theContainer) {
    var mContainer = theContainer;

    this.formatOutput = function(theData) {
        $('#' + mContainer).html('<pre style="color: #fff; background: transparent;">' + theData.join('\n') + '</pre>');
    };

    this.showMessage = function(theText) {
        $('#' + mContainer).html(theText);
    }
};


/**
 * A plugin that enables Codebot to work with AS3 projects.
 */
var FlashToolsPlugin = function() {
    const API_URL   = 'plugins/flash-tools/api.php';

    var mSelf       = null;
    var mContext    = null;
    var mTestWindow = null;

    var saveProjectSettings = function(theData) {
        var aIdeWeb         = mContext.plugins.get('cc.codebot.ide.web');
        var aActiveProject  = aIdeWeb.getActiveProject();

        console.debug('Saving project settings', theData);

        aActiveProject.settings = theData;

        // TODO: save the content of project settings in a regular file.
        aIdeWeb.api('project', 'updateSettings', {project: aActiveProject.id, data: JSON.stringify(theData)}, function(theReturn) {
            if(theReturn.success) {
                console.debug('Project settings saved successfuly!');
            }
        });
    };

    var createTestWindow = function(theSwfUrl, theWidth, theHeight) {
        mTestWindow = window.open(theSwfUrl, 'Test', 'menubar=no,location=no,resizable=yes,scrollbars=no,status=no,width='+theWidth+',height=' + theHeight);
    };

    var addSwcToLib = function(theNode) {
        var aSettings = mContext.plugins.get('cc.codebot.ide.web').getActiveProject().settings;
        var aIndex;

        aSettings.libs  = aSettings.libs ? aSettings.libs.split(',') : [];
        aIndex          = aSettings.libs.indexOf(theNode.path);

        if(aIndex == -1) {
            // New element added.
            aSettings.libs.push(theNode.path);
            console.debug('Add ' + theNode.name + ' to library-path');
        } else {
            // Trying to add an element that is already
            // in the lib list. Let's remove it then.
            aSettings.libs.splice(aIndex, 1);
            console.debug('Remove ' + theNode.name + ' from library-path');
        }

        aSettings.libs = aSettings.libs.join(',');

        saveProjectSettings(aSettings);
        mContext.ui.filesPanel.refreshTree();
    };

    var highlightSwcsAddedToLib = function(theNode) {
        var aLibs, i, aTotal, aSettings;

        if(theNode.folder) {
            for(i = 0, aTotal = theNode.children.length; i < aTotal; i++) {
                highlightSwcsAddedToLib(theNode.children[i]);
            }

        } else {
            aSettings   = mContext.plugins.get('cc.codebot.ide.web').getActiveProject().settings;
            aLibs       = aSettings.libs ? aSettings.libs.split(',') : [];

            if(aLibs.indexOf(theNode.path) != -1) {
                theNode.title = '<span style="color: #B0C5FF">' + theNode.name + '</span>';
            }
        }
    };

    var initAfterProjectOpened = function(theProjectInfo) {
        // Remove all Flash stuff from the UI.
        mContext.ui.removeButton(mSelf.id + 'build');
        mContext.ui.removeButton(mSelf.id + 'settings');
        mContext.ui.filesPanel.contextMenu.removeItem(mSelf.id + 'add-to-library');
        mContext.signals.beforeFilesPanelRefresh.remove(highlightSwcsAddedToLib);

        // If the newly opened project is a Flash one,
        // add all the Flash UI back.
        if(theProjectInfo.type == "flash") {
            // Add build and settings buttons.
            mContext.ui.addButton(mSelf.id + 'build', { icon: '<i class="fa fa-play"></i>', action: mSelf.build });
            mContext.ui.addButton(mSelf.id + 'settings', { icon: '<i class="fa fa-wrench"></i>', panel: mSelf.settings });

            // Register a context menu entry in the filesPanel for SWC files.
            mContext.ui.filesPanel.contextMenu.addItem(mSelf.id + 'add-to-library', {regex: /.*\.swc/, name: 'Add to lib', icon: 'delete', action: addSwcToLib});

            // Monitor files panel changes, so we can highlight nodes marked
            // to be included in the compilation process (like blue SWCs in FlashDevelop)
            mContext.signals.beforeFilesPanelRefresh.add(highlightSwcsAddedToLib);
        }
    };

    this.savePanelData = function(theContainerId, theData) {
        console.debug('FlashTools::savePanelData()', theContainerId, theData);

        if(theContainerId == 'flash-tools-settings') {
            saveProjectSettings(theData);
        }
    };

    this.restorePanelData = function(theContainerId) {
        var aIdeWeb         = mContext.plugins.get('cc.codebot.ide.web');
        var aActiveProject  = aIdeWeb.getActiveProject();

        return aActiveProject ? aActiveProject.settings : null;
    };

    this.init = function(theContext) {
        mSelf = this;
        mContext = theContext;

        // Init everything only when a new (Flash) project is opened.
        mContext.signals.projectOpened.add(initAfterProjectOpened);
    };

    this.build = function(theContext, theButton) {
        var aTab            = null;
        var aIde            = mContext.plugins.get('cc.codebot.ide.web');
        var aActiveProject  = aIde.getActiveProject();
        var aSettings       = aActiveProject.settings;

        theButton.html('<i class="fa fa-refresh fa-spin"></i>');

        console.log('Requesting remote build');

        aIde.api('flash', 'build', {project: aActiveProject.id}, function(theData) {
            console.log('Remote build received!', theData);

            theButton.html('<i class="fa fa-play"></i>');

            if(theData.success) {
                createTestWindow(theData.testingFileUrl, aSettings.width, aSettings.height);

            } else {
                aTab = mContext.ui.tabs.add({
                    favicon: 'file-text-o', // TODO: dynamic icon?
                    title: 'Build',
                    file: 'Build.log',
                    path: 'build.log',
                    node: null,
                    editor: null
                });

                aTab.editor = new FlashToolsCompilerOutputViewer(aTab.container);
                aTab.editor.formatOutput(theData.log);
            }
        });
    };

    this.settings = function(theContainer, theContext) {
        var aContent = '';
        var aPanel = new CodebotFancyPanel('Project settings');

        var aFolder = aPanel.addFolder('Output', 'output');

        aFolder.add('<input type="text" name="outDir" value="/bin/" />', 'Output dir');
        aFolder.add('<input type="text" name="outFile" value="Mode.swf" />', 'Output file');
        aFolder.add('<input type="text" name="docClass" value="src/Main.as" />', 'Doc class');
        aFolder.add('<input type="text" name="width" value="800" />', 'Width');
        aFolder.add('<input type="text" name="height" value="600" />', 'Height');

        var aFolder = aPanel.addFolder('Classpath', 'output');
        aFolder.add('<input type="text" name="libs" value="/libs/" />', 'Libs');

        aFolder = aPanel.addFolder('SDK and Compiler', 'sdk');
        aFolder.add('<select name="platform"><option value="player">Flash Player</option><option value="air">AIR</option></select>', 'Platform');
        aFolder.add('<input type="text" name="swf" value="22" />', 'Version');
        aFolder.add('<input type="text" name="other" value="/libs/" />', 'Other');
        aFolder.add('<input type="text" name="test" value="/libs/" />', 'Test');
        aFolder.add('<select name="thing"><option value="800">Flash Player</option></select>', 'Thing');

        aContent += '<form action="#" id="flash-tools-settings" data-manager="' + mSelf.id + '">';
        aContent += aPanel.html();
        aContent += '</form>';

        theContainer.append(aContent);
    };

};

FlashToolsPlugin.meta = {
    className: FlashToolsPlugin,
    id: 'cc.codebot.flash.tools',
    name: 'Flash Tools',
    description: 'Description here',
    version: '1.0.0-ALPHA'
};

CODEBOT.plugins.add(FlashToolsPlugin.meta);
