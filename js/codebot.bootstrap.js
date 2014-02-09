
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

var aIsNodeWebkit   = 'require' in window;
var aIsChromeApp    = false; // TODO: check it correctly.

$(function() {
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
});