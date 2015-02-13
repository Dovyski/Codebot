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

    this.id         = 'cc.codebot.flash.tools';

    var mSelf       = null;
    var mContext    = null;
    var mTestWindow = null;

    var runRemoteBuild = function(theParams, theCallback) {
        $.ajax({
            url: API_URL,
            method: 'post',
            data: theParams,
            dataType: 'json'
        }).done(function(theData) {
            theCallback(theData);

        }).fail(function(theJqXHR, theTextStatus, theError) {
            console.error('Flash tools problem: ' + theTextStatus + ', ' + theError);
        });
    };

    var saveProjectSettings = function(theData) {
        var aActiveProject  = mContext.getPlugin('cc.codebot.ide.web').getActiveProject();

        var aParams = {
            method: 'save-settings',
            project: aActiveProject.id,
            data: JSON.stringify(theData)
        };

        console.log('Saving project settings');

        runRemoteBuild(aParams, function(theResponse) {
            console.log('Project settings saved', theResponse.success);
        });
    };

    var createTestWindow = function(theSwfUrl, theWidth, theHeight) {
        mTestWindow = window.open(theSwfUrl, 'Test', 'menubar=no,location=no,resizable=yes,scrollbars=no,status=no,width='+theWidth+',height=' + theHeight);
    };

    this.init = function(theContext) {
        mSelf = this;
        mContext = theContext;

        mContext.ui.addButton({ icon: '<i class="fa fa-play"></i>', action: mSelf.build });
        mContext.ui.addButton({ icon: '<i class="fa fa-wrench"></i>', panel: mSelf.settings });

        // Monitor changes made to the editor's preferences. All changes triggered
        // by the project settings panel will be indexed as 'flashTools'.

        mContext.signals.preferencesUpdated.add(function(theKey, theValue) {
            if(theKey == 'flashTools') {
                saveProjectSettings(theValue);
            }
        });

        // Restore/create project settings locally every time a new project is opened.
        mContext.signals.projectOpened.add(function(theProject) {
            if(theProject.type == 'flash') {
                mContext.preferences.add('flashTools', JSON.parse(theProject.settings));
            }
        });
    };

    this.build = function(theContext, theButton) {
        var aTab            = null;
        var aActiveProject  = mContext.getPlugin('cc.codebot.ide.web').getActiveProject();
        var aParams         = {method: 'build', project: aActiveProject.id};
        var aSettings       = mContext.preferences.get().flashTools;

        theButton.html('<i class="fa fa-refresh fa-spin"></i>');

        console.log('Requesting remote build');

        runRemoteBuild(aParams, function(theData) {
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

        aFolder.add('Output dir', '<input type="text" name="outDir" value="/bin/" />');
        aFolder.add('Output file', '<input type="text" name="outFile" value="Mode.swf" />');
        aFolder.add('Width', '<input type="text" name="width" value="800" />');
        aFolder.add('Height', '<input type="text" name="height" value="600" />');

        var aFolder = aPanel.addFolder('Classpath', 'output');
        aFolder.add('Libs', '<input type="text" name="libs" value="/libs/" />');

        aFolder = aPanel.addFolder('SDK and Compiler', 'sdk');
        aFolder.add('Platform', '<select name="platform"><option value="player">Flash Player</option><option value="air">AIR</option></select>');
        aFolder.add('Version', '<input type="text" name="swf" value="22" />');
        aFolder.add('Other', '<input type="text" name="other" value="/libs/" />');
        aFolder.add('Test', '<input type="text" name="test" value="/libs/" />');
        aFolder.add('Thing', '<select name="thing"><option value="800">Flash Player</option></select>');

        aContent += '<form action="#" id="flash-tools-settings" data-persistent="flashTools">';
        aContent += aPanel.html();
        aContent += '</form>';

        theContainer.append(aContent);
    };

};

CODEBOT.addPlugin(new FlashToolsPlugin());
