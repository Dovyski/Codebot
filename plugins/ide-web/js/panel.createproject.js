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
    var aSelf,
        aIde;

    Codebot.Panel.prototype.render.call(this);

    aSelf = this;
    aIde = this.getContext().plugins.get('cc.codebot.ide.web');

    this.divider('Type');
    this.row('<select name="type" id="project-type">' + this.generateAvailableProjectTypes() + '</select>');

    this.divider('Template');

    // TODO: move in-line style to external CSS file.
    this.row('<div id="project-git-repo-panel"><i class="fa fa-code-fork fa-2x"></i> <input type="text" name="git-repo" id="project-git-repo" placeholder="https://github.com/User/proj.git" style="width: 100%; text-indent: 30px;"></div>');
    this.row('<div id="project-templates" style="overflow: auto;"></div><input type="hidden" name="template" id="project-template" value="none" />');

    this.divider('Project settings');

    this.pair('Name', '<input type="text" name="name" id="project-name" placeholder="Projet name"/>');
    this.pair('Visibility', '<select name="visibility"><option value="public">Public</option><option value="private">Private (not available yet)</option></select>');
    this.row('<br />');
    this.row('<div style="text-align: center;"><button type="submit" id="btn-create-project">Create project</button></div>');

    $('#btn-create-project').click(function() {
        aIde.createProject(aSelf.getData());
    });

    this.renderTemplatesList($('#project-type').val());

    // Change the templates list content everytime the
    // projects type changes.
    $('#project-type').change(function(theEvent) {
        aSelf.renderTemplatesList(theEvent.target.value);
    });
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
    var aTemplate;

    // Populate the templates list
    $('#project-templates').html(this.generateTemplatesList(theType));

    // Handle clicks on template options
    $('#project-templates a').click(function(theEvent) {
        aTemplate = $(this).data('template');

        $('#project-templates a').removeClass('selected');
        $(this).addClass('selected');

        $('#project-template').val(aTemplate);

        if(aTemplate == 'git') {
            $('#project-git-repo-panel').slideDown();
        } else {
            $('#project-git-repo-panel').slideUp();
        }
    });
};

IdeWeb.Panel.CreateProject.prototype.generateTemplatesList = function(theType) {
    var aContent = '',
        aTemplate,
        aInfo,
        aProjectFactory;

    aProjectFactory = this.getContext().plugins.get('cc.codebot.ide.web').getProjectFactory();

    if(aProjectFactory) {
        for(aTemplate in aProjectFactory[theType].templates) {
            aInfo = aProjectFactory[theType].templates[aTemplate];

            aContent +=
                '<a href="javascript:void(0)" data-template="' + aTemplate + '">' +
                    '<div class="project-template">' +
                        '<img src="' + aInfo.icon + '" alt="Preview"><br />' +
                        aInfo.name +
                    '</div>' +
                '</a>';
        }
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
