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
 * user wants to open an existing project.
 *
 * TODO: move this to its own file
 */
IdeWeb.Panel.OpenProject = function() {
    // Call constructor of base class
    Codebot.Panel.call(this, 'Projects');
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
IdeWeb.Panel.OpenProject.prototype = Object.create(Codebot.Panel.prototype);
IdeWeb.Panel.OpenProject.prototype.constructor = IdeWeb.Panel.OpenProject;

IdeWeb.Panel.OpenProject.prototype.render = function() {
    var aSelf,
        aIde,
        aFactory;

    Codebot.Panel.prototype.render.call(this);

    aSelf = this;
    aIde = this.getContext().plugins.get('cc.codebot.ide.web');
    aProjectFactory = aIde.getProjectFactory();

    this.row('<div id="projects-list"></div>');

    $('#projects-list').html('<i class="fa fa-circle-o-notch fa-spin"></i> Loading the list, please wait.');

    aIde.findProjects(function(theProjects) {
        var aInfo = '',
            aDate,
            aId;

        for(var i in theProjects) {
            aDate = new Date(theProjects[i].creation_date * 1000);
            aId = theProjects[i].id;
            aInfo +=
                '<a href="javascript:void(0);" data-project-id="' + aId + '">' +
                    '<div class="project">' +
                        '<div class="summary">' +
                            '<img src="' + (aProjectFactory[theProjects[i].type].icon) + '" title="' + theProjects[i].type + '"/>' +
                            '<h2>' + theProjects[i].name + '</h2>' +
                            '<p><i class="fa fa-unlock" title="Anyone can see this project"></i>Public</p>' +
                            '<p><i class="fa fa-calendar-o" title="Creation date"></i>' + aDate.getFullYear() + '/' + aDate.getMonth() + '/' + aDate.getDay() +'</p>' +
                        '</div>' +
                        '<div class="info">' +
                            '<button data-project-id="' + aId + '" data-action="open"><i class="fa fa-folder-open"></i> Open</button> ' +
                            '<button data-project-id="' + aId + '" data-action="edit"><i class="fa fa-edit"></i> Edit</button> ' +
                            '<button data-project-id="' + aId + '" data-action="delete"><i class="fa fa-trash"></i> Delete</button> ' +
                        '</div>' +
                    '</div>' +
                '</a>';
        }

        $('#projects-list').html(aInfo);

        $('#projects-list a').click(function() {
            aSelf.expand($(this).data('project-id'));
        });

        $('#projects-list button').click(function() {
            aSelf.handleButtonClick($(this).data('project-id'), $(this).data('action'));
        });
    }, this);
};

IdeWeb.Panel.OpenProject.prototype.handleButtonClick = function(theProjectId, theAction) {
    var aIde;

    aIde = this.getContext().plugins.get('cc.codebot.ide.web');

    if(theAction == 'open') {
        aIde.openProject(theProjectId);
        this.pop();

    } else if(theAction == 'edit') {
        // TODO: show a nice panel to edit things
        this.push(Dummy.Panel);

    } else if(theAction == 'delete') {
        // TODO: confirm and delete
        $('#projects-list a[data-project-id="' + theProjectId + '"] div.project').slideUp();
    }
};

IdeWeb.Panel.OpenProject.prototype.expand = function(theProjectId) {
    $('#projects-list [data-project-id="' + theProjectId + '"] div.info').slideToggle('fast');
};
