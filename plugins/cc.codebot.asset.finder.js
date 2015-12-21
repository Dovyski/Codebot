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

/**
 * Represents the panel that will be displayed when the
 * assets plugin button is clicked.
 *
 * TODO: move this to its own file
 */
AssetFinder.MainPanel = function() {
    // Call constructor of base class
    Codebot.Panel.call(this, 'Asset Finder');
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
AssetFinder.MainPanel.prototype = Object.create(Codebot.Panel.prototype);
AssetFinder.MainPanel.prototype.constructor = AssetFinder.MainPanel;

AssetFinder.MainPanel.prototype.render = function() {
    Codebot.Panel.prototype.render.call(this);

    this.addDivider('Options');

    this.addLabelValueRow('Search', '<form action="#" id="asset-finder-main"><input type="text" name="query" value="" />');
    this.addLabelValueRow(
        'License',
        '<select name="license">' +
            '<option value="1">CC-BY 3.0</option>' +
            '<option value="2">CC-BY-SA 3.0</option>' +
            '<option value="4">GPL 3.0</option>' +
        '</select>' +
        '<input type="hidden" name="start" value="0">' +
        '<input type="hidden" name="limit" value="50">' +
        '</form>'
    );

    this.addDivider('Results');
    this.addRow('<div id="assets-finder-browse-area" style="width: 100%; height: 100%; overflow: scroll;">Nothing to show yet.</div>', false);

    $('#asset-finder-main').submit(function(theEvent) {
        doSearch();
        theEvent.preventDefault();
        return false;
    });

    // TODO: improve this.
    $("#assets-finder-browse-area").scroll(function() {
        var aHasReachedBottom = $(this)[0].scrollHeight - $(this).scrollTop() <= $(this).outerHeight();

        if(aHasReachedBottom) {
            loadMoreSearchResults();
        }
    });
};


/**
 * Search for assets on the interwebs.
 */
AssetFinder.Plugin = function() {
    // Call constructor of base class
    Codebot.Plugin.call(this);

    // Initialize personal stuff
    this.id         = 'cc.codebot.asset.finder';
    this.infoPanel  = null;
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
AssetFinder.Plugin.prototype = Object.create(Codebot.Plugin.prototype);
AssetFinder.Plugin.prototype.constructor = AssetFinder.Plugin;


AssetFinder.Plugin.prototype.findProjectTopFolders = function() {
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

AssetFinder.Plugin.prototype.showItemInfo = function(theItemId) {
    var aIde, aPanel, aFolder, aContent, aProjectFolders, aFoldersText = '';

    aIde = this.context.getPlugin('cc.codebot.ide.web');

    mInfoPanel.html('<i class="fa fa-circle-o-notch fa-spin"></i>');
    mInfoPanel.fadeIn();

    aIde.api('assets', 'info', {item: theItemId}, function(theData) {
        aPanel = new CodebotFancyPanel(theData.title);

        aFolder = aPanel.addFolder('Preview', 'preview');
        aFolder.add('<img src="'+theData.preview[0]+'" style="width: 100%; height: auto;"/>', 'id', 'raw');

        aProjectFolders = findProjectTopFolders();
        for(var i = 0, aTotal = aProjectFolders.length; i < aTotal; i++) {
            aFoldersText += '<option value="' + aProjectFolders[i].path + '">/' + aProjectFolders[i].name + '</option>';
        }
        aFolder = aPanel.addFolder('Download', 'actions');
        aFolder.add('<select id="assetDestinationDir"><option value="/">/</option>'+aFoldersText+'</select> <a href="javascript:void(0)" id="assetDownloadLink"><i class="fa fa-download"></i> DOWNLOAD</a>', 'Save to');

        aFolder = aPanel.addFolder('Details', 'details');
        aFolder.add(theData.author, 'Author');
        aFolder.add(theData.license, 'License');
        aFolder.add(theData.channel, 'Channel');

        aFolder = aPanel.addFolder('Description', 'description');
        aFolder.add(theData.description);

        mInfoPanel.html(aPanel.html());

        mInfoPanel.find('a#assetDownloadLink').click(function() {
            mInfoPanel.fadeOut();
            this.context.ui.filesPanel.addPendingActivity('downloading' + theItemId, 'Downloading asset', 'Fetching item to "' + mInfoPanel.find('select#assetDestinationDir').val() + '"');

            aIde.api('assets', 'fetch', {item: theItemId, project: aIde.getActiveProject().id, destination: mInfoPanel.find('select#assetDestinationDir').val()}, function(theData) {
                this.context.ui.filesPanel.removePendingActivity('downloading' + theItemId);

                if(theData.success) {
                    aIde.refreshProjectFileList();

                } else {
                    // TODO: show the error somewhere.
                    console.error(theData.message);
                }
            });
        });
    });
};

AssetFinder.Plugin.prototype.doSearch = function() {
    var i, aContent = '', aIde;

    aIde = this.context.getPlugin('cc.codebot.ide.web');

    $('#assets-finder-browse-area').html('<i class="fa fa-circle-o-notch fa-spin"></i>');

    aIde.api('assets', 'search', $('#asset-finder-main').serialize(), function(theData) {
        if(theData.success) {
            for(i = 0; i < theData.items.length; i++) {
                aContent += '<a href="javascript:void(0)" data-item="'+theData.items[i].id+'"><img src="'+theData.items[i].thumbnail+'" alt="Preview"></a>';

            }
            $('#assets-finder-browse-area').html(aContent);

            $('#assets-finder-browse-area a').click(function() {
                showItemInfo($(this).data('item'));
            });
        }
    });
}

AssetFinder.Plugin.prototype.loadMoreSearchResults = function() {
    // TODO: implement this.
    console.log('loadMoreSearchResults?');
};

AssetFinder.Plugin.prototype.initUIAfterProjectOpened = function(theProjectInfo) {
    this.context.ui.addButton(this.id + 'mainPanel', { icon: '<i class="fa fa-picture-o"></i>', panel: AssetFinder.MainPanel });
    this.context.ui.addButton('testingPanel', { icon: '<i class="fa fa-rocket"></i>', panel: this.testPanel });
};

AssetFinder.Plugin.prototype.init = function(theContext) {
    // Call super class init method.
    Codebot.Plugin.prototype.init.call(this, theContext);

    console.debug('AssetFinder.Plugin:init()');

    $('body').append('<div id="asset-info-item-description" style="display: none; position: absolute; top:0; right: 333px; width: 600px; height: 100%; background: #3d3d3d; overflow: hidden;"></div>');
    this.infoPanel = $('#asset-info-item-description');

    this.context.signals.beforeLastSlidePanelClose.add(function() {
        this.infoPanel.fadeOut();
    }, this);

    this.context.signals.projectOpened.add(this.initUIAfterProjectOpened, this);
};

CODEBOT.addPlugin(new AssetFinder.Plugin());
