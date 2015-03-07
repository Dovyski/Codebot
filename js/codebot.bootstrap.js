
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

/**
 * Generic bootstrapper
 *
 * This file will detect the platform where Codebot is running (e.g. web, desktop with
 * node-web kit, etc) and load the corresponding bootstrapper.
 */

function loadResource(theUrl, theType) {
    var aHead       = document.getElementsByTagName('head').item(0);
    var aIsJs       = !theType || theType == 'text/javascript';
    var aElement    = document.createElement(aIsJs ? 'script' : 'link');

    if(aIsJs) {
        aElement.type  = 'text/javascript';
        aElement.src   = theUrl;
    } else {
        aElement.href  = theUrl;
        aElement.rel   = 'stylesheet';
        aElement.type  = 'text/css';
    }

    aHead.appendChild(aElement);
}

function whenJqueryAvailable(theCallback) {
    if(window.$) {
        theCallback();
    } else {
        setTimeout(function() { whenJqueryAvailable(theCallback); }, 200);
    }
}

// Let get this party started! All passengers on board. Don't forget
// to fasten your seatbelts. Thank you for flying Codebot! ;)

// jQuery and jQueryUI
loadResource('./js/3rdparty/jquery/jquery-ui.css', 'text/css');
loadResource('./js/3rdparty/jquery/jquery.min.js');
loadResource('./js/3rdparty/jquery/jquery-ui.min.js');

// Bootstrap
loadResource('./js/3rdparty/bootstrap/css/bootstrap.min.css', 'text/css');
loadResource('./js/3rdparty/bootstrap/js/bootstrap.min.js');

// FontAwesome
loadResource('./css/3rdparty/font-awesome/css/font-awesome.min.css', 'text/css');

// Fancytree
loadResource('./js/3rdparty/jquery.fancytree-2.0.0-5/skin-win8/ui.fancytree.css', 'text/css');
loadResource('./js/3rdparty/jquery.fancytree-2.0.0-5/skin-awesome/ui.fancytree.css', 'text/css');
loadResource('./js/3rdparty/contextmenu/css/jquery.contextMenu.css', 'text/css');
loadResource('./js/3rdparty/jquery.fancytree-2.0.0-5/jquery.fancytree.js');
loadResource('./js/3rdparty/jquery.fancytree-2.0.0-5/jquery.fancytree.dnd.js');
loadResource('./js/3rdparty/jquery.fancytree-2.0.0-5/jquery.fancytree.edit.js');
loadResource('./js/3rdparty/jquery.fancytree.awesome.js');
loadResource('./js/3rdparty/contextmenu/js/jquery.contextMenu-1.6.5.js');
loadResource('./js/3rdparty/contextmenu/js/jquery.fancytree.contextMenu.js');

// Mousetrap
loadResource('./js/3rdparty/mousetrap/mousetrap.min.js');
loadResource('./js/3rdparty/mousetrap/plugins/global-bind/mousetrap-global-bind.min.js');

// Ace
loadResource('./js/3rdparty/ace/src-min-noconflict/ace.js');

// dat.GUI
loadResource('./js/3rdparty/dat.gui/dat.gui.js');

// jQuery serializeObject
loadResource('./js/3rdparty/jquery.serializeobject/jquery.serializeObject.min.js');

// Codebot
loadResource('./css/style.css', 'text/css');
loadResource('./js/codebot.js');
loadResource('./js/codebot.utils.js');
loadResource('./js/codebot.signal.js');
loadResource('./js/codebot.signals.js');
loadResource('./js/codebot.io.js');
loadResource('./js/codebot.preferences.js');
loadResource('./js/codebot.editors.js');
loadResource('./js/codebot.editors.ace.js');
loadResource('./js/codebot.editors.graphic.js');
loadResource('./js/codebot.ui.fancypanel.js');
loadResource('./js/codebot.ui.filespanel.js');
loadResource('./js/codebot.ui.slidepanel.js');
loadResource('./js/codebot.ui.js');
loadResource('./js/codebot.ui.tabs.js');
loadResource('./js/codebot.ui.contextmenu.js');
loadResource('./js/codebot.ui.preferences.js');
loadResource('./js/codebot.shortcuts.js');

// Bootstrap the whole thing up.
window.onload = function(theEvent) {
    var aIsNodeWebkit   = 'require' in window;
    var aIsChromeApp    = false; // TODO: check it correctly.
    var aLoadingIcon    = document.getElementById('loading');

    // Hide the loading icon
    aLoadingIcon.style.display = 'none';

    if(aIsNodeWebkit) {
        console.log('CODEBOT [bootstrap] Node-webkit app.');
        $('body').append('<script type="text/javascript" src="./js/node-webkit/codebot.bootstrap.nw.js"></script>');

    } else if(aIsChromeApp) {
        console.log('CODEBOT [bootstrap] Chrome Packaged App.');

    } else {
        // It's running in the browser.
        console.log('CODEBOT [bootstrap] Browser app');
        $('body').append('<script type="text/javascript" src="./js/web/codebot.bootstrap.web.js"></script>');
    }
};
