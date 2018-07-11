/*
	The MIT License (MIT)

	Copyright (c) 2016 Fernando Bevilacqua

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

var Codebot = Codebot || {};

// Namespaces
Codebot.Settings = Codebot.Settings || {};
Codebot.Settings.Panel = Codebot.Settings.Panel || {};

/**
 * This is the panel displayed when the user clicks the settings icon (cogs)
 * at the bottom right of the screen. It orchestrates all other panels
 * related to settings in general, e.g. code editor.
 */
Codebot.Settings.Panel.Main = function() {
    // Call constructor of base class
    Codebot.Panel.call(this, 'Codebot');
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Codebot.Settings.Panel.Main.prototype = Object.create(Codebot.Panel.prototype);
Codebot.Settings.Panel.Main.prototype.constructor = Codebot.Settings.Panel.Main;

Codebot.Settings.Panel.Main.prototype.init = function() {
};

Codebot.Settings.Panel.Main.prototype.render = function() {
    var aSections,
        aContent = '',
        aSelf = this,
        i;

    Codebot.Panel.prototype.render.call(this);

    // Show some nice about info about Codebot
    this.row(
        '<div class="settings-panel-main">' +
            '<img src="./img/logo/codebot-logo.png" title="Codebot" />' +
            '<p class="version">1.0.0-ALPHA</p> ' +
            '<p class="relase-notes"><a href="javascript:void(0);">release notes</a></p>' +
            '<p class="developer"><i class="fa fa-code"></i> Developed by <a href="https://twitter.com/as3gamegears" target="_blank">@As3GameGears</a> with help from <a href="javascript:void(0)">awesome open-source projects</a>.' +
        '</div>'
    );

    // Show all settings sections
    this.divider('Settings');

    aSections = this.getContext().settings.getSections();

    aContent += '<ul>';
    for(i in aSections) {
        aContent += '<a href="javascript:void(0);" data-section="' + i + '" class="setting-section"><li>' + aSections[i].icon + ' ' + aSections[i].title + '</li></a>';
    }
    aContent += '</ul>';
    this.row(aContent);

    // Section to provide feedback
    this.divider('Feedack');
    this.row(
        '<ul>' +
            '<a href="javascript:void(0);"><li><a href="https://github.com/Dovyski/Codebot/issues/new" target="_blank"><i class="fa fa-bug"></i>Report a bug</a></a>' +
            '<a href="javascript:void(0);"><li><a href="https://github.com/Dovyski/Codebot/issues/new" target="_blank"><i class="fa fa-comment"></i>Send comment</a></a>' +
        '</ul>'
    );

    var aIde = this.getContext().plugins.get('cc.codebot.ide.web');

    if(aIde) {
        // Section with info about the authenticated user
        var aUser = aIde.getUser();

        this.divider('User');
        this.row(
            '<div class="settings-panel-main-user">' +
                '<img src="https://www.gravatar.com/avatar/' + aUser.gravatar_hash + '?s=80" title="' + aUser.email + '" />' +
                '<p class="name">User' + aUser.id + '</p> ' +
                '<p class="email">' + aUser.email + '</p>' +
            '</div>'
        );
        this.row(
            '<ul>' +
                '<a href="javascript:void(0);" data-action="profile" class="clickable"><li><i class="fa fa-user"></i> Edit profile</li></a>' +
            '</ul>'
        );
        this.divider('Authentication');
        this.row(
            '<ul>' +
                '<a href="javascript:void(0);" data-action="logout" class="clickable"><li><i class="fa fa-sign-out"></i> Sign out</li></a>' +
            '</ul>'
        );

        // Make sign-out link clickable
        this.container.find('a.clickable').each(function(theIndex, theElement) {
            $(theElement).click(function() {
                var aAction = $(this).data('action');
                if(aAction == 'logout') {
                    aIde.logout();
                } else if(aAction == 'profile') {
                    aSelf.push(IdeWeb.Panel.Credentials);
                }
            });
        });
    }

    // Make all sections clickable
    this.container.find('a.setting-section').each(function(theIndex, theElement) {
        $(theElement).click(function() {
            var aId = $(this).data('section');
            aSelf.push(aSections[aId].panel);
        });
    });
};
