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

function webdiskListDirectory($theDir, $thePrettyDir = '') {
	$aContent = array();
	foreach (scandir($theDir) as $aNode) {
		if ($aNode == '.' || $aNode == '..') continue;

		$aObj = new stdClass();
		$aObj->title = $aNode;
		$aObj->name = $aNode;
		$aObj->path = $thePrettyDir . $aNode;

		if (is_dir($theDir . '/' . $aNode)) {
			$aObj->folder = true;
			$aObj->key = $aObj->path;
			$aObj->children = webdiskListDirectory($theDir . $aNode . '/', $thePrettyDir . $aNode . '/');
		}

		$aContent[] = $aObj;
	}
	return $aContent;
}

function webdiskFindActivePlugins() {
	return array(
		array('name' => 'cc.codebot.ide.web.js', 'title' => 'cc.codebot.ide.web.js', 'path' => './plugins/cc.codebot.ide.web.js'),
		array('name' => 'cc.codebot.flash.tools.js', 'title' => 'cc.codebot.flash.tools.js', 'path' => './plugins/cc.codebot.flash.tools.js'),
		array('name' => 'cc.codebot.ide.web.dnd.js', 'title' => 'cc.codebot.ide.web.dnd.js', 'path' => './plugins/cc.codebot.ide.web.dnd.js'),
		array('name' => 'cc.codebot.asset.finder.js', 'title' => 'cc.codebot.asset.finder.js', 'path' => './plugins/cc.codebot.asset.finder.js')
	);
}

function webdiskLs($theDir) {
	$aFiles = array(
		array(
			'name' => 'Project',
			'title' => 'Project',
			'path' => '/',
			'folder' => true,
			'key' => 'root',
			'expanded' => true,
			'children' => webdiskListDirectory($theDir)
		)
	);

	return $aFiles;
}

function webdiskLsCodebot($theDir) {
	$aFiles = array(
		array(
			'name' => 'Project',
			'title' => 'Project',
			'path' => '/',
			'folder' => 'true',
			'key' => 'root',
			'expanded' => true,
			'children' => array()
		)
	);

	if($theDir == './plugins') {
		$aFiles[0]['children'] = webdiskFindActivePlugins();
	}

	return $aFiles;
}

function webdiskWriteCodebot($thePath, $theData, $theUserId) {
	if($thePath == './data/prefs.default.json') {
		userUpdatePreferences($theUserId, $theData);
	}
}

function webdiskReadCodebot($thePath, $theUserId) {
	$aRet = '';

	if($thePath == './data/prefs.default.json') {
		$aUser = userGetById($theUserId, true);
		$aRet = $aUser->preferences;
	}

	return $aRet;
}

function webdiskCreateProject($theDisk, $theProjectName) {
	$aPath = WORK_POOL . DIRECTORY_SEPARATOR . $theDisk . DIRECTORY_SEPARATOR . $theProjectName;
	mkdir($aPath);

	return $aPath;
}

?>
