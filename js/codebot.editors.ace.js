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

var CodebotEditorAce = new function() {
    this.create = function(theTab, theContent, theNode) {
        var aEditor = null, aReader;

        aEditor = ace.edit(theTab.container);
        aEditor.setTheme("ace/theme/tomorrow_night_eighties"); // TODO: get theme from Codebot?
        aEditor.getSession().setMode("ace/mode/javascript"); // TODO: choose mode based on file extension.
        aEditor.getSession().setOption("useWorker", false);

        if(theContent instanceof Blob) {
            aReader = new FileReader();
			aReader.readAsText(theContent);

            aReader.onloadend = function() {
                aEditor.setValue(aReader.result);
                aEditor.session.selection.clearSelection();
                theTab.setDirty(false);
			};
        } else {
            aEditor.setValue(theContent);
            aEditor.session.selection.clearSelection();
        }

        // TODO: remove this CODEBOT singleton call.
        for(var i in CODEBOT.settings.get().editor) {
            aEditor.setOption(i, CODEBOT.settings.get().editor[i]);
        }

        aEditor.getSession().on('change', function(e) {
            theTab.setDirty(true);
        });

        return aEditor;
    };
};
