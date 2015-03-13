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

class Project {
	public function create($theUser, $theData) {
		global $gDb;

		$aQuery = $gDb->prepare("INSERT INTO projects (fk_user, name, type, path, creation_date) VALUES (?, ?, ?, ?, ?)");

		$aFkUser 	= $theUser->id;
		$aName 		= @$theData['name'];
		$aType 		= @$theData['type'];
		$aTemplate 	= isset($theData['template']) ? $theData['template'] : 'empty';
		$aPath 		= preg_replace("/[^a-zA-Z0-9]+/", "", $aName) . time();

		if(strlen($aName) < 1) {
			throw new Exception('Invalid project name');
		}

		if(empty($aType)) {
			throw new Exception('Invalid project type');
		}

		$aQuery->execute(array($aFkUser, $aName, $aType, $aPath, time()));

		// Create physical folders and stuff
		$aFileSystemPath = webdiskCreateProject($theUser->disk, $aPath);
		projectInitBasedOnTemplate($aFileSystemPath, $aTemplate, $theData);

		$aRet = new stdClass();

		$aRet->id 		= $gDb->lastInsertId();
		$aRet->fk_user 	= $aFkUser;
		$aRet->name 	= $aName;
		$aRet->type 	= $aType;
		$aRet->path 	= $aPath;

		return $aRet;
	}

	public function initBasedOnTemplate($theFileSystemPath, $theTemplate, $theData) {
		$aTemplatePath = PROJECT_TEMPLATES_FOLDER . md5($theTemplate) . DIRECTORY_SEPARATOR;

		if($theTemplate == 'git') {
			$aGitRepo = @$theData['git-repo'];

			if(!empty($aGitRepo)) {
				// TODO: improve security here.
				exec('git clone '. $aGitRepo . ' ' . $theFileSystemPath);
			}
		} else {
			exec('cp -R '. $aTemplatePath . '* ' . $theFileSystemPath);
		}

		file_put_contents($theFileSystemPath . '/README.txt', "This is a test!\nA nice welcome message will be placed here.\n\nCheers,\nCodebot Team");
	}

	public function delete($theUser, $theId) {
		// TODO: implement this.
	}

	public function updateSettings($theProjectId, $theUserId, $theData) {
		global $gDb;

		$aRet = array();
		$aQuery = $gDb->prepare("UPDATE projects SET settings = ? WHERE id = ? AND fk_user = ?");

		$aQuery->execute(array($theData, $theProjectId, $theUserId));
		return $aQuery->rowCount() != 0;
	}

	public function findByUser($theUser) {
		global $gDb;

		$aRet = array();
		$aQuery = $gDb->prepare("SELECT id, fk_user, name, type, path, creation_date, settings FROM projects WHERE fk_user = ?");

		if ($aQuery->execute(array($theUser->id))) {
			while($aRow = $aQuery->fetch(PDO::FETCH_OBJ)) {
				$aRet[$aRow->id] = $aRow;
			}
		}

		return $aRet;
	}

	public function getById($theId, $theComplete = false) {
		global $gDb;

		$aRet = null;
		$aQuery = $gDb->prepare("SELECT ".($theComplete ? '*' : 'id, fk_user, name, type, path, creation_date')." FROM projects WHERE id = ?");

		if ($aQuery->execute(array($theId))) {
			$aRet = $aQuery->fetch(PDO::FETCH_OBJ);
		}

		return $aRet;
	}

}

?>
