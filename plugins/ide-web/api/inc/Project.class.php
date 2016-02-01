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

namespace Codebot;

class Project {
	public $id 				= null;
	public $fk_user 		= null;
	public $name 			= '';
	public $type 			= '';
	public $path 			= '';
	public $creation_date 	= 0;
	public $settings 		= '{}';

	public static function create(User $theOwner) {
		$aProject = new Project();

		if($theOwner == null) {
			throw new \Exception('Invalid project owner');
		}

		$aProject->fk_user 	 	 = $theOwner->id;
		$aProject->name 	 	 = 'Unknown' . rand(0, 9999);
		$aProject->creation_time = time();

		return self::update($aProject);
	}

	public static function delete(Project $theProject) {
		$aRet = null;
		$aQuery = Database::instance()->prepare("DELETE FROM projects WHERE id = ?");

		if($theProject == null) {
			throw new \Exception('Invalid project');
		}

		return $aQuery->execute(array($theProject->id));
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

	public static function findByUser(User $theUser) {
		$aRet = array();
		$aQuery = Database::instance()->prepare("SELECT id, fk_user, name, type, path, creation_date, settings FROM projects WHERE fk_user = ?");

		if ($aQuery->execute(array($theUser->id))) {
			while($aRow = $aQuery->fetchObject("\Codebot\Project")) {
				$aRet[$aRow->id] = $aRow;
			}
		}

		return $aRet;
	}

	public static function getById($theId, $theComplete = false) {
		$aRet = null;
		$aQuery = Database::instance()->prepare("SELECT ".($theComplete ? '*' : 'id, fk_user, name, type, path, creation_date')." FROM projects WHERE id = ?");

		if ($aQuery->execute(array($theId))) {
			$aRet = $aQuery->fetchObject("\Codebot\Project");
		}

		return $aRet;
	}
}

?>
