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

// Namespace for IDE (web)
var IdeWeb = IdeWeb || {};

// Namespace for panels
IdeWeb.Panel = IdeWeb.Panel || {};

/**
 * Represents the panel that will be displayed when the
 * user wants to create a new project.
 */
IdeWeb.Panel.CreateProject = function() {
    // Call constructor of base class
    Codebot.Panel.call(this, 'Create new project');
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
IdeWeb.Panel.CreateProject.prototype = Object.create(Codebot.Panel.prototype);
IdeWeb.Panel.CreateProject.prototype.constructor = IdeWeb.Panel.CreateProject;

IdeWeb.Panel.CreateProject.prototype.render = function() {
    var aSelf = this;

    Codebot.Panel.prototype.render.call(this);

    this.divider('Type');
    this.row('<select name="type" id="project-type">' + this.generateAvailableProjectTypes() + '</select>');

    this.divider('Template');

    // TODO: move in-line style to external CSS file.
    this.row('<div id="project-git-repo-panel"><i class="fa fa-code-fork fa-2x"></i> <input type="text" name="git-repo" id="project-git-repo" placeholder="e.g. https://github.com/User/proj.git" style="width: 100%; text-indent: 30px;"></div>');
    this.row('<div id="project-templates" style="overflow: auto;"></div><input type="hidden" name="template" id="project-template" value="none" />');

    this.divider('Project settings');

    this.pair('Name', '<input type="text" name="name" id="project-name" placeholder="Projet name"/>');
    this.pair('Visibility', '<select name="visibility"><option value="public">Public</option><option value="private">Private (not available yet)</option></select>');
    this.row('<br />');
    this.row('<div style="text-align: center;"><button type="submit" id="btn-create-project">Create project</button></div>');

    $('#btn-create-project').click(function() {
        aSelf.doCreationProcess();
    });

    var aProjectType = $('#project-type').val();

    this.renderTemplatesList(aProjectType);
    this.selectFistAvailableTemplate(aProjectType);

    // Change the templates list content everytime the
    // projects type changes.
    $('#project-type').change(function(theEvent) {
        aSelf.renderTemplatesList(theEvent.target.value);
    });
};

IdeWeb.Panel.CreateProject.prototype.validateProjectInformation = function(theProjectData) {
    var aOk = true;

    if(theProjectData.name == '') {
        aOk = false;
        $('#project-name').addClass('error');
    } else {
        $('#project-name').removeClass('error');
    }

    if(theProjectData.template == 'git' && theProjectData['git-repo'] == '') {
        aOk = false;
        $('#project-git-repo').addClass('error');
    } else {
        $('#project-git-repo').removeClass('error');
    }

    return aOk;
};

IdeWeb.Panel.CreateProject.prototype.doCreationProcess = function() {
    var aProject = this.getData();
    var aOk = this.validateProjectInformation(aProject);

    if(aOk) {
        var aIde = this.getContext().plugins.get('cc.codebot.ide.web');
        aIde.createProject(aProject);
    }
};

IdeWeb.Panel.CreateProject.prototype.generateAvailableProjectTypes = function() {
    var aFactory,
        aType,
        aOut = '';

    aFactory = this.getContext().plugins.get('cc.codebot.ide.web').getProjectFactory();

    if(aFactory) {
        for(aType in aFactory) {
            aOut += '<option value="' + aType + '">' + aFactory[aType].name + '</option>';
        }
    }

    return aOut;
};

IdeWeb.Panel.CreateProject.prototype.renderTemplatesList = function(theType) {
    var aSelf = this;

    // Populate the templates list
    $('#project-templates').html(this.generateTemplatesList(theType));

    // Handle clicks on template options
    $('#project-templates a').click(function(theEvent) {
        aTemplate = $(this).data('template');
        aSelf.selectTemplate(aTemplate);
    });
};

IdeWeb.Panel.CreateProject.prototype.selectFistAvailableTemplate = function(theProjectType) {
    var aAvailableTemplates = this.findAvailableTemplates(theProjectType);

    if(aAvailableTemplates.length > 0) {
        this.selectTemplate(aAvailableTemplates[0].name);
    }
};

IdeWeb.Panel.CreateProject.prototype.selectTemplate = function(theTemplateName) {
    $('#project-templates a').removeClass('selected');
    $('#project-templates a[data-template="' + theTemplateName + '"]').addClass('selected');

    $('#project-template').val(theTemplateName);

    if(theTemplateName == 'git') {
        $('#project-git-repo-panel').slideDown();
    } else {
        $('#project-git-repo-panel').slideUp();
    }
};

IdeWeb.Panel.CreateProject.prototype.findAvailableTemplates = function(theProjectType) {
    var aProjectFactory, aAvailableTemplates = [];

    aProjectFactory = this.getContext().plugins.get('cc.codebot.ide.web').getProjectFactory();

    if(aProjectFactory && aProjectFactory[theProjectType]) {
        var aFactory = aProjectFactory[theProjectType];

        for(var aTemplate in aFactory.templates) {
            var aInfo = aFactory.templates[aTemplate];
            aAvailableTemplates.push(aInfo);
        }
    }

    return aAvailableTemplates;
};

IdeWeb.Panel.CreateProject.prototype.generateTemplatesList = function(theType) {
    var aContent = '',
        aAvailableTemplates;

    aAvailableTemplates = this.findAvailableTemplates(theType);

    for(var i = 0; i < aAvailableTemplates.length; i++) {
        var aTemplate = aAvailableTemplates[i];

        aContent +=
            '<a href="javascript:void(0)" data-template="' + aTemplate.name + '">' +
                '<div class="project-template">' +
                    '<img src="' + aTemplate.icon + '" alt="Preview"><br />' +
                    aTemplate.name +
                '</div>' +
            '</a>';
    }

    // All types have a bult-in git template.
    aContent =
        '<a href="javascript:void(0)" data-template="git">' +
            '<div class="project-template">' +
                '<img src="img/icons/project-git.png" alt="Preview"><br />' +
                'Clone from Git' +
            '</div>' +
        '</a>' +
        aContent;

    return aContent;
};
