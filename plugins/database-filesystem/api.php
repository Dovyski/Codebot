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
 * A REST API to access a database file-system.
 */

@include_once dirname(__FILE__).'/config.local.php';
include_once dirname(__FILE__).'/config.php';

require_once dirname(__FILE__).'/db.php';
require_once dirname(__FILE__).'/functions.php';

$aMethod = isset($_REQUEST['method']) ? $_REQUEST['method'] : '';

unset($_REQUEST['method']);

$aMime = 'text/plain';
$aOut = '';

switch($aMethod) {
	case 'ls':
		$aFiles = dbfsList();
		$aMime = 'application/json';
		$aOut = json_encode($aFiles);
		break;

	case 'mv':
		break;

	case 'read':
		$aOut = '';
		$aMime = 'text/plain';
		$aId = isset($_REQUEST['id']) ? $_REQUEST['id'] : 0;
		$aFile = dbfsGetFileById($aId);

		if($aFile != null) {
			$aOut = $aFile->data;
		}
		break;

	case 'write':
		$aMime = 'application/json';

		$aInfos = array();
		$aInfos['data'] = isset($_REQUEST['data']) ? $_REQUEST['data'] : '';
		$aInfos['name'] = isset($_REQUEST['name']) ? $_REQUEST['name'] : '';
		$aInfos['id'] 	= isset($_REQUEST['id']) ? $_REQUEST['id'] : null;

		$aFile = dbfsGetFileById($aInfos['id']);

		if($aFile != null) {
			$aInfos['name'] = $aFile->name;
			$aInfos['fk_parent'] = $aFile->fk_parent;
		}

		$aOk = dbfsUpdateOrCreateFile($aInfos);
		$aOut = json_encode(array('success' => $aOk, 'msg' => ''));
		break;

	default:
		echo 'Problem?';
		break;
}

header('Content-Type: ' . $aMime);
echo $aOut;

?>
