/*
	The MIT License (MIT)

	Copyright (c) 2016 Fernando Bevilacqua

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
 * Controls all plugin ecosystem in Codebot. This class is responsible for adding,
 * removing, activating and deactivating plugins.
 */
Codebot.Plugins = function() {
    var mCodebot,
        mAvailable = {},
        mActive = {},
        mInstances = {};

    /**
     * [function description]
     * @return {[type]} [description]
     */
    this.load = function() {
        console.log('CODEBOT [plugins] Loading plugins...');

        mCodebot.io.readDirectory({path: 'codebot://./plugins'}, function(theData) {
            for(var i in theData[0].children) {
                var aItem = theData[0].children[i];

                if(aItem.title.lastIndexOf('.js') != -1) {
                    $('body').append('<script type="text/javascript" src="' + aItem.path + '"></script>');
                }
            }
        });

        console.log('CODEBOT [plugins] Plugins loaded.');
    };

    /**
     * [function description]
     * @param  {[type]} theId [description]
     * @return {[type]}       [description]
     */
    this.get = function(theId) {
        return mInstances[theId];
    };

    /**
     * [function description]
     * @param  {[type]} theId [description]
     * @return {[type]}       [description]
     */
    this.activate = function(theId) {
        if(mAvailable[theId]) {
            mActive[theId] = true;

            if(!mInstances[theId]) {
                console.debug('CODEBOT [plugin] Instantiating ' + theId);
                mInstances[theId] = new mAvailable[theId].className();
                mInstances[theId].context = mCodebot; // For those that override Codebot.Plugin.init() and don't call the parent method...
                mInstances[theId].init(mCodebot);
            }

            console.log('CODEBOT [plugin] Activating ' + theId);

            if(mInstances[theId].activate) {
                mInstances[theId].activate();
            } else {
                console.warn('CODEBOT [plugin] ' + theId + ' has no activate() method.');
            }
        } else {
            throw new Error("Unable to activate plugin: '" + theId + "' is unknown.");
        }
    };

    /**
     * [function description]
     * @param  {[type]} theId [description]
     * @return {[type]}       [description]
     */
    this.isActive = function(theId) {
        return mActive[theId];
    };

    /**
     * [function description]
     * @param  {[type]} theId [description]
     * @return {[type]}       [description]
     */
    this.deactivate = function(theId) {
        if(mAvailable[theId]) {
            mActive[theId] = false;

            if(mInstances[theId]) {
                console.log('CODEBOT [plugin] Deactivating ' + theId);

                if(mInstances[theId].deactivate) {
                    mInstances[theId].deactivate();
                } else {
                    console.warn('CODEBOT [plugin] ' + theId + ' has no deactivate() method.');
                }
            }
        } else {
            throw new Error("Unable to deactivate plugin: '" + theId + "' is unknown.");
        }
    };

    /**
     * [function description]
     * @return {[type]} [description]
     */
    this.available = function() {
        return mAvailable;
    };

    /**
     * [function description]
     * @param  {[type]} thePluginInfo [description]
     * @return {[type]}               [description]
     */
    this.add = function(thePluginInfo) {
        mAvailable[thePluginInfo.id] = thePluginInfo;
        console.log('CODEBOT [plugin] Added: ' + thePluginInfo.id);

        if(mCodebot.settings.get().plugins[thePluginInfo.id]) {
            this.activate(thePluginInfo.id);
        }
    };

    /**
     * [function description]
     * @param  {[type]} theCodebot [description]
     * @return {[type]}            [description]
     */
    this.init = function(theCodebot) {
        mCodebot = theCodebot;
    };
}
