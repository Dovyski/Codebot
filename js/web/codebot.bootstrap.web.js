
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
 *  Bootstrap file for web
 *
 *  The bootstrap file will load the IO driver and kick off the application.
 *  Each platform must provide its own bootstrap file, otherwise Codebot won't
 *  be able to perform IO opperations.
 */

var LOGIN_URL = 'plugins/ide-web/login';

// Before doing anything, check if the user has all authentication
// tokens and stuff.
var aDisk = CODEBOT.utils.getURLParamByName('disk');

if(!aDisk) {
	// TODO: redirect to API endpoint responsible for authentication
	console.log('CODEBOT [bootstrap-web] User has no disk, redirecting to login page.');
	CODEBOT.utils.redirect(LOGIN_URL);
}

// Apparently we have everything required to continue the bootstrap.
// Let's load the IO driver and get the party started.
$('body').append('<script type="text/javascript" src="./js/web/codebot.web.filesystem.js"></script>');
CODEBOT.init(new CodebotWebFilesystem());
