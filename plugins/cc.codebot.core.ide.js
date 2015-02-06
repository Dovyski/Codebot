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
 * The bare minimum to use codebot as a IDE (save buttons, etc)
 */
var CoreIdePlugin = function() {
    this.id         = 'cc.codebot.core.ide';

    var mSelf       = null;
    var mContext    = null;

    var doCreateNewProject = function() {
        console.log($('#form-new-project').serialize());
    };

    var doOpenProject = function() {
        console.log('Open project!');

        //mContext.io.chooseDirectory(function(theNode) {
        //    mContext.io.readDirectory(theNode, mContext.ui.filesPanel.populateTree);
        //});
    };

    this.init = function(theContext) {
        console.debug('CoreIdePlugin::init()');

        mSelf = this;
        mContext = theContext;

        mContext.ui.addButton({ icon: '<i class="fa fa-plus-square"></i>', action: mSelf.newProject });
        mContext.ui.addButton({ icon: '<i class="fa fa-folder-open"></i>', action: mSelf.openFolder });
        mContext.ui.addButton({ icon: '<i class="fa fa-floppy-o"></i>', action: mSelf.save });
    };

    this.newProject = function(theContext, theButton) {
        var aForm =
            '<form id="form-new-project">'+
              '<div class="form-group">'+
                '<label for="exampleInputEmail1">Name</label>'+
                '<input type="text" class="form-control" name="name" id="project-name" placeholder="Project name">'+
              '</div>'+
              '<div class="form-group">'+
                '<label for="project-type">Type</label>'+
                '<select class="form-control" name="type" name="project-type">'+
                    '<option value="flash">Flash/AS3</option>'+
                    '<option value="haxe">Haxe (coming soon!)</option>'+
                    '<option value="flash">Javascript (coming soon!)</option>'+
                '</select>'+
              '</div>'+
              '<div class="form-group">'+
                '<label for="project-template">Template</label>'+
                '<select class="form-control" name="template" name="project-template">'+
                    '<option value="none"></option>'+
                    '<option value="flash">Flash/AS3</option>'+
                    '<option value="haxe">Haxe (coming soon!)</option>'+
                    '<option value="flash">Flash/AS3</option>'+
                '</select>'+
              '</div>'+
            '</form>';

        mContext.ui.showDialog({
            keyboard: true,
            title: 'Create project',
            content: aForm,
            buttons: {
                'Create': {css: 'btn-primary', dismiss: true, callback: doCreateNewProject }
            }
        });
    };

    this.openFolder = function(theContext, theButton) {
        var aForm =
            '<form id="form-open-project">'+
              '<div class="form-group">'+
                '<select class="form-control" name="type" name="project-type">'+
                    '<option value="flash">Flash/AS3</option>'+
                    '<option value="haxe">Haxe (coming soon!)</option>'+
                    '<option value="flash">Javascript (coming soon!)</option>'+
                '</select>'+
              '</div>'+
            '</form>';

        mContext.ui.showDialog({
            keyboard: true,
            title: 'Open project',
            content: aForm,
            buttons: {
                'Open': {css: 'btn-primary', dismiss: true, callback: doOpenProject }
            }
        });
    };

    this.save = function(theContext, theButton) {
        var aTab = mContext.ui.tabs.active;

        if(aTab) {
            mContext.writeTabToDisk(aTab);
        }
    };
};

CODEBOT.addPlugin(new CoreIdePlugin());
