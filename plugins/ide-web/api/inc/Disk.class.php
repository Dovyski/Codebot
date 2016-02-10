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

namespace Codebot;

class Disk {
	private $mMount;
	private $mName;

	private function realPath($thePath) {
		return $this->mMount . Utils::escapePath($thePath);
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

	private function assertNotEmpty($theParam, $theName = '?') {
		if(empty($theParam)) {
			throw new \Exception('Empty parameter ' . $theName);
		}
	}

	public function __construct($theMount) {
		$this->assertNotEmpty($theMount);

		$this->mName = Utils::escapePath($theMount);
		$this->mMount = CODEBOT_DISK_WORK_POOL . $this->mName . ($this->mName != '' ? DIRECTORY_SEPARATOR : '');
	}

	public function mkdir($thePath) {
		$this->assertNotEmpty($thePath);

		$aPath = $this->realPath($thePath);
		mkdir($aPath, 0755, true);
	}

	public function write($thePath, $theData = null) {
		$this->assertNotEmpty($thePath);

		$aPath = $this->realPath($thePath);
		file_put_contents($aPath, $theData);
	}

	public function read($thePath) {
		$this->assertNotEmpty($thePath);

		$aPath = $this->realPath($thePath);
		$aOut = file_get_contents($aPath);

		return $aOut;
	}

	public function mv($theOld, $theNew) {
		$this->assertNotEmpty($theOld);
		$this->assertNotEmpty($theNew);

		$aOldPath = $this->realPath($theOld);
		$aNewPath = $this->realPath($theNew);

		rename($aOldPath, $aNewPath);
	}

	public function rm($thePath) {
		$this->assertNotEmpty($thePath);

		$aPath = $this->realPath($thePath);

		if(is_dir($aPath)) {
			rmdir($aPath);
		} else {
			unlink($aPath);
		}
	}

	public function ls($thePath = '', $theName = 'Project') {
		$aFiles = array(
			array(
				'name' => $theName,
				'title' => $theName,
				'path' => '/',
				'folder' => true,
				'key' => 'root',
				'expanded' => true,
				'children' => $this->listDirectory($this->realPath($thePath))
			)
		);

		return $aFiles;
	}

	/**
	 * Gets the real filesystem path for this disk or any of its files/folders.
	 *
	 * @param  {mixed} $theNode If <code>string</code> value is provided, it represents a file/folder in the disk whose real file system path will be returned. If an <code>array</code> is provived, it represents the path until the file/folder, e.g. <code>['a', 'b', 'c.txt']</code> means <code>'filesystem/a/b/c.txt'</code>. If nothing is specified (default), the method assumes that file/node is the root of the disk.
	 * @return {string} The real filesystem path of this disk (or any or its files/folders), e.g. <code>/tmp/data/098f6bcd4621d373cade4e832627b4f6</code>
	 */
	public function getFileSystemPath($theNode = '') {
		$aRet = $this->mMount;

		if(is_array($theNode)) {
			$aRet = Utils::removeAnySlashAtEnd($aRet);

			foreach($theNode as $aPart) {
				$aRet .= DIRECTORY_SEPARATOR . Utils::escapePath($aPart);
			}
		} else {
 			$aRet .= Utils::escapePath($theNode);
		}

		return $aRet;
	}

	/**
	 * Returns the name of this disk.
	 *
	 * @return {string} The name of the disk, which is also the name of the folder in the filesystem that is housing the content of the disk.
	 */
	public function getName() {
		return $this->mName;
	}

	/**
	 * Creates a new disk, including the real filesystem folder
	 * that will house the content of this disk.
	 *
	 * @param  {string} $theSeed A string that will be used as the seed for the disk name. If nothing is informed, the current time will be used as a seed.
	 * @return {Disk}	An instance to a Disk object representing the newly created disk.
	 */
	public static function create($theSeed = null) {
		$aName = md5($theSeed == null ? time() : $theSeed);
		mkdir(CODEBOT_DISK_WORK_POOL . $aName);

		return new Disk($aName);
	}
}

?>
