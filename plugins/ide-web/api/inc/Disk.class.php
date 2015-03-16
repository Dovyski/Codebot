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

class Disk {
	private function escapePath($thePath) {
		return escapeshellcmd(str_replace('..', '', $thePath));
	}

	private function path($theMount) {
		return CODEBOT_DISK_WORK_POOL . $this->escapePath($theMount) . DIRECTORY_SEPARATOR;
	}

	private function create($theUser) {
	 	$aDisk = md5($theUser . time());
		mkdir(WORK_POOL . '/' . $aDisk);

		return $aDisk;
	}

	private function listDirectory($theDir, $thePrettyDir = '') {
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
				$aObj->children = $this->listDirectory($theDir . $aNode . '/', $thePrettyDir . $aNode . '/');
			}

			$aContent[] = $aObj;
		}
		return $aContent;
	}

	private function findActivePlugins() {
		return array(
			array('name' => 'cc.codebot.ide.web.js', 'title' => 'cc.codebot.ide.web.js', 'path' => './plugins/cc.codebot.ide.web.js'),
			array('name' => 'cc.codebot.flash.tools.js', 'title' => 'cc.codebot.flash.tools.js', 'path' => './plugins/cc.codebot.flash.tools.js'),
			array('name' => 'cc.codebot.ide.web.dnd.js', 'title' => 'cc.codebot.ide.web.dnd.js', 'path' => './plugins/cc.codebot.ide.web.dnd.js'),
			array('name' => 'cc.codebot.asset.finder.js', 'title' => 'cc.codebot.asset.finder.js', 'path' => './plugins/cc.codebot.asset.finder.js')
		);
	}

	public function mv($theMount, $theOldPath, $theNewPath) {
		$aOldPath = $this->path($theMount) . $this->escapePath($theOldPath);
		$aNewPath = $this->path($theMount) . $this->escapePath($theNewPath);

		rename($aOldPath, $aNewPath);

		return array('success' => true, 'msg' => '');
	}

	public function ls($theDir) {
		$aFiles = array(
			array(
				'name' => 'Project',
				'title' => 'Project',
				'path' => '/',
				'folder' => true,
				'key' => 'root',
				'expanded' => true,
				'children' => $this->listDirectory($this->path($theDir))
			)
		);

		return $aFiles;
	}

	public function lsCodebot($theDir) {
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
			$aFiles[0]['children'] = $this->findActivePlugins();
		}

		return $aFiles;
	}

	public function WriteCodebot($thePath, $theData, $theUserId) {
		if($thePath == './data/prefs.default.json') {
			userUpdatePreferences($theUserId, $theData);
		}
	}

	public function ReadCodebot($thePath, $theUserId) {
		$aRet = '';

		if($thePath == './data/prefs.default.json') {
			$aUser = userGetById($theUserId, true);
			$aRet = $aUser->preferences;
		}

		return $aRet;
	}

	public function CreateProject($theDisk, $theProjectName) {
		$aPath = WORK_POOL . DIRECTORY_SEPARATOR . $theDisk . DIRECTORY_SEPARATOR . $theProjectName;
		mkdir($aPath);

		return $aPath;
	}
}

?>
