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

    // Set a data manager for this panel. A data manager will save and restore
    // data to any form element in this panel.
    this.setDataManager('cc.codebot.asset.finder');

    // Get a reference to the div that will be used to display
    // more info of a clicked asset.
    this.infoPanel = $('#af-item-description');
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
AssetFinder.MainPanel.prototype = Object.create(Codebot.Panel.prototype);
AssetFinder.MainPanel.prototype.constructor = AssetFinder.MainPanel;

AssetFinder.MainPanel.prototype.render = function() {
    var aSelf = this;

    Codebot.Panel.prototype.render.call(this);

    this.divider('Options');

    this.pair('Search', '<input type="text" name="query" value="" />');
    this.pair(
        'License',
        '<select name="license">' +
            '<option value="1">CC-BY 3.0</option>' +
            '<option value="2">CC-BY-SA 3.0</option>' +
            '<option value="4">GPL 3.0</option>' +
        '</select>' +
        '<input type="hidden" name="start" value="0">' +
        '<input type="hidden" name="limit" value="50">'
    );
    this.pair('', '<button id="af-search">Search</button>');

    this.divider('Results');
    this.row('<div id="af-browse-area">Nothing to show yet.</div>');

    $('#af-search').click(function() { aSelf.doSearch(); });

    // TODO: improve this.
    $("#af-browse-area").scroll(function() {
        var aHasReachedBottom = $(this)[0].scrollHeight - $(this).scrollTop() <= $(this).outerHeight();

        if(aHasReachedBottom) {
            loadMoreSearchResults();
        }
    });
};

AssetFinder.MainPanel.prototype.findProjectTopFolders = function() {
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

AssetFinder.MainPanel.prototype.showItemInfo = function(theItemId) {
    var i,
        aIde,
        aPanel,
        aFolder,
        aContent,
        aProjectFolders,
        aFoldersText = '',
        aSelf = this;

    // Get a reference to the web ID plugin.
    aIde = this.context.getPlugin('cc.codebot.ide.web');

    this.infoPanel.html('<i class="fa fa-circle-o-notch fa-spin"></i>');
    this.infoPanel.fadeIn();

    aIde.api('assets', 'info', {item: theItemId}, function(theData) {
        // Clear the content of the info panel
        this.infoPanel.html('');

        // Create a cool panel and render its content in the info panel div.
        aPanel = new Codebot.Panel(theData.title, this.infoPanel.attr('id'));

        aPanel.divider('Preview');
        aPanel.row('<div style="text-align: center;"><img src="'+theData.preview[0]+'" style="max-width: 300px;"/></div>');

        aProjectFolders = this.findProjectTopFolders();

        for(i = 0, aTotal = aProjectFolders.length; i < aTotal; i++) {
            aFoldersText += '<option value="' + aProjectFolders[i].path + '">/' + aProjectFolders[i].name + '</option>';
        }
        aPanel.divider('Add to project');
        aPanel.row('<i class="fa fa-folder-open"></i> <select id="assetDestinationDir" style="width: 70%;"><option value="/">/</option>'+aFoldersText+'</select> <button id="assetDownloadLink" style="margin-left: 10px; margin-top: 4px; width: 20%"><i class="fa fa-download"></i> Add</button>');

        aPanel.divider('Details');
        aPanel.pair('Author', theData.author);
        aPanel.pair('License', theData.license);
        aPanel.pair('Channel', theData.channel);

        aPanel.divider('Description');
        aPanel.row(theData.description);

        this.infoPanel.find('#assetDownloadLink').click(function() {
            aSelf.infoPanel.fadeOut();
            // TODO: make pending activity a global Codebot thing with categories (e.g. filesPanel)
            aSelf.context.ui.filesPanel.addPendingActivity('downloading' + theItemId, 'Downloading asset', 'Fetching item to "' + aSelf.infoPanel.find('select#assetDestinationDir').val() + '"');

            aIde.api('assets', 'fetch', {item: theItemId, project: aIde.getActiveProject().id, destination: aSelf.infoPanel.find('select#assetDestinationDir').val()}, function(theData) {
                aSelf.context.ui.filesPanel.removePendingActivity('downloading' + theItemId);

                if(theData.success) {
                    aIde.refreshProjectFileList();

                } else {
                    // TODO: show the error somewhere.
                    console.error(theData.message);
                }
            });
        });
    }, this);
};

AssetFinder.MainPanel.prototype.doSearch = function() {
    var i, aContent = '', aIde, aSelf = this;

    aIde = this.getContext().getPlugin('cc.codebot.ide.web');

    $('#af-browse-area').html('<i class="fa fa-circle-o-notch fa-spin"></i>');

    aIde.api('assets', 'search', this.serialize(), function(theData) {
        if(theData.success) {
            for(i = 0; i < theData.items.length; i++) {
                aContent += '<a href="javascript:void(0)" data-item="'+theData.items[i].id+'"><img src="'+theData.items[i].thumbnail+'" alt="Preview" style="width: 90px; height: 90px; padding: 2px;"></a>';

            }
            $('#af-browse-area').html(aContent);

            $('#af-browse-area a').click(function() {
                aSelf.showItemInfo($(this).data('item'));
            });
        }
    });
}

AssetFinder.MainPanel.prototype.loadMoreSearchResults = function() {
    // TODO: implement this.
    console.log('loadMoreSearchResults?');
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

AssetFinder.Plugin.prototype.savePanelData = function(thePanel, theData) {
    console.debug('AssetFinder::savePanelData', thePanel, theData);
};

AssetFinder.Plugin.prototype.getPanelData = function(thePanel) {
    return null;
};

AssetFinder.Plugin.prototype.initUIAfterProjectOpened = function(theProjectInfo) {
    this.context.ui.addButton(this.id + 'mainPanel', { icon: '<i class="fa fa-picture-o"></i>', panel: AssetFinder.MainPanel });
    this.context.ui.addButton('testingPanel', { icon: '<i class="fa fa-rocket"></i>', panel: this.testPanel });
};

AssetFinder.Plugin.prototype.init = function(theContext) {
    // Call super class init method.
    Codebot.Plugin.prototype.init.call(this, theContext);

    console.debug('AssetFinder.Plugin:init()');

    $('body').append('<div id="af-item-description" style="display: none; position: absolute; top:0; right: 333px; width: 600px; height: 100%; background: #3d3d3d; overflow: hidden;"></div>');
    this.infoPanel = $('#af-item-description');

    this.context.signals.beforeLastSlidePanelClose.add(function() {
        this.infoPanel.fadeOut();
    }, this);

    this.context.signals.projectOpened.add(this.initUIAfterProjectOpened, this);
};

CODEBOT.addPlugin(new AssetFinder.Plugin());
