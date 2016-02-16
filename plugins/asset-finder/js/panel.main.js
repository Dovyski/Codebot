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
 * Represents the panel that will be displayed when the
 * assets plugin button is clicked.
 */
AssetFinder.Panel.Main = function() {
    // Call constructor of base class
    Codebot.Panel.call(this, 'Asset Finder');

    // Set a data manager for this panel. A data manager will save and restore
    // data to any form element in this panel.
    this.setDataManager('cc.codebot.asset.finder');

    // A panel do display infos of clicked items
    this.infoPanel = null;
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
AssetFinder.Panel.Main.prototype = Object.create(Codebot.Panel.prototype);
AssetFinder.Panel.Main.prototype.constructor = AssetFinder.Panel.Main;

AssetFinder.Panel.Main.prototype.render = function() {
    Codebot.Panel.prototype.render.call(this);

    this.divider('Search');
    this.row(
        '<input type="text" name="query" id="af-query" value="" placeholder="E.g. zombie" style="width: 75%; margin-right: 5px;" />' +
        '<button id="af-search" style="width: 20%;"><i class="fa fa-search"></i></button>' +
        '<input type="hidden" name="start" value="0">' +
        '<input type="hidden" name="limit" value="50">'
    );

    this.divider('Filters');
    this.pair('License', this.generateLicensesSelection());
    this.pair('Type', '<select><option>Test</option></select>');

    this.divider('Results');
    this.row('<div id="af-browse-area">Nothing to show yet.</div>');

    this.initUI();
};

AssetFinder.Panel.Main.prototype.initUI = function() {
    var aSelf = this;

    $('#af-search').click(function() {
        aSelf.search();
    });

    $('#af-query').keypress(function(theEvent) {
        if(theEvent.which == 13) {
            aSelf.search();
        }
    });

    // TODO: improve this.
    $("#af-browse-area").scroll(function() {
        var aHasReachedBottom = $(this)[0].scrollHeight - $(this).scrollTop() <= $(this).outerHeight();

        if(aHasReachedBottom) {
            aSelf.loadMoreSearchResults();
        }
    });
};

AssetFinder.Panel.Main.prototype.generateLicensesSelection = function() {
    var aLicenses,
        aRet = '',
        i;

    aLicenses = this.getContext().getPlugin('cc.codebot.asset.finder').getLicenses();

    for(i = 0; i < aLicenses.length; i++) {
        aRet += '<option value="' + aLicenses[i].id + '">' + aLicenses[i].name + '</option>';
    }

    return '<select name="license">' + aRet + '</select>';
};

AssetFinder.Panel.Main.prototype.showItemInfo = function(theItemId) {
    var aIde;

    // Initialize the panel that displays infos about a clicked asset.
    $('body').append('<div id="af-item-description" style="display: none; position: absolute; top:0; right: 333px; width: 600px; height: 100%; overflow: hidden;"></div>');
    this.infoPanel = new AssetFinder.Panel.Info('Asset information', 'af-item-description');
    this.infoPanel.context = this.context;

    aIde = this.context.getPlugin('cc.codebot.ide.web');

    aIde.api('assets', 'info', {item: theItemId}, function(theData) {
        this.infoPanel.renderFromData(theItemId, theData);
    }, this);
};

AssetFinder.Panel.Main.prototype.search = function() {
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
};

AssetFinder.Panel.Main.prototype.onDestroy = function() {
    if(this.infoPanel) {
        this.infoPanel.onDestroy();
    }
};

AssetFinder.Panel.Main.prototype.onPause = function() {
    if(this.infoPanel) {
        this.infoPanel.onPause();
    }
};

AssetFinder.Panel.Main.prototype.onResume = function() {
    if(this.infoPanel) {
        this.infoPanel.onResume();
    }
};

AssetFinder.Panel.Main.prototype.loadMoreSearchResults = function() {
    // TODO: implement this.
    console.log('loadMoreSearchResults?');
};
