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

class User {
	public static function getOrCreateByOAuthInfo($theInfo) {
		$aProvider 		= $theInfo['provider'];
		$aUid 			= $theInfo['uid'];
		$aLocalUser 	= self::getByProviderId($aProvider, $aUid);
		$aLocalUserId 	= null;

		if($aLocalUser == null) {
			// No local account has been found.
			// Let's create one then.

			$aDisk 			= Disk::create($aProvider . $aUid);
			$aEmail 		= isset($theInfo['info']['email']) ? $theInfo['info']['email'] : '';
			$aAuthUid 		= $aProvider . '/' . $aUid;

			$aLocalUserId 	= self::create($aEmail, $aDisk->getName(), $aAuthUid, serialize($theInfo));

		} else {
			$aLocalUserId = $aLocalUser->id;
		}

		return $aLocalUserId;
	}

	public static function getById($theId, $theFull = false) {
		$aRet = null;
		$aQuery = Database::instance()->prepare("SELECT ".($theFull ? '*' : 'id, email, registration_date, disk')." FROM users WHERE id = ?");

		if ($aQuery->execute(array($theId))) {
			$aRet = $aQuery->fetchObject('\Codebot\User');
		}

		return $aRet;
	}

	public static function getByProviderId($theProvider, $theProviderUserUid) {
		$aRet = null;
		$aQuery = Database::instance()->prepare("SELECT id FROM users WHERE auth_uid = ?");

		if ($aQuery->execute(array($theProvider . '/' . $theProviderUserUid))) {
			$aRet = $aQuery->fetchObject('\Codebot\User');
		}

		return $aRet;
	}

	public static function create($theEmail, $theDisk, $theAuthUid, $theAuthRaw) {
		$aRet = null;
		$aQuery = Database::instance()->prepare("INSERT INTO users (id, email, registration_date, disk, auth_uid, auth_raw, settings) VALUES (null, ?, ?, ?, ?, ?, '{}')");

		$aQuery->execute(array($theEmail, time(), $theDisk, $theAuthUid, $theAuthRaw));

		return Database::instance()->lastInsertId();
	}


	public static function update(User $theUser) {
		$aRet = array();
		$aQuery = Database::instance()->prepare("UPDATE users SET settings = ? WHERE id = ?");

		$aQuery->execute(array($theUser->settings, $theUser->id));
		return $aQuery->rowCount() != 0;
	}
}

?>
