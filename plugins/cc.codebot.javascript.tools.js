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


var JavascriptToolsCompilerOutputViewer = function(theContainer) {
    var mContainer = theContainer;

    this.formatOutput = function(theData) {
        $('#' + mContainer).html('<pre style="color: #fff; background: transparent;">' + theData + '</pre>');
    };

    this.showMessage = function(theText) {
        $('#' + mContainer).html(theText);
    }
};


/**
 * A plugin that enables Codebot to work with AS3 projects.
 */
var JavascriptToolsPlugin = function() {
    const API_URL   = 'plugins/javascript-tools/api.php';

    this.id         = 'cc.codebot.javascript.tools';

    var mSelf       = null;
    var mContext    = null;
    var mTestWindow = null;

    var saveProjectSettings = function(theData) {
        var aIdeWeb         = mContext.getPlugin('cc.codebot.ide.web');
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

    var createTestWindow = function(theUrl, theWidth, theHeight) {
        if(mTestWindow) {
            mTestWindow.close();
        }
        mTestWindow = window.open(theUrl, 'Test', 'menubar=no,location=no,resizable=yes,scrollbars=no,status=no,width='+theWidth+',height=' + theHeight);
    };

    var initAfterProjectOpened = function(theProjectInfo) {
        // Remove all JS stuff from the UI.
        mContext.ui.removeButton(mSelf.id + 'build');
        mContext.ui.removeButton(mSelf.id + 'settings');

        // If the newly opened project is a JS one,
        // add all the JS UI back.
        if(theProjectInfo.type == "js") {
            // Add build and settings buttons.
            mContext.ui.addButton(mSelf.id + 'build', { icon: '<i class="fa fa-circle"></i>', action: mSelf.build });
            mContext.ui.addButton(mSelf.id + 'settings', { icon: '<i class="fa fa-user"></i>', panel: mSelf.settings });
        }
    };

    this.savePanelData = function(theContainerId, theData) {
        console.debug('JavascriptTools::savePanelData()', theContainerId, theData);

        if(theContainerId == 'js-tools-settings') {
            saveProjectSettings(theData);
        }
    };

    this.restorePanelData = function(theContainerId) {
        var aIdeWeb         = mContext.getPlugin('cc.codebot.ide.web');
        var aActiveProject  = aIdeWeb.getActiveProject();

        return aActiveProject ? aActiveProject.settings : null;
    };

    this.init = function(theContext) {
        mSelf = this;
        mContext = theContext;

        // Init everything only when a new (JS) project is opened.
        mContext.signals.projectOpened.add(initAfterProjectOpened);
    };

    this.build = function(theContext, theButton) {
        var aTab            = null;
        var aIde            = mContext.getPlugin('cc.codebot.ide.web');
        var aActiveProject  = aIde.getActiveProject();
        var aSettings       = aActiveProject.settings;

        theButton.html('<i class="fa fa-refresh fa-spin"></i>');

        console.log('Requesting remote build');

        aIde.api('javascript', 'build', {project: aActiveProject.id}, function(theData) {
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

                aTab.editor = new JavascriptToolsCompilerOutputViewer(aTab.container);
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

        aContent += '<form action="#" id="js-tools-settings" data-manager="' + mSelf.id + '">';
        aContent += aPanel.html();
        aContent += '</form>';

        theContainer.append(aContent);
    };

};

CODEBOT.addPlugin(new JavascriptToolsPlugin());
