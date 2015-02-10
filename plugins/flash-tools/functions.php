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

function flashBuilProject($theProjectId, $theUserId) {
	$aReturn = array();
	$aProject = projectGetById($theProjectId, true);
	$aUser = null;

	if($aProject == null) {
		throw new Exception('Unknown project with id ' . $theProjectId);
	}

	$aUser = userGetById($theUserId);

	if($aUser == null) {
		throw new Exception('Invalid user');
	}

	if($aProject->fk_user != $theUserId) {
		throw new Exception('Wrong project owner');
	}

	$aReturn = flashCompileProject($aProject, $aUser);

	if($aReturn['success']) {
		$aTestDir 		= md5($aReturn['mount'] . $aReturn['outDir'] . $aReturn['outFile']);
		$aTestingPath 	= TESTING_POOL . $aTestDir;

		@mkdir($aTestingPath);
		exec('cp -R ' . $aReturn['mount'] . $aReturn['outDir'] . '* ' . $aTestingPath);

		$aReturn['testingDirUrl'] = PUBLIC_TESTING_URL . $aTestDir;
		$aReturn['testingFileUrl'] = PUBLIC_TESTING_URL . $aTestDir . '/' . $aReturn['outDir'] . $aReturn['outFile'];
	}

	return $aReturn;
}

function flashCompileProject($theProject, $theUser) {
	$aSettings 	= @unserialize($theProject->settings);
	$aSettings 	= $aSettings === false ? array() : $aSettings;

	$aWidth 	= isset($aSettings['width']) ? $aSettings['width'] : 640;
	$aHeight 	= isset($aSettings['height']) ? $aSettings['height'] : 480;
	$aSwf 		= isset($aSettings['swf']) ? $aSettings['swf'] : 22;
	$aDebug 	= isset($aSettings['debug']) ? $aSettings['debug'] : 'true';
	$aLibs 		= isset($aSettings['libs']) ? $aSettings['libs'] : '/lib/';
	$aDocClass 	= isset($aSettings['docClass']) ? $aSettings['docClass'] : '/src/Mode.as';
	$aOutDir 	= isset($aSettings['outDir']) ? $aSettings['outDir'] : '/bin/';
	$aOutFile 	= isset($aSettings['outFile']) ? $aSettings['outFile'] : 'Mode.swf';

	// TODO: get this from webdisk API
	$aMount		= WORK_POOL . $theUser->disk . '/' . $theProject->path . '/';
	$aCommand	= FLEX_SDK . 'mxmlc -default-size '.$aWidth.' '.$aHeight.' '.$aMount.$aDocClass.' -library-path+='.$aMount.$aLibs.' -swf-version='.$aSwf.' -debug='.$aDebug.' -static-link-runtime-shared-libraries=true -o '.$aMount.$aOutDir.$aOutFile.' '.OUTPUT_REPIPE;

	$aLogs = array();
	exec($aCommand, $aLogs);

	array_shift($aLogs);

	foreach($aLogs as $aKey => $aValue) {
		$aPos = strpos($aLogs[$aKey], $theProject->path);

		if($aPos !== false) {
			$aLogs[$aKey] = substr($aLogs[$aKey], $aPos + strlen($theProject->path));
		}
	}

	$aReturn = array(
		'success' 	=> count($aLogs) == 1,
		'mount' 	=> $aMount,
		'outDir' 	=> $aOutDir,
		'outFile' 	=> $aOutFile,
		'log' 		=> $aLogs
	);

	return $aReturn;
}

?>
