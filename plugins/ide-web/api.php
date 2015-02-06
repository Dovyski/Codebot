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
 * A REST API to manage projects when running in web IDE mode.
 */

require_once dirname(__FILE__).'/globals.php';

$aMethod = isset($_REQUEST['method']) ? $_REQUEST['method'] : '';
unset($_REQUEST['method']);

$aOut = '';
$aUser = userGetById(@$_SESSION['id']);

if($aUser != null) {
	try {
		switch($aMethod) {
			case 'create-project':
				$aOk = projectCreate($aUser, @$_REQUEST['name'], @$_REQUEST['type']);
				$aOut = json_encode(array('success' => $aOk, 'msg' => ''));
				break;

			case 'list-projects':
				$aProjects = projectFindByUser($aUser);
				$aOut = json_encode(array('success' => true, 'msg' => '', 'projects' => $aProjects));
				break;

			case 'delete-project':
				$aOut = json_encode(array('success' => true, 'msg' => ''));
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

header('Content-Type: application/json');
echo $aOut;

?>
