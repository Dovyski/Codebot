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
 * A REST API to access a disk file-system.
 */

require_once dirname(__FILE__).'/globals.php';
require_once dirname(__FILE__).'/../ide-web/globals.php';

// Adjust the working dir based on the selected virtual disk.
$aMount = isset($_REQUEST['mount']) ? $_REQUEST['mount'] : '';
$aMount = $aMount == '' ? 'default' : $aMount;

define('WORK_DIR', WORK_POOL . $aMount . '/');

// Decide which API method we should process.
$aMethod = isset($_REQUEST['method']) ? $_REQUEST['method'] : '';
unset($_REQUEST['method']);

$aMime = 'text/plain';
$aOut = '';
$aUser = userGetById(@$_SESSION['id']);

if($aUser != null) {
	try {
		switch($aMethod) {
			case 'ls':
				$aMime = 'application/json';
				$aOut = json_encode(webdiskLs(WORK_DIR));
				break;

			case 'ls-codebot':
				$aMime = 'application/json';
				$aOut = json_encode(webdiskLsCodebot(@$_REQUEST['path']));
				break;

			case 'mv':
				$aMime = 'application/json';

				$aPathOld = isset($_REQUEST['old']) ? $_REQUEST['old'] : '';
				$aPathNew = isset($_REQUEST['new']) ? $_REQUEST['new'] : '';
				$aPathOld = WORK_DIR . $aPathOld;
				$aPathNew = WORK_DIR . $aPathNew;

				rename($aPathOld, $aPathNew);
				$aOut = json_encode(array('success' => true, 'msg' => ''));
				break;

			case 'rm':
				$aMime = 'application/json';

				if(isset($_REQUEST['path']) && $_REQUEST['path'] != '') {
					$aPath = WORK_DIR . $_REQUEST['path'];

					if(is_dir($aPath)) {
						rmdir($aPath);
					} else {
						unlink($aPath);
					}
					$aOut = json_encode(array('success' => true, 'msg' => ''));
				}
				break;

			case 'read':
				$aOut = '';
				$aMime = 'text/plain';

				if(isset($_REQUEST['path']) && $_REQUEST['path'] != '') {
					$aPath = WORK_DIR . $_REQUEST['path'];
					$aOut = file_get_contents($aPath);
				}
				break;

			case 'read-codebot':
				$aMime = 'text/plain';
				$aOut = webdiskReadCodebot(@$_REQUEST['path'], $aUser->id);
				break;

			case 'write':
				$aMime = 'application/json';

				if(isset($_REQUEST['path']) && $_REQUEST['path'] != '') {
					$aPath = WORK_DIR . $_REQUEST['path'];
					$aData = isset($_REQUEST['data']) ? $_REQUEST['data'] : file_get_contents($_FILES['file']['tmp_name']);

					file_put_contents($aPath, $aData);
					$aOut = json_encode(array('success' => true, 'msg' => ''));
				}
				break;

			case 'write-codebot':
				$aMime = 'application/json';
				webdiskWriteCodebot(@$_REQUEST['path'], @$_REQUEST['data'], $aUser->id);
				$aOut = json_encode(array('success' => true, 'msg' => ''));
				break;

			case 'mkdir':
				$aMime = 'application/json';

				if(isset($_REQUEST['path']) && $_REQUEST['path'] != '') {
					$aPath = WORK_DIR . $_REQUEST['path'];

					mkdir($aPath, 0755);
					$aOut = json_encode(array('success' => true, 'msg' => ''));
				}
				break;

			default:
				echo 'Problem?';
				break;
		}
	} catch(Exception $aProblem) {
		$aOut = json_encode(array('success' => false, 'msg' => $aProblem->getMessage()));
	}
} else {
	echo 'Questions?';
}

header('Content-Type: ' . $aMime);
echo $aOut;

?>
