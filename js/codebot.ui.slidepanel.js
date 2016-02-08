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
        restorePersistentPanelData(thePanel);
    };

    var restorePersistentPanelData = function(thePanel) {
        var aPlugin,
            aData,
            aProp;

        // Has the panel asked for persistent data handling?
        if(thePanel && thePanel.dataManager) {
            // Yep! Let's get the plugin that is storing the
            // data for this panel, get the data from it and
            // restore everything.
            aPlugin = mCodebot.getPlugin(thePanel.dataManager);
            aData   = aPlugin && aPlugin.getPanelData ? aPlugin.getPanelData(thePanel) : null;

            // Do we have any data to restore?
            if(aData) {
                thePanel.restore(aData);

                // Emit some debug message so it's easier to track what is going on
                console.debug('Data restored to panel "' + thePanel.title + '" from plugin ' + thePanel.dataManager, aData);

            } else {
                console.debug('No data to be restored to panel "' + thePanel.title + '" from plugin ' + thePanel.dataManager);
            }
        }
    };

    var savePersistentPanelData = function() {
        var aPanel,
            aPlugin;

        aPanel = mStack[mStack.length - 1];

        // Has the panel asked for persistent data handling?
        if(aPanel && aPanel.dataManager) {
            // Yep, so let's save it! First fetch the plugin that will
            // handle the data for this panel
            aPlugin = mCodebot.getPlugin(aPanel.dataManager);

            // If the plugin exists and is ok to receive the data,
            // send the package away.
            if(aPlugin && aPlugin.savePanelData) {
                aPlugin.savePanelData(aPanel, aPanel.getData());

                // Emit some debug message so it's easier to track what is going on
                console.debug('Panel "' + aPanel.title + '" just persisted data to plugin ' + aPanel.dataManager, aPanel.getData());

            } else {
                console.debug('Panel "' + aPanel.title + '" asked to persist data, but plugin ' + aPanel.dataManager + ' has no savePanelData() method.');
            }
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

        $('#config-dialog').append('<div id="' + aContainerId + '" class="panel-content"></div>')

        thePanel.setContainer(aContainerId);

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
        aInstance.panelManager = this;
        aInstance.context = mCodebot;

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
        if(mCurrentPanel == null) {
            // Nothing to close here...
            return;
        }

        savePersistentPanelData();

        slideElement('content', 0);
        slideElement('config-dialog', 0);

        if(mStack.length == 1) {
            mCurrentPanel = null;
            mCodebot.signals.beforeLastSlidePanelClose.dispatch();
        }
    };

    /**
     * Invoked by any panel that wants to close itself but
     * is managed by this slide panel.
     *
     * @param  {Codebot.Panel} thePanel The panel that wants to close itself.
     */
    this.closeChild = function(thePanel) {
        if(mCurrentPanel == thePanel) {
            this.popState();

        } else {
            // TODO: remove element from stack, remove from DOM, etc
        }
    };

    this.init = function(theCodebot) {
        mSelf = this;
        mCodebot = theCodebot;
    };
};
