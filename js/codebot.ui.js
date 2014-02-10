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

var CodebotUI = function() {
	var mTabs 				= null;
	var mFilesPanel         = null;
    var mIO                 = null;
    var mSelf               = null;
    
	var transform3d = function(theElementId, theX, theY, theZ) {
		document.getElementById(theElementId).style.WebkitTransform = 'translate3d('+ theX +','+ theY +','+ theZ +')';
	};
	
	var onTabClose = function(theTab) {
		var aEditor = theTab.editor;
		var aEditorNode = aEditor ? aEditor.getWrapperElement() : null;
		
		// TODO: make a pretty confirm dialog.
		// TODO: only confirm if content has changed.
		if(aEditor && confirm("Save content before closing?")) {
			mIO.writeFile(theTab, aEditor.getDoc().getValue(), function() { console.log('Data written!');} );
		}

		if(aEditorNode) {
            aEditorNode.parentNode.removeChild(aEditorNode);
        }
		theTab.editor = null;
		
		console.debug('onTabClose', theTab);
	};
	
	var onTabBlur = function(theTab) {
		var aTabEditor = null;
		
		aTabEditor = theTab.editor;
        
        if(aTabEditor) {
		  aTabEditor.getWrapperElement().style.display = 'none';
        }
		
        console.debug('onTabBlur', theTab);
	};
	
	var onTabFocus = function(theTab) {
		var aTabEditor = null;
		
		// Show the content of the newly active tab.
		aTabEditor = theTab.editor;
        
		if(aTabEditor) {
            aTabEditor.getWrapperElement().style.display = 'block';
        }
		
        console.debug('onTabFocus', theTab);
	};
	
	// TODO: should receive node instead of data.
    this.openTab = function(theNodeData) {
        var aEditorPrefs = {};
        $.extend(aEditorPrefs, CODEBOT.getPrefs().editor);
        
		mIO.readFile(theNodeData, function(theData) {
            aEditorPrefs['mode']        = 'javascript', // TODO: dynamic mode?
            aEditorPrefs['value']       = theData;
            aEditorPrefs['autofocus']   = true;
                
			mTabs.add({
				favicon: 'file-text-o', // TODO: dynamic icon?
				title: theNodeData.name,
				editor: CodeMirror(document.getElementById('working-area'), aEditorPrefs),
				file: theNodeData.name,
				path: theNodeData.path,
                //TODO: add "entry: theNodeData.entry" for Chrome Packaged Apps
			});
		});
	};
    
    // TODO: implement a pretty confirm dialog/panel
    this.confirm = function(theMessage) {
        mSelf.log('Confirm? ' + theMessage);
        return true;
    };
    
    this.log = function(theText) {
        $('#console').append(theText + '<br />');
    };
		
	this.showConfigDialog = function(theStatus, theContent) {
		if(theStatus) {
			$('#config-dialog').html(theContent);
			
			// TODO: remove the hardcoded value
			transform3d('content', '-600px', '0', '0');
			transform3d('config-dialog', '-600px', '0', '0');
		} else {
			transform3d('content', '0', '0', '0');
			transform3d('config-dialog', '0', '0', '0');
		}
	};

	this.addPlugin = function(theId, theObj) {
		$('#config-bar').html(
			$('#config-bar').html() +
			'<a href="#" data-plugin="'+theId+'"><i class="fa fa-'+theObj.icon+'"></i></a>'
		);
		
		$('#config-bar a').click(function() {
			CODEBOT.handlePluginClick($(this).data('plugin'));
		});
	};
	
	this.init = function(theIO) {
        console.log('CODEBOT [ui] Building UI');
        
        mSelf       = this;
        mIO         = theIO;
		mFilesPanel = new CodebotFilesPanel();
        mTabs       = new CodebotTabs();
		
        mFilesPanel.init(this, mIO);
        mTabs.init({
            onFocus: onTabFocus,
            onBlur:  onTabBlur,
            onClose: onTabClose
        });
        
        // TODO: read data from disk, using last open directory.
		mIO.readDirectory('/Users/fernando/Downloads/codebot_test', mFilesPanel.load);
	};
};