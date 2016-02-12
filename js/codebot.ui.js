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
    // Private properties
	var mTabs 				= null;
	var mFilesPanel         = null;
	var mSlidePanel         = null;
	var mPreferences        = null;
	var mCodebot            = null;
    var mButtons            = {};
    var mSelf               = null;

    var adjustButtonsPosition = function() {
	    var aHeight = 0;

		$('#config-bar a.bottom').each(function() {
		    $(this).css('bottom', aHeight + (aHeight > 0 ? 'px' : ''));
		    aHeight += $(this).height();
		});
	};

	// Prevent funky key names, e.g. 'my.key', which don't work in DOM ids.
	var sanitizeButtonId = function(theId) {
		return theId.replace(/[^a-zA-Z0-9-]+/g, '-');
	};

	var monitorClicksInsideContentAreas = function() {
		document.getElementById('content').addEventListener('click', function(theEvent) {
			// Let everybody know that a content area was clicked.
			mCodebot.signals.contentAreaClicked.dispatch([theEvent.target]);

			// Close any open sliding panel.
			mSlidePanel.close();
		});
	};

    // TODO: implement a pretty confirm dialog/panel
    this.confirm = function(theMessage) {
        mSelf.showDialog({
            keyboard: true,
            title: 'Confirm?',
            content: 'Confirm something',
            buttons: {
                'Label': {css: 'btn-default', dismiss: true, callback: function() { console.log('hey!'); }}
            }
        });
    };

    this.log = function(theText) {
        $('#console').append(theText + '<br />');
    };

    /**
    {
		panel: function,
        icon: string,
        action: function (func(context, button_as_jquery_obj))
        position: string ('top' or 'bottom')
		context: obj (where to point the 'this' of the callback being invoked)
    }
     */
	this.addButton = function(theId, theOptions) {
        var aId = theId,
        	aIcon = '',
			aRet = false;

		if(!aId) {
			throw new TypeError('Unable to add new button with invalid id.');
		}

		if(!theOptions) {
			throw new TypeError('Invalid config options of new button.');
		}

		aId = sanitizeButtonId(aId);

		// Does the button already exist?
		if(!mButtons[aId]) {
			// Nope, first time being created.
			mButtons[aId] = theOptions;
	        aIcon = theOptions.icon || '<i class="fa fa-question"></i>';

			$('#config-bar').append('<a href="#" id="config-bar-button-'+ aId +'" data-button-id="'+ aId +'" class="'+(theOptions.position || 'top')+'">' + aIcon + '</a>');

			$('#config-bar-button-' + aId).click(function() {
				var aIndex = $(this).data('button-id');

	            if('action' in mButtons[aIndex]) {
	                mButtons[aIndex].action.call(mButtons[aIndex].context || this, mCodebot, $(this));

	            } else if('panel' in mButtons[aIndex]) {
	                mSlidePanel.open(mButtons[aIndex].panel);
	            }
			});

			adjustButtonsPosition();
			aRet = true;
		}

		return aRet;
	};

	/**
	 * Removes a button from the UI.
	 *
	 * @param  {string} theId The id of that button. The id is informed when the button is added by <code>addButton()</code>.
	 */
    this.removeButton = function(theId) {
		theId = sanitizeButtonId(theId);

        if(mButtons[theId]) {
			$('#config-bar-button-' + theId).off().remove();
			mButtons[theId] = null;

        	adjustButtonsPosition();
		}
    };

    /**
     * Shows a dialog in the screen.
     *
     * @param Object theConfig how the dialog should be displayed. The structure is:
     * {
     *  backdrop: boolean | 'static' // Includes a modal-backdrop element. Alternatively, specify static for a backdrop which doesn't close the modal on click.
     *  keyboard: boolean, // Closes the modal when escape key is pressed
     *  title: string, // Dialog title
     *  content: string, // Dialog content
     *  buttons: {
     *      'label': {css: string, dismiss: boolean, callback: Function},
     *      'label1': {css: string, dismiss: boolean, callback: Function},
     *      (...)
     *  }
     * }
     */
    this.showDialog = function(theConfig) {
        var aText = '';

        $('#defaultModal .modal-body').html(theConfig.content || '');
        $('#defaultModal .modal-title').html(theConfig.title || '');
        $('#defaultModal .modal-footer').empty();

        if(theConfig.buttons) {
            for(var i in theConfig.buttons) {
                aText += '<button type="button" class="btn '+theConfig.buttons[i].css+'" ' +
                         (theConfig.buttons[i].dismiss ? 'data-dismiss="modal"' : '') +
                         '>'+i+'</button>';
            }
            $('#defaultModal .modal-footer').html(aText);

            $('#defaultModal .modal-footer button').click(function(theEvent) {
                var aLabel = $(theEvent.currentTarget).html();

                if(theConfig.buttons[aLabel].callback) {
                    theConfig.buttons[aLabel].callback();
                }
            });
        }

        $('#defaultModal').modal(theConfig);
    }

	this.init = function(theCodebot) {
        console.log('CODEBOT [ui] Building UI');

        mSelf           = this;
        mCodebot        = theCodebot;
		mFilesPanel     = new CodebotFilesPanel();
        mTabs           = new CodebotTabs();
        mSlidePanel     = new CodebotSlidePanel();
        mPreferences    = new CodebotPreferencesUI();

        mFilesPanel.init(mCodebot);
        mTabs.init(mCodebot);
        mSlidePanel.init(mCodebot);
        mPreferences.init(mCodebot);

        // Add Codebot button at the bottom of the sliding bar.
        mSelf.addButton('cc.codebot.ui.preferences', {icon: '<i class="fa fa-cog"></i>', position: 'bottom', panel: Codebot.Settings.Panel.Main});

        // TODO: read data from disk, using last open directory.

		// If the user clicks any of the content areas (tabs, files panel, etc),
		// close any open sliding panel.
		monitorClicksInsideContentAreas();

        // Ugly hack to achieve 100% height.
        $(window).resize(function() {
            var aHeight = $(window).height();
            $('#working-area').height(aHeight - 26);
            $('#files-panel').height(aHeight);
            $('#folders').height(aHeight);
        });
        $(window).trigger('resize');
	};

    // getters
    this.__defineGetter__("tabs", function(){ return mTabs; });
    this.__defineGetter__("filesPanel", function(){ return mFilesPanel; });
    this.__defineGetter__("slidePanel", function(){ return mSlidePanel; });
    this.__defineGetter__("preferences", function(){ return mPreferences; });
};
