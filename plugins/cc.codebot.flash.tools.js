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

/**
 * A plugin that enables Codebot to work with AS3 projects.
 */
var FlashToolsPlugin = function() {
    const API_URL   = 'plugins/flash-tools/api.php';

    this.id         = 'cc.codebot.flash.tools';

    var mSelf       = null;
    var mContext    = null;

    var runRemoteBuild = function(theCallback) {
        console.debug('Asking for remote build...');

        var aActiveProject = mContext.getPlugin('cc.codebot.ide.web').getActiveProject();

        $.ajax({
            url: API_URL,
            method: 'post',
            data: {method: 'build', project: aActiveProject.id},
            dataType: 'json'
        }).done(function(theData) {
            theCallback(theData);

        }).fail(function(theJqXHR, theTextStatus, theError) {
            console.error('Buil problem: ' + theTextStatus + ', ' + theError);
        });
    };

    this.init = function(theContext) {
        mSelf = this;
        mContext = theContext;

        mContext.ui.addButton({ icon: '<i class="fa fa-play"></i>', action: mSelf.build });
        mContext.ui.addButton({ icon: '<i class="fa fa-wrench"></i>', panel: mSelf.settings });
    };

    this.build = function(theContext, theButton) {
        var aTab = null;

        aTab = mContext.ui.tabs.add({
            favicon: 'file-text-o', // TODO: dynamic icon?
            title: 'Build',
            file: 'Build.log',
            path: 'build.log',
            node: null,
            editor: null
        });

        theButton.html('<i class="fa fa-circle-o-notch fa-spin"></i>');

        aTab.editor = mContext.editors.create(aTab, 'Build started...', {name: 'Mode.swf'});

        runRemoteBuild(function(theData) {
            console.debug('Remote build received!', theData);

            theButton.html('<i class="fa fa-play"></i>');

            if(theData.success) {
                aTab.editor.renderSWFByURL(theData.testingFileUrl, 640, 480); // TODO: get width/height from response?
            } else {
                aTab.editor.showMessage(theData.log.join('\n'));
            }
        });
    };

    this.settings = function(theContainer, theContext) {
        var aContent = '';
        var aPanel = new CodebotFancyPanel('Project settings');

        var aFolder = aPanel.addFolder('Output', 'output');

        aFolder.add('Output file', '<input type="text" name="outFile" value="/bin/Mode.swf" />');
        aFolder.add('Width', '<input type="text" name="width" value="800" />');
        aFolder.add('Height', '<input type="text" name="height" value="600" />');

        var aFolder = aPanel.addFolder('Classpath', 'output');
        aFolder.add('Libs', '<input type="text" name="libs" value="/libs/" />');

        aFolder = aPanel.addFolder('SDK and Compiler', 'sdk');
        aFolder.add('Platform', '<select name="platform"><option value="800">Flash Player</option></select>');
        aFolder.add('Version', '<select name="swf"><option value="14.0">14.0</option></select>');
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
