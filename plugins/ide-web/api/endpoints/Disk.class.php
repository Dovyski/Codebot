<?php
/*
	The MIT License (MIT)

	Copyright (c) 2016 Fernando Bevilacqua

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

namespace Codebot\Endpoints;

class Disk extends Base {

	public static $contentType = array(
		'read' => 'text/plain'
	);

	private function realPath($theMount = '') {
		return CODEBOT_DISK_WORK_POOL . \Utils::escapePath($theMount) . ($theMount != '' ? DIRECTORY_SEPARATOR : '');
	}

	private function listDirectory($theDir, $thePrettyDir = '') {
		$aContent = array();
		foreach (scandir($theDir) as $aNode) {
			if ($aNode == '.' || $aNode == '..') continue;

			$aObj = new \stdClass();
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
			array('name' => 'cc.codebot.javascript.tools.js', 'title' => 'cc.codebot.javascript.tools.js', 'path' => './plugins/cc.codebot.javascript.tools.js'),
			array('name' => 'cc.codebot.ide.web.dnd.js', 'title' => 'cc.codebot.ide.web.dnd.js', 'path' => './plugins/cc.codebot.ide.web.dnd.js'),
			array('name' => 'cc.codebot.asset.finder.js', 'title' => 'cc.codebot.asset.finder.js', 'path' => './plugins/cc.codebot.asset.finder.js'),
			array('name' => 'cc.codebot.sounder.central.js', 'title' => 'cc.codebot.sound.central.js', 'path' => './plugins/cc.codebot.sound.central.js')
		);
	}

	public function mkdir(array $theParams) {
		$aMount = $this->getParam('mount', $theParams);
		$aPath 	= $this->getParam('path', $theParams);

		$aPath  = $this->realPath($aMount) . Utils::escapePath($aPath);

		mkdir($aPath, 0755, true);

		return array('success' => true, 'msg' => '');
	}

	public function write(array $theParams) {
		$aMount = $this->getParam('mount', $theParams);
		$aPath 	= $this->getParam('path', $theParams);
		$aData 	= $this->getParam('data', $theParams);

		$aPath = $this->realPath($aMount) . Utils::escapePath($aPath);
		$aData = $aData == null && isset($_FILES['file']) ? file_get_contents($_FILES['file']['tmp_name']) : $aData;

		file_put_contents($aPath, $aData);

		return array('success' => true, 'msg' => '');
	}

	public function read(array $theParams) {
		$aMount = $this->getParam('mount', $theParams);
		$aPath 	= $this->getParam('path', $theParams);

		$aPath = $this->realPath($aMount) . Utils::escapePath($aPath);
		$aOut = file_get_contents($aPath);

		return $aOut;
	}

	public function mv(array $theParams) {
		$aMount = $this->getParam('mount', $theParams);
		$aOld 	= $this->getParam('old', $theParams);
		$aNew 	= $this->getParam('new', $theParams);

		$aOldPath = $this->realPath($aMount) . Utils::escapePath($aOld);
		$aNewPath = $this->realPath($aMount) . Utils::escapePath($aNew);

		rename($aOldPath, $aNewPath);

		return array('success' => true, 'msg' => '');
	}

	public function rm(array $theParams) {
		$aMount = $this->getParam('mount', $theParams);
		$aPath 	= $this->getParam('path', $theParams);

		$aPath = $this->realPath($aMount) . Utils::escapePath($aPath);

		if(is_dir($aPath)) {
			rmdir($aPath);
		} else {
			unlink($aPath);
		}

		return array('success' => true, 'msg' => '');
	}

	public function lsCodebot(array $theParams) {
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

		// TODO: improve this
		$aFiles[0]['children'] = $this->findActivePlugins();

		return $aFiles;
	}

	public function ls(array $theParams) {
		$aMount = $this->getParam('mount', $theParams);

		$aFiles = array(
			array(
				'name' => 'Project',
				'title' => 'Project',
				'path' => '/',
				'folder' => true,
				'key' => 'root',
				'expanded' => true,
				'children' => $this->listDirectory($this->realPath($aMount))
			)
		);

		return $aFiles;
	}
}

?>
