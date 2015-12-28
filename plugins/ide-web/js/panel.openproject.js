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
    Codebot.Panel.call(this, 'Open project');
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
IdeWeb.Panel.OpenProject.prototype = Object.create(Codebot.Panel.prototype);
IdeWeb.Panel.OpenProject.prototype.constructor = IdeWeb.Panel.OpenProject;

IdeWeb.Panel.OpenProject.prototype.render = function() {
    var aSelf,
        aIde;

    Codebot.Panel.prototype.render.call(this);

    aSelf = this;
    aIde = this.getContext().getPlugin('cc.codebot.ide.web');

    this.row('<div id="projects-list"></div>');

    $('#projects-list').html('<i class="fa fa-circle-o-notch fa-spin"></i> Loading the list, please wait.');

    aIde.findProjects(function(theProjects) {
        var aInfo = '';

        for(var i in theProjects) {
            aInfo +=
                '<a href="javascript:void(0);" data-project-id="' + theProjects[i].id + '">' +
                    '<div>' +
                        '<img src="" alt="' + theProjects[i].type + '" />' +
                        '<p>' + theProjects[i].name + '</p>' +
                    '</div>' +
                '</a>';
        }

        $('#projects-list').html(aInfo);

        $('#projects-list a').click(function() {
            aIde.openProject($(this).data('project-id'));
            aSelf.close();
        });
    }, this);
};
