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
use Codebot\Disk;
use Codebot\Utils;
use Exception;

class Project extends Base {
	public function create(array $theParams) {
		$aType 		 = $this->getParam('type', $theParams);
		$aGitRepo 	 = $this->getParam('git-repo', $theParams, false, true);
		$aTemplate	 = $this->getParam('template', $theParams);
		$aName 		 = $this->getParam('name', $theParams);
		$aVisibility = $this->getParam('visibility', $theParams);

		$aData = array(
			'name' 		=> $aName,
			'type'		=> $aType,
			'template'	=> $aTemplate,
			'git-repo'	=> $aGitRepo
		);

		$aUser = $this->getUser();
		$aProject = self::instantiate($aUser, $aData);

		return array('success' => true, 'project' => $aProject);
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
		$aUser = $this->getUser();

		$aProjects = \Codebot\Project::findByUser($aUser);
		return array('success' => true, 'projects' => $aProjects);
	}

	public function delete($theId) {
		$aUser = User::getById(Auth::getAuthenticatedUserId());

		// TODO: implement this.
		return array('success' => true, 'msg' => '');
	}

	public function open(array $theParams) {
		$aId = $this->getParam('id', $theParams);

		$aUser = $this->getUser();
		$aProject = \Codebot\Project::getById($aId, true);

		if($aProject == null) {
			throw new Exception('Unknown project with id ' . $aId);
		}

		if($aProject->fk_user != $aUser->id) {
			throw new Exception('The user is not allowed to view the project');
		}

		$aDisk = new Disk($aUser->disk);

		$aProject->files = $aDisk->ls($aProject->path . '/', $aProject->name);
		$aProject->settings = $this->readSettingsFile($aProject, $aProject->files);

		return array('success' => true, 'project' => $aProject);
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
		$aNameClean = preg_replace('/[^a-zA-Z0-9]+/', '', $aName) . time();

		if(strlen($aName) < 1) {
			throw new Exception('Invalid project name');
		}

		// TODO: check for valid project types
		if(empty($aType)) {
			throw new Exception('Invalid project type');
		}

		// Create physical folders and stuff
		$aDisk = new Disk($theUser->disk);
		$aDisk->mkdir($aNameClean);

		$aFileSystemPath = $aDisk->getFileSystemPath($aNameClean) . DIRECTORY_SEPARATOR;

		$aRet 					= new \Codebot\Project();
		$aRet->id 				= null;
		$aRet->fk_user 			= $aFkUser;
		$aRet->name 			= $aName;
		$aRet->type 			= $aType;
		$aRet->path 			= $aNameClean;
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

	public function update(array $theParams) {
		$aId = $this->getParam('id', $theParams);
		$aSettings = $this->getParam('settings', $theParams, true, true);

		$aUser = $this->getUser();

		$aQuery = Database::instance()->prepare("UPDATE projects SET settings = ? WHERE id = ? AND fk_user = ?");
		$aQuery->execute(array($aSettings, $aId, $aUser->id));

		return array('success' => $aQuery->rowCount() != 0);
	}
}

?>
