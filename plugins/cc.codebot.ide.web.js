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
    // Constants
    const API_URL       = 'plugins/ide-web/api/?';

    this.id             = 'cc.codebot.ide.web';

    var mSelf           = this;
    var mContext        = null;
    var mProjects       = {};
    var mActiveProject  = null;

    var doCreateNewProject = function() {
        var aData = $('#form-new-project').serialize();

        // TODO: close active slide panel.

        mSelf.api('project', 'create', aData, function(theData) {
            if(theData.success) {
                mProjects[theData.project.id] = theData.project;
                doOpenProject(theData.project.id);

            } else {
                console.error('Failed to create project: ' + theData.msg);
            }
        });
    };

    var doOpenProject = function(theProjectId) {
        var aId = theProjectId || $('#project-to-open').val();
        var aProject;

        console.debug('Opening project with id=' + aId);

        mSelf.api('project', 'open', {id: aId}, function(theData) {
            if(theData.success) {
                aProject = theData.project;

                // Update internal references
                mActiveProject = aProject;
                mProjects[aProject.id] = aProject;

                // If the project has no settings, make it blank then.
                aProject.settings = aProject.settings || {};

                // Tell the IO layer about the path that must be
                // appended to all requests
                mContext.io.setProjectPath(aProject.path);

                // Populate the files panel with project files
                mContext.ui.filesPanel.populateTree(mActiveProject.files);

                // Tell everybody about the newly opened project.
                mContext.signals.projectOpened.dispatch([mActiveProject]);

            } else {
                console.error('Failed to open project: ' + theData.msg);
            }
        });
    };

    var generateTemplatesList = function(theType) {
        var aContent = '';

        // TODO: get this info from a real source.
        // TODO: improve CSS and stuff here.

        aContent +=
            '<a href="javascript:void(0)" data-template="git">' +
                '<div style="width: 90px; padding: 2px; float: left;">' +
                    '<img src="http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/flash/articles/using-sprite-sheet-generator/fig01.gif" alt="Preview" style="width: 80px; height: auto;"><br />' +
                    'Git' +
                '</div>' +
            '</a>';

        aContent +=
            '<a href="javascript:void(0)" data-template="flash">' +
                '<div style="width: 90px; padding: 2px; float: left;">' +
                    '<img src="http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/flash/articles/using-sprite-sheet-generator/fig01.gif" alt="Preview" style="width: 80px; height: auto;"><br />' +
                    'Starling ' + theType +
                '</div>' +
            '</a>';


        return aContent;
    };

    // TODO: transform it into an object, e.g. api.disk.method().
    this.api = function(theClass, theMethod, theParams, theCallback) {
        $.ajax({
            url: API_URL + 'class=' + theClass + '&method=' + theMethod,
            method: 'get',
            data: theParams,
            dataType: 'json'
        }).done(function(theData) {
            console.debug('web API response', theData);
            theCallback(theData);

        }).fail(function(theJqXHR, theTextStatus, theError) {
            console.error('web API error: ' + theTextStatus + ', ' + theError);
        });
    };

    this.refreshProjectFileList = function() {
        mContext.io.readDirectory({path: mActiveProject.path}, mContext.ui.filesPanel.populateTree);
    };

    this.getActiveProject = function() {
        return mActiveProject;
    };

    this.init = function(theContext) {
        console.debug('CoreIdePlugin::init()');

        mContext = theContext;

        mContext.ui.addButton({ icon: '<i class="fa fa-plus-square"></i>', panel: mSelf.newProject });
        mContext.ui.addButton({ icon: '<i class="fa fa-folder-open"></i>', action: mSelf.openProject });
        mContext.ui.addButton({ icon: '<i class="fa fa-floppy-o"></i>', action: mSelf.save });

        var aProject = CODEBOT.utils.getURLParamByName('project');

        if(aProject) {
            doOpenProject(aProject);
        }
    };

    this.newProject = function(theContainer, theContext) {
        var aContent = '',
            aPanel,
            aFolder;

        aPanel  = new CodebotFancyPanel('New project');
        aFolder = aPanel.addFolder();

        aFolder.add('Name', '<input type="text" name="name" id="project-name" />');
        aFolder.add('Type', '<select name="type" id="project-type"><option value="flash">Flash/AS3</option><option value="js">Javascript/HTML5</option></select>');
        aFolder.add(null, '<button type="submit" value="Create" />');

        aFolder = aPanel.addFolder('Template', 'output');

        aFolder.add(null, '<div id="project-templates" style="width: 100%; height: 700px; overflow: none;"></div><input type="hidden" name="template" id="project-template" value="none" />', 'id', 'raw');
        aFolder.add(null, '<div id="project-git-repo-panel" style="width: 100%; display: none;"><input type="text" name="git-repo" id="project-git-repo" placeholder="https://github.com/User/proj.git"></div>', 'id', 'raw');

        aContent += '<form action="javascript:void(0)" id="form-new-project">';
        aContent += aPanel.html();
        aContent += '</form>';

        theContainer.css('background', '#3d3d3d');
        theContainer.append(aContent);

        $('#form-new-project').submit(doCreateNewProject);

        // Populate the templates list
        $('#project-templates').html(generateTemplatesList($('#project-type').val()));

        // Handle clicks on template options
        $('#project-templates a').click(function(theEvent) {
            var aTemplate = $(this).data('template');

            $('#form-new-project input#project-template').val(aTemplate);

            if(aTemplate == 'git') {
                $('#project-git-repo-panel').slideDown();
            } else {
                $('#project-git-repo-panel').fadeOut('fast');
            }
        });

        // Change the templates list content everytime the
        // projects type changes.
        $('#form-new-project select#project-type').change(function(theEvent) {
            $('#project-templates').html(generateTemplatesList(theEvent.target.value));
        });
    };

    this.openProject = function(theContext, theButton) {
        var aForm =
            '<form id="form-open-project">'+
              '<div class="form-group" id="container-list-projects">'+
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

        $('#container-list-projects').html('<i class="fa fa-circle-o-notch fa-spin"></i> Loading the list, please wait.');

        mSelf.api('project', 'search', null, function(theData) {
            var aInfo = '<select class="form-control" name="project-to-open" id="project-to-open">';

            // Save projects for future use.
            mProjects = theData.projects;

            for(var i in theData.projects) {
                aInfo += '<option value="'+theData.projects[i].id+'">'+theData.projects[i].name+' ('+theData.projects[i].type+')</option>';
            }

            aInfo += '</select>';

            $('#container-list-projects').html(aInfo);
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
