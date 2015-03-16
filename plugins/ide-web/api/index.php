<?php
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

/**
 * A REST API to manage everything on the server-side when running in web IDE mode.
 */

// Include all configuration files
@include_once dirname(__FILE__).'/config.local.php';
include_once dirname(__FILE__).'/config.php';

// Include all internal models.
require_once dirname(__FILE__).'/inc/Auth.class.php';
require_once dirname(__FILE__).'/inc/Database.class.php';
require_once dirname(__FILE__).'/inc/User.class.php';
require_once dirname(__FILE__).'/inc/Project.class.php';
require_once dirname(__FILE__).'/inc/Disk.class.php';
require_once dirname(__FILE__).'/inc/Router.class.php';
require_once dirname(__FILE__).'/inc/Utils.class.php';

// Include available development tool-chains
require_once dirname(__FILE__).'/inc/FlashTools.class.php';

// Catch all error messages and turn them into Exceptions, that way the API
// will not break JSON communitation with ugly PHP html tags.
// Idea from here: http://stackoverflow.com/a/1241751
if(!DEBUG_MODE) {
	set_error_handler(array('Utils', 'errorToException'));
}

// By default, the mime-type is json.
header('Content-Type: application/json');

// Initialize session stuff
Auth::init();

$aOut = '';

if(!Auth::isUserAuthenticated()) {
	$aOut = json_encode(array('success' => false, 'msg' => 'User is not authenticated'));

} else {
	// Create a router and add methods to it
	// able to handle the requests.
	$aRouter = new Router();

	$aRouter->add('disk', 'Disk');

	// Get the party started and running!
	try {
		$aStatus = $aRouter->run($_REQUEST);

		$aOut = $aStatus['out'];
		header('Content-Type: ' . $aStatus['mime']);

	} catch(Exception $aProblem) {
		$aOut = json_encode(array('success' => false, 'msg' => $aProblem->getMessage()));
	}
}

echo $aOut;

?>
