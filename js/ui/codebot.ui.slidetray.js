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

var Codebot = Codebot || {};
Codebot.UI = Codebot.UI || {};

/**
 * [function description]
 */
Codebot.UI.SlideTray = function() {
    var mCodebot,
        mId,
        mStack,
        mOpen;
};

Codebot.UI.SlideTray.prototype.getSlideDuration = function() {
    var aSettings = mCodebot.settings.get().ui;
    return aSettings.slidePanelAnimation ? aSettings.slidePanelAnimationDuration : 5;
};

Codebot.UI.SlideTray.prototype.transform3d = function(theElementId, theX, theY, theZ) {
	document.getElementById(theElementId).style.WebkitTransform = 'translate3d('+ theX +','+ theY +','+ theZ +')';
};

Codebot.UI.SlideTray.prototype.slideElement = function(theId, theX, theDuration) {
    $('#' + theId).css({
        '-webkit-transition': 'all ' + (theDuration || this.getSlideDuration()) + 'ms',
        '-webkit-transform': 'translate3d('+theX+'px, 0px, 0px)'
    });
};

Codebot.UI.SlideTray.prototype.clear = function(theCallback, theCallbackContext) {
    this.close(function() {
        for(var i = 0; i < mStack.length; i++) {
            mStack[i].onDestroy();
            mStack[i].container.remove();
        }
        mStack.splice(0);

        $('#config-dialog').empty();

        if(theCallback) {
            theCallback.call(theCallbackContext || this);
        }
    }, this);
};

Codebot.UI.SlideTray.prototype.getSliderPanelWidth = function() {
    return $('#config-dialog').width();
};

Codebot.UI.SlideTray.prototype.restorePersistentPanelData = function(thePanel) {
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

Codebot.UI.SlideTray.prototype.savePersistentPanelData = function() {
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

Codebot.UI.SlideTray.prototype.pushPanel = function(thePanelClass) {
    var aPanelWidth,
        aPanel,
        aSelf = this;

    if(!thePanelClass) {
        console.error('Unable to push slide panel. The provided argument is invalid: it should be an instance of Codebot.Panel.');
        return;
    }

    aPanelWidth = this.getSliderPanelWidth();
    aPanel = this.instantiatePanelObject(thePanelClass);

    if(mStack.length > 0) {
        this.slideElement(mStack[mStack.length - 1].containerId, aPanelWidth * -2);
    }

    var aId = mIds++;
    var aContainerId = 'slide-panel-' + aId;

    $('#config-dialog').append('<div id="' + aContainerId + '" class="panel-content"></div>')

    aPanel.setContainer(aContainerId);
    $('#' + aContainerId).css('left', aPanelWidth + 'px');

    this.open();

    aPanel.render();
    this.restorePersistentPanelData(aPanel);

    mStack.push(aPanel);

    setTimeout(function() {
        aSelf.slideElement(aContainerId, -aPanelWidth, mStack.length != 1 ? aSelf.getSlideDuration() : 1);
    }, 50);
};

Codebot.UI.SlideTray.prototype.popPanel = function() {
    var aPanelWidth = this.getSliderPanelWidth(),
        aStackTop;

    if(mStack.length == 1) {
        this.close();

    } else {
        this.savePersistentPanelData();

        for(var i = 0; i < 2; i++) {
            if(mStack.length > 0) {
                aStackTop = mStack[mStack.length - 1 - i];
                this.slideElement(aStackTop.containerId, i == 1 ? -aPanelWidth : 0);
            }
        }
    }

    setTimeout(function() {
        var aPanel = mStack.pop();

        aPanel.onDestroy();
        aPanel.container.remove();

        if(mStack.length == 0) {
            mCodebot.signals.lastSlidePanelClosed.dispatch();
        }
    }, this.getSlideDuration());
};

Codebot.UI.SlideTray.prototype.instantiatePanelObject = function(thePanelClass) {
    var aInstance;

    aInstance = new thePanelClass();
    aInstance.panelManager = this;
    aInstance.context = mCodebot;
    aInstance.className = thePanelClass;

    return aInstance;
};

Codebot.UI.SlideTray.prototype.set = function(thePanelClass, theForceNew) {
    var aCurrent = this.getCurrentPanel();

    if(!theForceNew && aCurrent && aCurrent.className == thePanelClass) {
        this.toggleOpen();

    } else {
        this.clear(function() {
            this.pushPanel(thePanelClass);
        }, this);
    }
};

Codebot.UI.SlideTray.prototype.open = function() {
    var aCurrent = this.getCurrentPanel();

    if(!mOpen) {
        if(aCurrent) {
            aCurrent.onResume();
        }

        this.slideElement('content', -this.getSliderPanelWidth());
        this.slideElement('config-dialog', -this.getSliderPanelWidth());
    }

    mOpen = true;
};

Codebot.UI.SlideTray.prototype.close = function(theCallback, theCallbackContext) {
    var aDuration = 0,
        aCurrent;

    if(mOpen) {
        aCurrent = this.getCurrentPanel();

        if(aCurrent) {
            this.savePersistentPanelData();
            aCurrent.onPause();
        }

        this.slideElement('content', 0);
        this.slideElement('config-dialog', 0);

        if(mStack.length == 1) {
            // TODO: rename this signal (e.g. beforeSlideTrayClose)
            mCodebot.signals.beforeLastSlidePanelClose.dispatch();
        }

        mOpen = false;
        aDuration = this.getSlideDuration()
    }

    setTimeout(function() {
        if(theCallback) {
            theCallback.call(theCallbackContext || this);
        }
    }, aDuration);
};

/**
 * [function description]
 *
 */
Codebot.UI.SlideTray.prototype.toggleOpen = function() {
    if(mOpen) {
        this.close();
    } else {
        this.open();
    }
};

/**
 * Invoked by any panel that wants to close itself but
 * is managed by this slide panel.
 *
 * @param  {Codebot.Panel} thePanel The panel that wants to close itself.
 */
Codebot.UI.SlideTray.prototype.closeChild = function(thePanel) {
    if(this.getCurrentPanel() == thePanel) {
        this.popState();

    } else {
        // TODO: remove element from stack, remove from DOM, etc
    }
};

/**
 * [function description]
 *
 * @return {[type]} [description]
 */
Codebot.UI.SlideTray.prototype.getCurrentPanel = function() {
    return mStack.length > 0 ? mStack[mStack.length - 1] : null;
};

/**
 * [function description]
 *
 * @param  {[type]} theCodebot [description]
 * @return {[type]}            [description]
 */
Codebot.UI.SlideTray.prototype.init = function(theCodebot) {
    mCodebot = theCodebot;
    mIds = 0;
    mStack = [];
    mOpen = false;
};
