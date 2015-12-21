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
 * Describes a panel in the application. A panel is an rectangular are containing
 * content that can be slided in and out of the screen.
 *
 * @param  {string} theTitle The folder title (label displayed at the top of the folder)
  */
Codebot.Panel = function(theTitle) {
	this.title   			= theTitle;
	this.panelManager 		= null;
	this.containerId 		= null;	// the id of the DOM element that is housing the content of this panel
	this.container 			= null;	// a jQuery object representing the DOM element that is housing the content of the panel
	this.dataManager 		= null; // a string with the id of a plugin that will handle all the data management for this panel.
};

/**
 * Adds a new divider to the panel. A divider is line with a
 * title, pretty much like the heading of a panel.
 *
 * @param  {string} theTitle  The title of the section
 */
Codebot.Panel.prototype.addDivider = function(theTitle) {
	this.addToDom({
		type: 'section',
		title: theTitle
	});
};

/**
 * Adds a new row of content to the panel.
 *
 * @param  {string} theContent          The text to the used as the content for the new row.
 * @param  {boolean} theIgnoreFormatting If <code>true</code> (default) the content is placed in the panel following the formatting margins; if <code>false</code>, the content is placed without any CSS rule, so it will fill out the panel horizontally.
 */
Codebot.Panel.prototype.addRow = function(theContent, theUseMargins) {
	this.addToDom({
		type: theUseMargins == undefined || theUseMargins ? 'content' : 'raw',
		content: theContent
	});
};

/**
 * Adds a new row made of two parts: a label and a value.
 * Each area occupies half the space available for the panel.
 *
 * @param  {string} theLabel    A text to be displayed to the left of the panel content area.
 * @param  {string} theContent  A text to be displayed to the right of the panel content area.
 */
Codebot.Panel.prototype.addLabelValueRow = function(theLabel, theContent) {
	this.addToDom({
		type: 'label',
		label: theLabel || '',
		content: theContent
	});
};

/**
 * Converts an abstract content representation into HTML elements and inserts
 * them into the DOM. The data is inserted in the div that is housing the content
 * of this panel.
 *
 * @param  {object} theItem Item descriting the DOM element.
 */
Codebot.Panel.prototype.addToDom = function(theItem) {
	var aContent = '';

	aContent += '<div class="panel-'+ theItem.type +'" ' + ( theItem.id ? 'id="' + theItem.id + '"' : '' ) + '>';

	if(theItem.type == 'label') {
		aContent += '<div class="panel-label-icon"></div>';
		aContent += '<div class="panel-label-text">' + theItem.label + '</div>';
		aContent += '<div class="panel-label-content">' + theItem.content + '</div>';

	} else if (theItem.type == 'section' || theItem.type == 'title') {
		aContent += '<i class="fa fa-caret-down"></i> ' + theItem.title;

		if(theItem.type == 'title') {
			aContent += '<a href="javascript:void(0);" class="panel-close-button pull-right" data-action="close"><i class="fa fa-close"></i></a>';
		}
	} else {
		aContent += theItem.content;
	}

	aContent += '</div>';

	// Add the content to the DOM
	this.container.append(aContent);
};

/**
 * Invoked by the panel manager when the content of this particular
 * panel should be created. Subclasses should override this
 * method to create personlized content for new panels.
 */
Codebot.Panel.prototype.render = function() {
	// The first thing to render is the title, if we have one
	if(this.title) {
		this.addToDom({'type': 'title', 'title': this.title});
	}

	// From this point on, subclasses should add their own
	// content to the panel.
};

/**
 * Closes the panel. If it is stacked with another panel, it
 * is popped out of the stack and the subsequent panel becomes active.
 */
Codebot.Panel.prototype.close = function() {
	// TODO: implement.
};

/**
 * Stacks a new panel on top of this panel. It is useful to create
 * nested panels.
 *
 * @param  {Function} thePanelClass A reference to the panel class that must be instantiated for this new panel. The class must be an instance of <code>Codebot.Panel</code>.
 */
Codebot.Panel.prototype.open = function(thePanelClass) {
	// TODO: implement.
};

/**
 * Invoked by the panel manager when this panel is about to be destroyed.
 * This is a last oportunity to perform clean up tasks.
 */
Codebot.Panel.prototype.destroy = function() {
}

/**
 * Obtains the data from all form elements in the panel and returns
 * them in the format <code>name=value&name2=value2...</code>
 *
 * @return {string} A serialization of all form elements in the panel in format <code>name=value&name2=value2...</code>.
 */
Codebot.Panel.prototype.serialize = function() {
	return this.container.find(':input').serialize();
}

/**
 * Obtains the data from all form elements in the panel and returns
 * them in object format <code>{name: value, name2: value2, ...}</code>.
 *
 * @return {object} An object containing data from all form elements in the panel in format <code>{name: value, name2: value2, ...}</code>.
 */
Codebot.Panel.prototype.getData = function() {
	return this.container.find(':input').serializeObject();
}

/**
 * Defines a plugin to be the data manager for this panel. When a panel
 * has a data manager, all form elements within the panel content (e.g. inputs, selects, etc)
 * have their values stored in the informed plugin. This is useful to persist panel
 * data, e.g. settings.
 *
 * @param  {string} thePluginId The unique string id that identifies the plugin to be used as the data manager. E.g. <code>cc.codebot.asset.finder</code>.
 */
Codebot.Panel.prototype.setDataManager = function(thePluginId) {
	this.dataManager = thePluginId;
};

/**
 * Restores data into the panel content. The data is placed on each of the form
 * elements (e.g. inputs, selects, etc) that the panel has. This method is
 * automatically invoked by the panel manager when data has to be restored to this panel.
 *
 * @param  {object} theData An object containing data to be restored to form elements in the panel, in the format <code>{name: value, name2: value2, ...}</code>.
 */
Codebot.Panel.prototype.restore = function(theData) {
	var aProp;

	for(aProp in theData) {
		this.container.find('[name=' + aProp + ']').val(theData[aProp]);
	}
};

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
