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

function userGetById($theId, $theFull = false) {
	global $gDb;

	$aRet = null;
	$aQuery = $gDb->prepare("SELECT ".($theFull ? '*' : 'id, email, registration_date, disk')." FROM users WHERE id = ?");

	if ($aQuery->execute(array($theId))) {
		$aRet = $aQuery->fetch(PDO::FETCH_OBJ);
	}

	return $aRet;
}

function userGetByProviderId($theProvider, $theProviderUserUid) {
	global $gDb;

	$aRet = null;
	$aQuery = $gDb->prepare("SELECT id FROM users WHERE auth_uid = ?");

	if ($aQuery->execute(array($theProvider . '/' . $theProviderUserUid))) {
		$aRet = $aQuery->fetch(PDO::FETCH_OBJ);
	}

	return $aRet;
}

function userCreate($theEmail, $theDisk, $theAuthUid, $theAuthRaw) {
	global $gDb;

	$aRet = null;
	$aQuery = $gDb->prepare("INSERT INTO users (id, email, registration_date, disk, auth_uid, auth_raw) VALUES (null, ?, ?, ?, ?, ?)");

	$aQuery->execute(array($theEmail, time(), $theDisk, $theAuthUid, $theAuthRaw));

	return $gDb->lastInsertId();
}


function projectCreate($theUser, $theName, $theType) {
	global $gDb;

	$aQuery = $gDb->prepare("INSERT INTO projects (fk_user, name, type, path, creation_date) VALUES (?, ?, ?, ?, ?)");

	$aFkUser = $theUser->id;
	$aName = $theName;
	$aType = $theType;
	$aPath = preg_replace("/[^a-zA-Z0-9]+/", "", $aName) . time();

	if(strlen($theName) < 1) {
		throw new Exception('Invalid project name');
	}

	if(empty($aType)) {
		throw new Exception('Invalid project type');
	}

	$aQuery->execute(array($aFkUser, $aName, $aType, $aPath, time()));

	// Create physical folders and stuff
	webdiskCreateProject($theUser->disk, $aPath);

	return $aPath;
}

function projectDelete($theUser, $theId) {
	// TODO: implement this.
}

function projectFindByUser($theUser) {
	global $gDb;

	$aRet = array();
	$aQuery = $gDb->prepare("SELECT * FROM projects WHERE fk_user = ?");

	if ($aQuery->execute(array($theUser->id))) {
		while($aRow = $aQuery->fetch(PDO::FETCH_OBJ)) {
			$aRet[] = $aRow;
		}
	}

	return $aRet;
}

// TODO: move this to webdisk API.
function diskCreate($theUser) {
 	$aDisk = md5($theUser . time());
	mkdir(WORK_POOL . '/' . $aDisk);

	return $aDisk;
}

function authMakeAuthenticationUsingOAuthInfo($theInfo) {
	$aProvider 		= $theInfo['provider'];
	$aUid 			= $theInfo['uid'];
	$aLocalUser 	= userGetByProviderId($aProvider, $aUid);
	$aLocalUserId 	= null;

	if($aLocalUser == null) {
		// No local account has been found.
		// Let's create one then.

		$aDisk 			= diskCreate($aProvider . $aUid);
		$aEmail 		= isset($theInfo['info']['email']) ? $theInfo['info']['email'] : '';
		$aAuthUid 		= $aProvider . '/' . $aUid;

		$aLocalUserId 	= userCreate($aEmail, $aDisk, $aAuthUid, serialize($theInfo));

	} else {
		$aLocalUserId = $aLocalUser->id;
	}

	// Authenticate
	$_SESSION['id'] = $aLocalUserId;
	return true;
}

?>
