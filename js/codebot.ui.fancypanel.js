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

var CodebotFancyPanelFolder = function(theTitle, theId) {
	this.title   = theTitle;
	this.id      = theId;

	var mItens   = [];

	this.add = function(theLabel, theContent, theId, theBehavior) {
		mItens.push({
			label: theLabel,
			content: theContent,
			id: theId || '',
			behavior: theBehavior || 'number'
		});
	};

	this.open = function() {
		// TODO: implement
	};

	this.close = function() {
		// TODO: implement
	};

	// getters
	this.__defineGetter__("itens", function() { return mItens; });
};

var CodebotFancyPanel = function(theTitle) {
	var mFolders = [];
	var mTitle = theTitle;

	this.addFolder = function(theTitle, theId) {
		var aFolder = new CodebotFancyPanelFolder(theTitle, theId);
		mFolders.push(aFolder);

		return aFolder;
	};

	this.html = function() {
		var aContent = '';

		aContent +=
			'<div class="dg main" style="height: 40px;">'+
				'<ul>'+
					'<li class="folder">'+
						'<div class="dg">'+
							'<ul>';

		if(mTitle) {
			aContent += '<li class="title head"><i class="fa fa-caret-down"></i> ' + mTitle + ' <a href="#" class="fancypanel-close-button pull-right" data-action="close"><i class="fa fa-close"></i><a/></li>';
		}

		for(var i = 0; i < mFolders.length; i++) {
			var aFolder = mFolders[i];

			if(aFolder.title && aFolder.title != '') {
				aContent += '<li class="title"><i class="fa fa-caret-down"></i> ' + aFolder.title + '</li>';
			}

			for(var j = 0; j < aFolder.itens.length; j++) {
				var aItem = aFolder.itens[j];

				aContent +=
					'<li class="cr '+ (aItem.behavior || 'function') +'" data-section="'+ aItem.id +'">';
						// If there is a label, use the "label | content" structure,
						// otherwise use just the content, no structure.
						if(aItem.label != null) {
							aContent +=
								'<div>' +
									'<span class="property-name">'+ aItem.label + '</span>'+
									'<div class="c">'+
										aItem.content +
									'</div>' +
								'</div>';

						} else {
							aContent += aItem.content;
						}
					'</li>';
			}
		}

		aContent +=
							'</ul>'+
						'</div>'+
					'</li>' +
				'</ul>'+
			'</div>';

		return aContent;
	};
};
