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

var CodebotSlidePanel = function() {
    var SLIDE_DURATION = 500; // in ms

    var mCodebot = null;
    var mSelf = null;
    var mIds = 0;
    var mStack = [];
    var mCurrentPanel = null;

    var transform3d = function(theElementId, theX, theY, theZ) {
		document.getElementById(theElementId).style.WebkitTransform = 'translate3d('+ theX +','+ theY +','+ theZ +')';
	};

    var slideElement = function(theId, theX, theDuration) {
        $('#' + theId).css({
            '-webkit-transition': 'all ' + (theDuration || SLIDE_DURATION) + 'ms',
            '-webkit-transform': 'translate3d('+theX+'px, 0px, 0px)'
        });
    }

    var clearStates = function() {
        $('#config-dialog').empty();

        for(var i = 0; i < mStack.length; i++) {
            mStack[i].destroy();
            mStack[i].container.remove();
        }
        mStack.splice(0);
    };

    var getSliderPanelWidth = function() {
        return $('#config-dialog').width();
    };

    var renderPanel = function(thePanel) {
        thePanel.render();

        // Walk the just rendered content looking for
        // actionable code, such as buttons, etc.

        thePanel.container.find('[data-action="close"]').each(function(i, e) {
            $(e).click(function() {
                mSelf.popState();
            });
        });

        restorePersistentPanelData(thePanel.container);
    };

    // TODO: improve this panel data thing
    var restorePersistentPanelData = function(theContainer) {
        theContainer.find('form:not([data-manager=""])').each(function(i, e) {
            var aStore       = $(e).data('manager');
            var aPlugin      = mCodebot.getPlugin(aStore);
            var aData        = aPlugin && aPlugin.restorePanelData ? aPlugin.restorePanelData() : null;

            if(aData) {
                for(var aProp in aData) {
                    $(this).find('[name=' + aProp + ']').val(aData[aProp]);
                }

                console.debug('Data restored to panel', aStore, aData);
            }
        });
    };

    var savePersistentPanelData = function() {
        var aContainer = mStack[mStack.length - 1].container;

        if(aContainer) {
            aContainer.find('form:not([data-manager=""])').each(function(i, e) {
                var aStore      = $(e).data('manager');
                var aData       = $(e).serializeObject();
                var aManager    = mCodebot.getPlugin(aStore);

                if(aManager && aManager.savePanelData) {
                    aManager.savePanelData($(e).attr('id'), aData);
                }
            });
        }
    };

    this.pushState = function(thePanel) {
        var aPanelWidth = getSliderPanelWidth();

        if(!thePanel || !(thePanel instanceof Codebot.Panel)) {
            console.error('Unable to push slide panel. The provided argument is invalid: it should be an instance of Codebot.Panel.');
            return;
        }

        if(mStack.length > 0) {
            slideElement(mStack[mStack.length - 1].containerId, aPanelWidth * -2);
        }

        var aId = mIds++;
        var aContainerId = 'slide-panel-' + aId;

        $('#config-dialog').append('<div id="' + aContainerId + '" class="content-slide-panel"></div>')

        thePanel.containerId = aContainerId;
        thePanel.container = $('#' + aContainerId);

        $('#' + aContainerId).css('left', aPanelWidth + 'px');
        renderPanel(thePanel);

        mStack.push(thePanel);

        mCurrentPanel = thePanel;

        setTimeout(function() {
            slideElement(aContainerId, -aPanelWidth, mStack.length != 1 ? SLIDE_DURATION : 1);
        }, 50);
    };

    this.popState = function() {
        var aPanelWidth = getSliderPanelWidth();

        if(mStack.length == 1) {
            mSelf.close();

        } else {
            savePersistentPanelData();

            for(var i = 0; i < 2; i++) {
                if(mStack.length > 0) {
                    var aStackTop = mStack[mStack.length - 1 - i];
                    slideElement(aStackTop.containerId, i == 1 ? -aPanelWidth : 0);
                }
            }

            mCurrentPanel = mStack[mStack.length - 1];
        }

        setTimeout(function() {
            var aPanel = mStack.pop();

            aPanel.destroy();
            aPanel.container.remove();

            if(mStack.length == 0) {
                mCodebot.signals.lastSlidePanelClosed.dispatch();
            }
        }, SLIDE_DURATION);
    };

    this.instantiatePanelObject = function(thePanelClass) {
        var aInstance;

        aInstance = new thePanelClass();
        aInstance.manager = this;

        return aInstance;
    };

    this.open = function(thePanelClass, theForce) {
        var aInstance;

        aInstance = this.instantiatePanelObject(thePanelClass);

        if(!theForce) {
            if(mCurrentPanel && mCurrentPanel.constructor == aInstance.constructor) {
                // Trying to open an already open panel. Let's close it then.
                mSelf.close();
                return;
            }
        }

        clearStates();
        mSelf.pushState(aInstance);

        slideElement('content', -getSliderPanelWidth());
        slideElement('config-dialog', -getSliderPanelWidth());
    };

    this.close = function() {
        savePersistentPanelData();

        slideElement('content', 0);
        slideElement('config-dialog', 0);

        if(mStack.length == 1) {
            mCurrentPanel = null;
            mCodebot.signals.beforeLastSlidePanelClose.dispatch();
        }
    }

    this.init = function(theCodebot) {
        mSelf = this;
        mCodebot = theCodebot;
    };
};
