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
    // Constants
    const API_URL       = 'plugins/asset-finder/api.php';

    this.id             = 'cc.codebot.asset.finder';

    var mSelf           = this;
    var mContext        = null;

    var runCommand = function(theParams, theCallback) {
        $.ajax({
            url: API_URL,
            method: 'post',
            data: theParams,
            dataType: 'json'
        }).done(function(theData) {
            theCallback(theData);

        }).fail(function(theJqXHR, theTextStatus, theError) {
            console.error('Error: ' + theTextStatus + ', ' + theError);
        });
    };

    var doSearch = function() {
        var i, aContent = '';

        $('#assets-finder-browse-area').html('<i class="fa fa-circle-o-notch fa-spin"></i>');

        runCommand($('#asset-finder-main').serialize(), function(theData) {
            if(theData.success) {
                for(i = 0; i < theData.items.length; i++) {
                    aContent += '<img src="'+theData.items[i].thumbnail+'" alt="Preview">';

                }
                $('#assets-finder-browse-area').html(aContent);
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
        aContent += '<input type="hidden" name="method" value="search">';
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
