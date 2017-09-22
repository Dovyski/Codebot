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

// Namespace for the web IDE
var IdeWeb = IdeWeb || {};

/**
 * The bare minimum to use codebot as a IDE (save buttons, etc)
 */
IdeWeb.Plugin = function() {
    const API_URL = 'plugins/ide-web/api/?';
    const LOGIN_URL = 'plugins/ide-web/login';

    var mSelf               = this;
    var mContext            = null;
    var mProjects           = {};
    var mActiveProject      = null;
    var mProjectFactory     = null;

    var initProjectFactory = function() {
        mSelf.api('project', 'factory', null, function(theData) {
            if(theData.success) {
                mProjectFactory = theData.types;
                console.debug('Project factory received: ', mProjectFactory);

            } else {
                console.error('Failed to get project factory: ' + theData.msg);
            }
        });
    };

    var checkAndSaveDirtyTabs = function(theData) {
        var aTotal = mContext.ui.tabs.opened.length,
            i,
            aNotDirty = 0,
            aTab = null;

        if(mActiveProject && aTotal > 0) {
            for(i = 0; i < aTotal; i++) {
                aTab = mContext.ui.tabs.opened[i];

                // Was this tab already saved?
                if(!theData.alreadySaved[aTab.id]) {
                    // Nope, first time saving it.
                    theData.alreadySaved[aTab.id] = true;

                    // Does it need saving?
                    if(aTab.dirty) {
                        console.debug('Tab content auto-save requested', aTab.node.name);
                        mContext.writeTabToDisk(aTab);
                    }
                }

                if(!aTab.dirty) {
                    aNotDirty++;
                }
            }
        }

        if(aNotDirty == aTotal) {
            if(theData.callback) {
                theData.callback();
            }
            return true; // tell the job scheduler to remove this job from the list.
        }
    };

    var initUIAfterProjectOpened = function(theProjectInfo) {
        mContext.ui.addButton(mSelf.id + 'save', {icon: '<i class="fa fa-floppy-o"></i>', action: mSelf.save });
    };

    var handleBeforeFilesPanelRefresh = function(theRootNode) {
        theRootNode.name = mActiveProject.name;
        theRootNode.title = mActiveProject.name;
    };

    var checkUserAuthentication = function() {
        var aDisk = CODEBOT.utils.getURLParamByName('disk');

        if(!aDisk) {
            // TODO: redirect to API endpoint responsible for authentication
            CODEBOT.utils.redirect(LOGIN_URL);
        }
    };

    /**
     * Obtains a list of all existing projects.
     *
     * @param  {Function} theCallback      Callback that will be invoked when the projects list has been loaded. The callback will receive a list of project as an argument.
     * @param  {Object} theCallbackContext Context that will be used when the callback is invoked.
     */
    this.findProjects = function(theCallback, theCallbackContext) {
        mSelf.api('project', 'search', null, function(theData) {
            mProjects = theData.projects;
            theCallback.call(theCallbackContext || this, mProjects);
        });
    };

    /**
     * Open an specific project.
     *
     * @param  {int} theProjectId Id of the project to be opened.
     */
    this.openProject = function(theProjectId) {
        var aProject;

        console.log('CODEBOT [ide] Opening project with id=' + theProjectId);

        mContext.ui.filesPanel.showMessage('<i class="fa fa-circle-o-notch fa-spin"></i><br />Loading project, please wait.');

        mSelf.api('project', 'open', {id: theProjectId}, function(theData) {
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

                mContext.ui.filesPanel.hideMessage();
            } else {
                mContext.ui.filesPanel.showMessage('<i class="fa fa-warning"></i><br />Something wrong happened.<br/>' + (theData.msg || ''));
                console.error('Failed to open project: ' + theData.msg);
            }
        });
    };

    /**
     * Creates a new project.
     *
     * @param  {Object} theData Object containing the project data.
     */
    this.createProject = function(theData) {
        mContext.ui.slidePanel.close();
        mContext.ui.filesPanel.addPendingActivity('new-project', 'Creating project', 'Project XYZ is being created.'); // \TODO: change to global background running tasks approach.

        mSelf.api('project', 'create', theData, function(theResponse) {
            mContext.ui.filesPanel.removePendingActivity('new-project');

            if(theResponse.success) {
                mProjects[theResponse.project.id] = theResponse.project;
                this.openProject(theResponse.project.id);

            } else {
                console.error('Failed to create project: ' + theResponse.msg);
            }
        }, this);
    };

    /**
     * Saves the content of all currently open tabs.
     *
     * @param  {Function} theCallback A callback that will be invoked after the content of all tabs has been saved.
     */
    this.saveAllCurrentlyOpenTabs = function(theCallback) {
        mContext.jobs.add(checkAndSaveDirtyTabs, 500, {alreadySaved: {}, callback: theCallback});
    };

    // TODO: transform it into an object, e.g. api.disk.method().
    // TODO: specify context (this) for callback call.
    this.api = function(theClass, theMethod, theParams, theCallback, theCallbackContext) {
        $.ajax({
            url: API_URL + 'class=' + theClass + '&method=' + theMethod,
            method: 'get',
            data: theParams,
            dataType: 'json'
        }).done(function(theData) {
            console.debug('web API response', theData);
            theCallback.call(theCallbackContext || this, theData);

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

        // Before doing anything, check if the user has all authentication
        // tokens and stuff.
        checkUserAuthentication();

        // Load all required scripts
        mContext.loadScript('./plugins/ide-web/js/panel.openproject.js');
        mContext.loadScript('./plugins/ide-web/js/panel.createproject.js');

        mContext.ui.addButton('newProject', {icon: '<i class="fa fa-desktop"></i>', panel: IdeWeb.Panel.CreateProject });
        mContext.ui.addButton('openProject', {icon: '<i class="fa fa-hdd-o"></i>', panel: IdeWeb.Panel.OpenProject });

        // Schedule the rest of the UI initialization to happen only
        // after a project has been opened.
        mContext.signals.projectOpened.add(initUIAfterProjectOpened);

        // Monitor files panel changes, so we can change the name of the top
        // level folder to reflect the project name.
        mContext.signals.beforeFilesPanelRefresh.add(handleBeforeFilesPanelRefresh);

        initProjectFactory();

        var aProject = CODEBOT.utils.getURLParamByName('project');

        if(aProject) {
            this.openProject(aProject);
        }
    };

    this.save = function(theContext, theButton) {
        var aTab = mContext.ui.tabs.active;

        if(aTab) {
            mContext.writeTabToDisk(aTab);
        }
    };

    this.getProjectFactory = function() {
        return mProjectFactory;
    };
};

IdeWeb.Plugin.meta = {
    className: IdeWeb.Plugin,
    id: 'cc.codebot.ide.web',
    name: 'IDE (Web)',
    description: 'Enable cloud services on https://codebot.cc, such as project hosting.',
    version: '1.0.0-ALPHA'
};

CODEBOT.plugins.add(IdeWeb.Plugin.meta);
