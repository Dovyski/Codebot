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

class User {
	public function getById($theId, $theFull = false) {
		global $gDb;

		$aRet = null;
		$aQuery = $gDb->prepare("SELECT ".($theFull ? '*' : 'id, email, registration_date, disk')." FROM users WHERE id = ?");

		if ($aQuery->execute(array($theId))) {
			$aRet = $aQuery->fetch(PDO::FETCH_OBJ);
		}

		return $aRet;
	}

	public function getByProviderId($theProvider, $theProviderUserUid) {
		global $gDb;

		$aRet = null;
		$aQuery = $gDb->prepare("SELECT id FROM users WHERE auth_uid = ?");

		if ($aQuery->execute(array($theProvider . '/' . $theProviderUserUid))) {
			$aRet = $aQuery->fetch(PDO::FETCH_OBJ);
		}

		return $aRet;
	}

	public function create($theEmail, $theDisk, $theAuthUid, $theAuthRaw) {
		global $gDb;

		$aRet = null;
		$aQuery = $gDb->prepare("INSERT INTO users (id, email, registration_date, disk, auth_uid, auth_raw) VALUES (null, ?, ?, ?, ?, ?)");

		$aQuery->execute(array($theEmail, time(), $theDisk, $theAuthUid, $theAuthRaw));

		return $gDb->lastInsertId();
	}


	public function updatePreferences($theUserId, $theData) {
		global $gDb;

		$aRet = array();
		$aQuery = $gDb->prepare("UPDATE users SET preferences = ? WHERE id = ?");

		$aQuery->execute(array($theData, $theUserId));
		return $aQuery->rowCount() != 0;
	}
}

?>
