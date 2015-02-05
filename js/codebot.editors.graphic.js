/*
    The MIT License (MIT)

    Copyright (c) 2013 Fernando Bevilacqua

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
var SimpleGraphicViewer = function(theContainer) {
    var mContainer = theContainer;

    this.renderSWFByURL = function(theURL, theWidth, theHeight) {
        $('#' + mContainer).html(
            '<object type="application/x-shockwave-flash" data="'+theURL+'" width="'+(theWidth || '640')+'" height="'+(theHeight || '480')+'">' +
                '<param name="movie" value="'+theURL+'" />' +
                '<param name="quality" value="high" />' +
            '</object>'
        );
    };

    this.showMessage = function(theText) {
        $('#' + mContainer).html(theText);
    }

    this.showLoading = function() {
        $('#' + mContainer).html('<i class="fa fa-circle-o-notch fa-spin"></i> Loading...');
    };
};

var CodebotEditorGraphic = new function() {
    this.create = function(theTab, theContent, theNode) {
        var aEditor = new SimpleGraphicViewer(theTab.container);

        aEditor.showLoading();
        return aEditor;
    };
};
