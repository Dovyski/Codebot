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

// TODO: make all properties private

/**
 * Describes a panel in the application. A panel is an rectangular are containing
 * content that can be slided in and out of the screen.
 *
 * @param  {string} theTitle The folder title (label displayed at the top of the folder)
 * @param  {string} theContainerId Id of the DOM element that will house the content of this panel. If
 */
Codebot.Panel = function(theTitle, theContainerId) {
	this.title   			= theTitle;
	this.panelManager 		= null; // A reference to the manager that is handling this panel.
	this.containerId 		= null;	// the id of the DOM element that is housing the content of this panel
	this.container 			= null;	// a jQuery object representing the DOM element that is housing the content of the panel
	this.dataManager 		= null; // a string with the id of a plugin that will handle all the data management for this panel.
	this.context 			= null; // a reference to Codebot singleton.

	if(theContainerId) {
		this.setContainer(theContainerId);
	}
};

/**
 * Specify a DOM element to house the content of this panel.
 *
 * @param  {string} theContainerId Id of the DOM element that will house the content of this panel.
 */
Codebot.Panel.prototype.setContainer = function(theContainerId) {
	this.containerId = theContainerId;

	if(this.containerId) {
		this.container = $('#' + theContainerId);
		this.container.addClass('panel-content');

		// If we have a title, add it to the container already
		if(this.title) {
			this.addToDom({'type': 'title', 'title': this.title});
		}
	}
};

/**
 * Adds a new divider to the panel. A divider is line with a
 * title, pretty much like the heading of a panel.
 *
 * @param  {string} theTitle  The title of the section
 * @param  {Object} theOptions	A set of options to customize the divider. Available values are: <code>icon</code>.
 */
Codebot.Panel.prototype.divider = function(theTitle, theOptions) {
	this.addToDom({
		type: 'divider',
		title: theTitle,
		options: theOptions || {}
	});
};

/**
 * Adds a new row of content to the panel.
 *
 * @param  {string} theContent          The text to the used as the content for the new row.
 * @param  {boolean} theIgnoreFormatting If <code>true</code> (default) the content is placed in the panel following the formatting margins; if <code>false</code>, the content is placed without any CSS rule, so it will fill out the panel horizontally.
 */
Codebot.Panel.prototype.row = function(theContent, theUseMargins) {
	this.addToDom({
		type: theUseMargins == undefined || theUseMargins ? 'row' : 'raw',
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
Codebot.Panel.prototype.pair = function(theLabel, theContent) {
	this.addToDom({
		type: 'pair',
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
	var aContent = '',
		aJustAdded,
		aOptions;

	aOptions = theItem.options || {};
	aContent += '<div class="panel-'+ theItem.type +'" ' + ( theItem.id ? 'id="' + theItem.id + '"' : '' ) + '>';

	if(theItem.type == 'pair') {
		aContent += '<div class="panel-pair-icon"></div>';
		aContent += '<div class="panel-pair-text">' + theItem.label + '</div>';
		aContent += '<div class="panel-pair-content">' + theItem.content + '</div>';

	} else if (theItem.type == 'divider' || theItem.type == 'title') {
		aContent += '<i class="fa fa-'+(aOptions.icon || 'caret-down') + '"></i> ' + theItem.title;

		if(theItem.type == 'title') {
			aContent += '<a href="javascript:void(0);" class="panel-close-button pull-right" data-action="close"><i class="fa fa-close"></i></a>';
		}
	} else {
		aContent += theItem.content;
	}

	aContent += '</div>';

	// Do we have a DOM element to append the content to?
	if(this.container) {
		// Yep! Add the content to the DOM then
		aJustAdded = this.container.append(aContent);
		// Enhance the content (make button clickable, etc)
		this.enhance(aJustAdded);
 	}
};

/**
 * Enhance the element, adding action to buttons, etc.
 *
 * @param  {jQuery} theElement Object describing an element that was just added to the panel
 */
Codebot.Panel.prototype.enhance = function(theElement) {
	var aSelf = this;

	theElement.find('[data-action="close"]').each(function(i, e) {
		$(e).click(function() {
			aSelf.close();
		});
	});
};

/**
 * Invoked by the panel manager when the content of this particular
 * panel should be created. Subclasses should override this
 * method to create personlized content for new panels.
 */
Codebot.Panel.prototype.render = function() {
	// From this point on, subclasses should add their own
	// content to the panel.
};

/**
 * Closes the panel. If it is stacked with another panel, it
 * is popped out of the stack and the subsequent panel becomes active.
 */
Codebot.Panel.prototype.close = function() {
	// Do we have a panel manager?
	if(this.panelManager) {
		// Yep, let it handle the closing
		// process and do what is appropriate.
		this.panelManager.closeChild(this);

	} else if (this.container) {
		// We have no panel manager, so let's just
		// hide this panel.
		this.container.fadeOut('fast');
	}
};

/**
 * Stacks a new panel on top of this panel. It is useful to create
 * nested panels.
 *
 * @param  {Function} thePanelClass A reference to the panel class that must be instantiated for this new panel. The class must be an instance of <code>Codebot.Panel</code>.
 */
Codebot.Panel.prototype.open = function(thePanelClass) {
	// Do we have a panel manager?
	if(this.panelManager) {
		this.panelManager.pushState(thePanelClass);
	}
};

/**
 * Invoked by the panel manager when this panel is about to be destroyed.
 * This is a last oportunity to perform clean up tasks.
 */
Codebot.Panel.prototype.destroy = function() {
	if(this.container) {
		this.container.remove();
	}
};

/**
 * Invoked by the panel manager when this panel is about to be suspended (paused).
 * It usually happens when the panel is active and the panel manager is told to
 * close (slide in) itself, without destroying its content. A paused panel
 * can be resumed by the panel manager, if it is ever openned (slide out) again.
 */
Codebot.Panel.prototype.pause = function() {
};

/**
 * Invoked by the panel manager when this panel is about to be resumed from a
 * paused state. Usually the panel should come back to the exact state it was
 * before being paused.
 */
Codebot.Panel.prototype.resume = function() {
};

/**
 * Obtains the data from all form elements in the panel and returns
 * them in the format <code>name=value&name2=value2...</code>
 *
 * @return {string} A serialization of all form elements in the panel in format <code>name=value&name2=value2...</code>.
 */
Codebot.Panel.prototype.serialize = function() {
	return this.container.find(':input').serialize();
};

/**
 * Obtains the data from all form elements in the panel and returns
 * them in object format <code>{name: value, name2: value2, ...}</code>.
 *
 * @return {object} An object containing data from all form elements in the panel in format <code>{name: value, name2: value2, ...}</code>.
 */
Codebot.Panel.prototype.getData = function() {
	return this.container.find(':input').serializeObject();
};

/**
 * Obtains a reference to Codebot's singleton.
 *
 * @return {Object} A reference to Codebot's singleton.
 */
Codebot.Panel.prototype.getContext = function() {
	return this.context;
};

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
 * Erases the content of the panel, making it completely empty.
 */
Codebot.Panel.prototype.empty = function() {
	this.container.empty();

	// Restore the title section
	this.addToDom({'type': 'title', 'title': this.title});
};

/**
 * Sets the title of this panel.
 *
 * @param  {string} theValue The new title
 */
Codebot.Panel.prototype.setTitle = function(theValue) {
	// TODO: set the title using h1 tags
};
