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

/**
 * Search for assets from within Codebot.
 */
var AssetFinderPlugin = function() {
    this.id             = 'cc.codebot.asset.finder';
    var mSelf           = this;
    var mContext        = null;

    var showItemInfo = function(theItemId) {
        var aIde, aPanel, aFolder, aContent;

        aIde = mContext.getPlugin('cc.codebot.ide.web');

        $('body').append('<div id="asset-info-item-description" style="position: absolute; top:0; right: 333px; width: 600px; height: 100%; background: #3d3d3d; overflow: hidden;">info '+theItemId+'</div>');

        $('#asset-info-item-description').html('<i class="fa fa-circle-o-notch fa-spin"></i>');

        aIde.api('assets', 'info', {item: theItemId}, function(theData) {
            aPanel = new CodebotFancyPanel(theData.title);

            aFolder = aPanel.addFolder('Preview', 'preview');
            aFolder.add(null, '<img src="'+theData.preview[0]+'" style="width: 100%; height: auto;"/>', 'id', 'raw');

            aFolder = aPanel.addFolder('Download', 'actions');
            aFolder.add('Download to', '<select name="downloadTo"><option value="/assets">/assets</option><option value="/another">/another</option></select>');

            aFolder = aPanel.addFolder('Details', 'details');
            aFolder.add('Author', theData.author);
            aFolder.add('License', theData.license);
            aFolder.add('Channel', theData.channel);

            aFolder = aPanel.addFolder('Description', 'description');
            aFolder.add(null, theData.description, 'id', 'raw');

            $('#asset-info-item-description').html(aPanel.html());
        });
    };

    var doSearch = function() {
        var i, aContent = '', aIde;

        aIde = mContext.getPlugin('cc.codebot.ide.web');

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

    this.mainPanel = function(theContainer, theContext) {
        var aContent = '';
        var aPanel = new CodebotFancyPanel('Asset Finder');

        var aFolder = aPanel.addFolder('Options', 'options');

        aFolder.add('Search', '<input type="text" name="keys" value="" />');

        aFolder.add('License',
            '<select name="field_art_licenses_tid[]">' +
                '<option value="2">CC-BY 3.0</option>' +
                '<option value="3">CC-BY-SA 3.0</option>' +
                '<option value="6">GPL 3.0</option>' +
            '</select>');

        aFolder.add('Download to', '<select name="downloadTo"><option value="/assets">/assets</option><option value="/another">/another</option></select>');

        var aFolder = aPanel.addFolder('Results', 'results');
        aFolder.add(null, '<div id="assets-finder-browse-area">Nothing to show yet.</div>', 'id', 'raw');

        aContent += '<form action="#" id="asset-finder-main">';
        aContent += aPanel.html();
        aContent += '</form>';

        theContainer.append(aContent);

        $('#asset-finder-main').submit(function(theEvent) {
            doSearch();
            theEvent.preventDefault();
            return false;
        });
    };

    this.init = function(theContext) {
        console.debug('AssetFinderPlugin:init()');

        mContext = theContext;
        mContext.ui.addButton({ icon: '<i class="fa fa-picture-o"></i>', panel: mSelf.mainPanel });
    };
};

CODEBOT.addPlugin(new AssetFinderPlugin());
