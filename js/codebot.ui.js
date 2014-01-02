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

var CODEBOT = CODEBOT || {};

CODEBOT.ui = new function() {
	var filePanelClick = function(theNode) {
		console.log('File panel click: ' + (theNode.data.id || 'folder'), theNode.data);
	};
	
	var transform3d = function(theElementId, theX, theY, theZ) {
		document.getElementById(theElementId).style.WebkitTransform = 'translate3d('+ theX +','+ theY +','+ theZ +')';
	};
	
	// TODO: refactor this!
	var buildConfiPanel = function() {
		$('#config-bar a').click(function() {
			showConfigDialog(true);
		});
		
		$('#config-dialog a').click(function() {
			showConfigDialog(false);
		});
	};
	
	var showConfigDialog = function(theStatus) {
		if(theStatus) {
			// TODO: remove the hardcoded value
			transform3d('content', '-600px', '0', '0');
			transform3d('config-dialog', '-600px', '0', '0');
		} else {
			transform3d('content', '0', '0', '0');
			transform3d('config-dialog', '0', '0', '0');
		}
	};
	
	this.refreshFilesPanel = function(theData) {
		if(theData && theData.length > 0) {
			$("#folders").dynatree({
				onActivate: filePanelClick,
				children: theData
			});
			
			var aDirs = $("#folders").dynatree("getTree");
			aDirs.reload();
			
		} else {
			$("#folders").html('<div class="">no</div>');
		}
	};
        
	this.init = function() {
		// TODO: read data from disk
		CODEBOT.ui.refreshFilesPanel([
			{title: "Item 1" + Math.random()},
			{title: "Folder 2" + Math.random(), isFolder: true, key: "folder2",
			  children: [
				{title: "Sub-item 2.1" + Math.random()},
				{title: "Sub-item 2.2" + Math.random()}
			  ]
			},
			{title: "Item 3"}
		]);
		
		buildConfiPanel();
	};
};