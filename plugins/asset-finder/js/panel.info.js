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

// Namespace for the asset finder plugin
var AssetFinder = AssetFinder || {};

// Namespace for panels
AssetFinder.Panel = AssetFinder.Panel || {};

/**
 * Represents the panel that displays information
 * about an specific asset. It contains preview images,
 * downloading links, description, etc.
 */
AssetFinder.Panel.Info = function(theTitle, theContainerId) {
    // Call constructor of base class
    Codebot.Panel.call(this, theTitle, theContainerId);

    this.container.fadeIn();
    this.container.html('Loading...');
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
AssetFinder.Panel.Info.prototype = Object.create(Codebot.Panel.prototype);
AssetFinder.Panel.Info.prototype.constructor = AssetFinder.Panel.Info;

AssetFinder.Panel.Info.prototype.renderFromData = function(theItemId, theData) {
    var i,
        aIde,
        aProjectFolders,
        aFoldersText = '',
        aSelf = this;

    // Clear the panel content.
    this.empty();

    // Get a reference to the web ID plugin.
    aIde = this.context.getPlugin('cc.codebot.ide.web');
    this.setTitle(theData.title);
    this.divider('Preview');
    this.row('<div style="text-align: center;"><img src="'+theData.preview[0]+'" style="max-width: 300px;"/></div>');

    // TODO: move findProjectTopFolders() to filespanel class.
    aProjectFolders = this.findProjectTopFolders();

    for(i = 0, aTotal = aProjectFolders.length; i < aTotal; i++) {
        aFoldersText += '<option value="' + aProjectFolders[i].path + '">/' + aProjectFolders[i].name + '</option>';
    }
    this.divider('Add to project');
    this.row('<i class="fa fa-folder-open"></i> <select id="assetDestinationDir" style="width: 70%;"><option value="/">/</option>'+aFoldersText+'</select> <button id="assetDownloadLink" style="margin-left: 10px; margin-top: 4px; width: 20%"><i class="fa fa-download"></i> Add</button>');

    this.divider('Details');
    this.pair('Title', theData.title);
    this.pair('Author', theData.author);
    this.pair('License', this.getLicenseNameById(theData.license) + ' <i class="fa fa-warning" title="This information was obtained automatically so it might be wrong. Please inspect the license information provided by the author to be sure about it."></i>');
    this.pair('Channel', '<img src="http://favicon.yandex.net/favicon/' + theData.channel +'" title="' + theData.channel + '"/> <a href="' + theData.url + '" target="_blank">' + theData.channel + '</a>');

    this.divider('Description');
    this.row('<div style="max-height: 350px; overflow: auto;">' + theData.description.replace(/\n/g, '<br />') + '</div>');

    this.divider('Attribution');
    this.row(theData.attribution);

    this.container.find('#assetDownloadLink').click(function() {
        aSelf.addAssetToProject(theItemId);
    });
};

AssetFinder.Panel.Info.prototype.getLicenseNameById = function(theLicenseId) {
    var aLicenses,
        aRet = 'Unknown',
        i;

    aLicenses = this.getContext().getPlugin('cc.codebot.asset.finder').getLicenses();

    for(i = 0; i < aLicenses.length; i++) {
        if(aLicenses[i].id == theLicenseId) {
            aRet = aLicenses[i].name;
            break;
        }
    }

    return aRet;
};

AssetFinder.Panel.Info.prototype.addAssetToProject = function(theItemId) {
    var aIde = this.context.getPlugin('cc.codebot.ide.web')
        aSelf = this;

    // TODO: make pending activity a global Codebot thing with categories (e.g. filesPanel)
    this.context.ui.filesPanel.addPendingActivity('downloading' + theItemId, 'Downloading asset', 'Fetching item to "' + this.container.find('select#assetDestinationDir').val() + '"');

    aIde.api('assets', 'fetch', {item: theItemId, project: aIde.getActiveProject().id, destination: this.container.find('select#assetDestinationDir').val()}, function(theData) {
        this.context.ui.filesPanel.removePendingActivity('downloading' + theItemId);

        if(theData.success) {
            aIde.refreshProjectFileList();

        } else {
            // TODO: show the error somewhere.
            console.error(theData.message);
        }
    }, this);

    this.pop();
};

AssetFinder.Panel.Info.prototype.findProjectTopFolders = function() {
    var aRoot = this.context.ui.filesPanel.tree,
        aRet = [];
        i = 0;

    for(i = 0; i < aRoot.children.length; i++) {
        if(aRoot.children[i].folder) {
            aRet.push(aRoot.children[i].data);
        }
    }

    return aRet;
};

AssetFinder.Panel.Info.prototype.onPause = function() {
    this.container.fadeOut('fast');
};

AssetFinder.Panel.Info.prototype.onResume = function() {
    this.container.fadeIn('fast');
};
