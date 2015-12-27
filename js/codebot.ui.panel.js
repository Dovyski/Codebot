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
	this.context 			= null; // a reference to Codebot singleton.
};

/**
 * Adds a new divider to the panel. A divider is line with a
 * title, pretty much like the heading of a panel.
 *
 * @param  {string} theTitle  The title of the section
 */
Codebot.Panel.prototype.divider = function(theTitle) {
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
Codebot.Panel.prototype.row = function(theContent, theUseMargins) {
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
Codebot.Panel.prototype.pair = function(theLabel, theContent) {
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
