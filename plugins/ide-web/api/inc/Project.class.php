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
	public $id 				= null;
	public $fk_user 		= null;
	public $name 			= '';
	public $type 			= '';
	public $path 			= '';
	public $creation_date 	= 0;
	public $settings 		= '{}';

	public function create($theType, $theGitRepo, $theTemplate, $theName, $theVisibility) {
		$aData = array(
			'name' 		=> $theName,
			'type'		=> $theType,
			'template'	=> $theTemplate,
			'git-repo'	=> $theGitRepo,
		);

		$aUserId = Auth::getAuthenticatedUserId();
		$aUser 	 = User::getById($aUserId);

		if($aUser == null) {
			throw new Exception('Invalid project owner');
		}

		$aProject = self::instantiate($aUser, $aData);

		return array('success' => true, 'project' => $aProject, 'msg' => '');
	}

	public function findTypesAndTemplates() {
		// TODO: get this from a real source, e.g. each platform handler register its own type and templates.
		return array(
			'success' => true,
			'types' => array(
				'flash' => array(
	                'name' => 'Flash/AS3',
	                'templates' => array(
	                    'flash-empty' 				=> array('name' => 'Empty', 'icon' => 'http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/flash/articles/using-sprite-sheet-generator/fig01.gif'),
	                    'flash-flixel-community' 	=> array('name' => 'Flixel Community', 'icon' => 'http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/flash/articles/using-sprite-sheet-generator/fig01.gif'),
	                )
	            ),
				'js' => array(
	                'name' => 'HTML5/Javascript',
	                'templates' => array(
						'js-empty' 		=> array('name' => 'Empty', 'icon' => 'http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/flash/articles/using-sprite-sheet-generator/fig01.gif'),
	                    'js-phaser' 	=> array('name' => 'Phaser (bare minimum)', 'icon' => 'http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/flash/articles/using-sprite-sheet-generator/fig01.gif'),
	                )
	            )
			)
		);
	}

	public function search() {
		$aUserId = Auth::getAuthenticatedUserId();
		$aUser 	 = User::getById($aUserId);

		$aProjects = self::findByUser($aUser);
		return array('success' => true, 'msg' => '', 'projects' => $aProjects);
	}

	public function delete($theId) {
		$aUserId = Auth::getAuthenticatedUserId();
		$aUser 	 = User::getById($aUserId);

		// TODO: implement this.
		return array('success' => true, 'msg' => '');
	}

	public function open($theId) {
		$aUser = User::getById(Auth::getAuthenticatedUserId());

		if($aUser == null) {
			throw new Exception('Invalid project owner');
		}

		$aProject = Project::getById($theId, true);

		if($aProject == null) {
			throw new Exception('Unknown project with id ' . $theId);
		}

		if($aProject->fk_user != $aUser->id) {
			throw new Exception('The user is not allowed to view the project');
		}

		$aDisk = new Disk();
		$aPath = $aDisk->dirPath($aUser->disk, $aProject->path);

		$aFiles = array(
			array(
				'name' 		=> $aProject->name,
				'title' 	=> $aProject->name,
				'path' 		=> '/',
				'folder' 	=> true,
				'key' 		=> 'root',
				'expanded' 	=> true,
				'children' 	=> $aDisk->listDirectory($aPath)
			)
		);

		$aProject->files 	= $aFiles;
		$aProject->settings = $this->readSettingsFile($aProject, $aFiles);

		return array('success' => true, 'msg' => '', 'project' => $aProject);
	}

	private function readSettingsFile($theProject, $theFiles) {
		// TODO: implement it.
		return json_decode($theProject->settings);
	}

	private static function instantiate($theUser, $theData) {
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

		// Create physical folders and stuff
		$aFileSystemPath = Disk::createProjectDir($theUser->disk, $aPath);

		$aRet 					= new Project();
		$aRet->id 				= null;
		$aRet->fk_user 			= $aFkUser;
		$aRet->name 			= $aName;
		$aRet->type 			= $aType;
		$aRet->path 			= $aPath;
		$aRet->creation_time 	= time();
		$aRet->settings 		= self::initBasedOnTemplate($aFileSystemPath, $aTemplate, $theData);

		return self::update($aRet);
	}

	private static function initBasedOnTemplate($theFileSystemPath, $theTemplate, $theData) {
		$aTemplatePath 			= CODEBOT_PROJECT_TEMPLATES_FOLDER . DIRECTORY_SEPARATOR . Utils::securePath($theTemplate) . DIRECTORY_SEPARATOR;
		$aTemplateFilesPath		= $aTemplatePath . 'files' . DIRECTORY_SEPARATOR;
		$aTemplateSettingsPath 	= $aTemplatePath . 'settings.json';

		$aTemplateSettings 		= '{}';

		if($theTemplate == 'git') {
			$aGitRepo = @$theData['git-repo'];

			if(!empty($aGitRepo)) {
				// TODO: improve security here.
				Utils::systemExec('git clone '. $aGitRepo . ' ' . $theFileSystemPath, __FILE__, __LINE__);
			}
		} else {
			$aTemplateSettings = file_get_contents($aTemplateSettingsPath);
			Utils::systemExec('cp -R '. $aTemplateFilesPath . '* ' . $theFileSystemPath, __FILE__, __LINE__);
		}

		return $aTemplateSettings;
	}

	public static function update(Project $theProject) {
		$aRet 	= null;
		$aQuery = Database::instance()->prepare("
			INSERT INTO
				projects (id, fk_user, name, type, path, creation_date, settings)
			 VALUES
				(?, ?, ?, ?, ?, ?, ?)
			 ON DUPLICATE KEY UPDATE
				fk_user = ?, name = ?, type = ?, path = ?, creation_date = ?, settings = ?
		");

		$aQuery->execute(array(
				$theProject->id, $theProject->fk_user, $theProject->name, $theProject->type, $theProject->path, $theProject->creation_date, $theProject->settings,
				$theProject->fk_user, $theProject->name, $theProject->type, $theProject->path, $theProject->creation_date, $theProject->settings
		));

		if($theProject->id == null) {
			$theProject->id = Database::instance()->lastInsertId();
		}

		return $theProject;
	}

	public static function updateSettings($theProjectId, $theData) {
		$aRet 	= array();
		$aUser 	= User::getById(Auth::getAuthenticatedUserId());

		if($aUser == null) {
			throw new Exception('Invalid project owner');
		}

		$aQuery = Database::instance()->prepare("UPDATE projects SET settings = ? WHERE id = ? AND fk_user = ?");

		$aQuery->execute(array($theData, $theProjectId, $aUser->id));
		return $aQuery->rowCount() != 0;
	}

	public static function findByUser($theUser) {
		$aRet = array();
		$aQuery = Database::instance()->prepare("SELECT id, fk_user, name, type, path, creation_date, settings FROM projects WHERE fk_user = ?");

		if ($aQuery->execute(array($theUser->id))) {
			while($aRow = $aQuery->fetch(PDO::FETCH_OBJ)) {
				$aRet[$aRow->id] = $aRow;
			}
		}

		return $aRet;
	}

	public static function getById($theId, $theComplete = false) {
		$aRet = null;
		$aQuery = Database::instance()->prepare("SELECT ".($theComplete ? '*' : 'id, fk_user, name, type, path, creation_date')." FROM projects WHERE id = ?");

		if ($aQuery->execute(array($theId))) {
			$aRet = $aQuery->fetchObject("Project");
		}

		return $aRet;
	}

}

?>
