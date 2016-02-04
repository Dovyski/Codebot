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

namespace Codebot\Endpoints;

use Codebot\User;
use Codebot\Auth;
use Codebot\Database;
use Exception;

class Project extends Base {
	public function create($theType, $theGitRepo, $theTemplate, $theName, $theVisibility) {
		$aData = array(
			'name' 		=> $theName,
			'type'		=> $theType,
			'template'	=> $theTemplate,
			'git-repo'	=> $theGitRepo,
		);

		$aUser = User::getById(Auth::getAuthenticatedUserId());

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
		$aUser = User::getById(Auth::getAuthenticatedUserId());

		$aProjects = \Codebot\Project::findByUser($aUser);
		return array('success' => true, 'msg' => '', 'projects' => $aProjects);
	}

	public function delete($theId) {
		$aUser = User::getById(Auth::getAuthenticatedUserId());

		// TODO: implement this.
		return array('success' => true, 'msg' => '');
	}

	public function open($theId) {
		$aUser = User::getById(Auth::getAuthenticatedUserId());

		if($aUser == null) {
			throw new Exception('Invalid project owner');
		}

		$aProject = \Codebot\Project::getById($theId, true);

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

		$aRet 					= new \Codebot\Project();
		$aRet->id 				= null;
		$aRet->fk_user 			= $aFkUser;
		$aRet->name 			= $aName;
		$aRet->type 			= $aType;
		$aRet->path 			= $aPath;
		$aRet->creation_time 	= time();
		$aRet->settings 		= self::initBasedOnTemplate($aFileSystemPath, $aTemplate, $theData);

		return \Codebot\Project::update($aRet);
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
			$aSettings = @file_get_contents($aTemplateSettingsPath);
			Utils::systemExec('cp -R '. $aTemplateFilesPath . '* ' . $theFileSystemPath, __FILE__, __LINE__);

			$aTemplateSettings = $aSettings !== false ? $aSettings : $aTemplateSettings;
		}

		return $aTemplateSettings;
	}

	public function update($theProjectId, $theData) {
		$aRet  = array();
		$aUser = User::getById(Auth::getAuthenticatedUserId());

		if($aUser == null) {
			throw new Exception('Invalid project owner');
		}

		$aQuery = Database::instance()->prepare("UPDATE projects SET settings = ? WHERE id = ? AND fk_user = ?");

		$aQuery->execute(array($theData, $theProjectId, $aUser->id));
		return $aQuery->rowCount() != 0;
	}
}

?>
