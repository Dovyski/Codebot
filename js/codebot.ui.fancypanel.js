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

var Codebot = Codebot || {};

/**
 * Represents a folder in the panel. A folder can contain several
 * elements, all placed below each other.
 *
 * @param  {string} theTitle The folder title (label displayed at the top of the folder)
 * @param  {string} theId    A string representing the DOM id that the folder will receive. It's useful to directly access the folder's DOM element.
 */
Codebot.Panel = function(theTitle, theId) {
	this.title   		= theTitle;
	this.id      		= theId;
	this.itens  		= [];
	this.manager 		= null;
	this.containterId 	= null;	// the id of the DOM element that is housing the content of this panel
	this.containter 	= null;	// a jQuery object representing the DOM element that is housing the content of the panel

	if(theTitle) {
		this.itens.push({'type': 'title', 'title': theTitle, 'id': theId});
	}
};

Codebot.Panel.prototype.init = function(theManager) {
	this.manager = theManager;
};

/**
 * Adds a new section to the panel.
 *
 * @param  {string} theTitle  The title of the section
 */
Codebot.Panel.prototype.addSection = function(theTitle) {
	this.itens.push({
		type: 'section',
		title: theTitle
	});
};

/**
 *
 */
Codebot.Panel.prototype.addContent = function(theContent) {
	this.itens.push({
		type: 'content',
		content: theContent
	});
};

/**
 *
 */
Codebot.Panel.prototype.addRawContent = function(theContent) {
	this.itens.push({
		type: 'raw',
		content: theContent
	});
};

/**
 *
 * @param  {string} theContent  The content of the element.
 * @param  {string} theLabel    A text to be displayed close to the element's content. This parameter is optional.
 * @param  {object} theOpts     Options to customize this panel.
 */
Codebot.Panel.prototype.addLabelContent = function(theLabel, theContent, theOpts) {
	this.itens.push({
		type: 'label',
		label: theLabel || '',
		content: theContent,
		opts: theOpts || {}
	});
};

/**
 *
 */
Codebot.Panel.prototype.html = function() {
	var aContent = '',
		i,
		aItem;

	for(i = 0; i < this.itens.length; i++) {
		aItem = this.itens[i];

		aContent += '<div class="panel-'+ aItem.type +'">';

		if(aItem.type == 'label') {
			aContent += '<div class="panel-label-icon"></div>';
			aContent += '<div class="panel-label-text">' + aItem.label + '</div>';
			aContent += '<div class="panel-label-content">' + aItem.content + '</div>';

		} else if (aItem.type == 'section' || aItem.type == 'title') {
			aContent += '<i class="fa fa-caret-down"></i> ' + aItem.title;

			if(aItem.type == 'title') {
				aContent += '<a href="javascript:void(0);" class="panel-close-button pull-right" data-action="close"><i class="fa fa-close"></i></a>';
			}
		} else {
			aContent += aItem.content;
		}

		aContent += '</div>';
	}

	return aContent;
};

Codebot.Panel.prototype.render = function() {
};

Codebot.Panel.prototype.close = function() {
};

Codebot.Panel.prototype.push = function() {
};

Codebot.Panel.prototype.pop = function() {
}


/**
 * Represents a folder in the fancy panel. A folder can contain several
 * elements, all placed placed below each other.
 *
 * @param  {string} theTitle The folder title (label displayed at the top of the folder)
 * @param  {string} theId    A string representing the DOM id that the folder will receive. It's useful to directly access the folder's DOM element.
 */
var CodebotFancyPanelFolder = function(theTitle, theId) {
	this.title   = theTitle;
	this.id      = theId;

	var mItens   = [];

	/**
	 * Adds a new element to the folder. A new element is always displayed below the
	 * elements that were already added.
	 *
	 * @param  {string} theContent  The content of the element.
	 * @param  {string} theLabel    A text to be displayed close to the element's content.
	 * @param  {string} theId       A string representing the DOM id that the element will receive. It's useful to directly access the elemenbts's DOM element. Default it <code>''</code>.
	 * @param  {string} theBehavior What sort of behavior the element should have. Values are <code>number</code> (default), <code>boolean</code>, <code>function</code> and <code>raw</code>.
	 */
	this.add = function(theContent, theLabel, theId, theBehavior) {
		mItens.push({
			label: theLabel || null,
			content: theContent,
			id: theId || '',
			behavior: theBehavior || 'number'
		});
	};

	/**
	 * Adds a new element to the folder without organizing it as a (labe => content) pair.
	 *
	 * @param  {string} theContent  The content of the element.
	 * @param  {string} theId       A string representing the DOM id that the element will receive. It's useful to directly access the elemenbts's DOM element. Default it <code>''</code>.
	 */
	this.addRaw = function(theContent, theId) {
		this.add(theContent || '', null, theId, 'raw');
	}

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

	/**
	 * Adds a new folder to the fancy panel.
	 *
	 * @param  {string} theTitle 			A text to be displayed at the top of the folder.
	 * @param  {string} theId    			A string representing the DOM id of the folder being added. It's useful to find the container that contains the folder itself.
	 * @return {CodebotFancyPanelFolder}    A reference to the folder that was just created and added to the panel.
	 */
	this.addFolder = function(theTitle, theId) {
		var aFolder = new CodebotFancyPanelFolder(theTitle, theId);
		mFolders.push(aFolder);

		return aFolder;
	};

	/**
	 * Renders the whole panel as an HTML string. This string can be
	 * attached to the DOM, for instance.
	 *
	 * @return {string} A text containing the HTML representation of the panel.
	 */
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
