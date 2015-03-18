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
	public static $contentType = array(
		'read' => 'text/plain'
	);

	private function escapePath($thePath) {
		return escapeshellcmd(str_replace('..', '', $thePath));
	}

	private function realPath($theMount = '') {
		return CODEBOT_DISK_WORK_POOL . $this->escapePath($theMount) . ($theMount != '' ? DIRECTORY_SEPARATOR : '');
	}

	public function listDirectory($theDir, $thePrettyDir = '') {
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

	public function dirPath() {
		$aNumArgs 	= func_num_args();
		$aArgs 		= func_get_args();
		$aRet		= $this->realPath();

		for($i = 0; $i < $aNumArgs; $i++) {
			$aRet .= $this->escapePath($aArgs[$i]) . DIRECTORY_SEPARATOR;
		}

		return $aRet;
	}

	public function mkdir($theMount, $thePath) {
		if(empty($thePath)) {
			throw new Exception('Empty path in Disk::mkdir().');
		}

		$aPath = $this->realPath($theMount) . $this->escapePath($thePath);

		mkdir($aPath, 0755, true);

		return array('success' => true, 'msg' => '');
	}

	public function write($theMount, $thePath, $theData = null) {
		if(empty($thePath)) {
			throw new Exception('Empty path in Disk::write().');
		}

		$aPath = $this->realPath($theMount) . $this->escapePath($thePath);
		$aData = $theData == null && isset($_FILES['file']) ? file_get_contents($_FILES['file']['tmp_name']) : $theData;

		file_put_contents($aPath, $aData);

		return array('success' => true, 'msg' => '');
	}

	public function read($theMount, $thePath) {
		if(empty($thePath)) {
			throw new Exception('Empty path in Disk::read().');
		}

		$aPath = $this->realPath($theMount) . $this->escapePath($thePath);
		$aOut = file_get_contents($aPath);

		return $aOut;
	}

	public function mv($theMount, $theOldPath, $theNewPath) {
		$aOldPath = $this->realPath($theMount) . $this->escapePath($theOldPath);
		$aNewPath = $this->realPath($theMount) . $this->escapePath($theNewPath);

		rename($aOldPath, $aNewPath);

		return array('success' => true, 'msg' => '');
	}

	public function rm($theMount, $thePath) {
		if(empty($thePath)) {
			throw new Exception('Empty path in Disk::rm().');
		}

		$aPath = $this->realPath($theMount) . $this->escapePath($thePath);

		if(is_dir($aPath)) {
			rmdir($aPath);
		} else {
			unlink($aPath);
		}

		return array('success' => true, 'msg' => '');
	}

	public function lsCodebot($theMount, $theDir) {
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
			// TODO: improve this
			$aFiles[0]['children'] = $this->findActivePlugins();
		}

		return $aFiles;
	}

	public function ls($theMount) {
		$aFiles = array(
			array(
				'name' => 'Project',
				'title' => 'Project',
				'path' => '/',
				'folder' => true,
				'key' => 'root',
				'expanded' => true,
				'children' => $this->listDirectory($this->realPath($theMount))
			)
		);

		return $aFiles;
	}

	public static function create($theUserNickname) {
		$aDiskName = md5($theUserNickname . time());
		mkdir(CODEBOT_DISK_WORK_POOL . DIRECTORY_SEPARATOR . $aDiskName);

		return $aDiskName;
	}

	public static function createProjectDir($theDisk, $theProjectName) {
		$aPath = CODEBOT_DISK_WORK_POOL . DIRECTORY_SEPARATOR . $theDisk . DIRECTORY_SEPARATOR . $theProjectName;
		mkdir($aPath);

		return $aPath;
	}
}

?>
