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
 * A REST API to build Flash projects.
 */

include_once dirname(__FILE__). '/config.local.php';
include_once dirname(__FILE__). '/config.php';

$aMethod = isset($_REQUEST['method']) ? $_REQUEST['method'] : '';
unset($_REQUEST['method']);

$aMime = 'text/plain';
$aOut = '';

switch($aMethod) {
	case 'build':
		$aMime = 'appliction/json';
		$aReturn = array();
		exec(FLEX_SDK . 'mxmlc -default-size 640 480 '.WORK_DIR.'/src/Mode.as -library-path+='.WORK_DIR.'/lib/ -swf-version=22 -debug=true -static-link-runtime-shared-libraries=true -o '.WORK_DIR.'/bin/Mode.swf 2>&1', $aReturn);

		foreach($aReturn as $aKey => $aValue) {
			$aReturn[$aKey] = str_replace(WORK_DIR, '', $aReturn[$aKey]);
		}

		$aOut = json_encode(array(
			'url' => 'http://dev.local.com/tmp/1/bin/Mode.swf', // TODO: get this right!
			'log' => $aReturn
		));
		break;

	default:
		echo 'Problem?';
		break;
}

header('Content-Type: ' . $aMime);
echo $aOut;

?>
