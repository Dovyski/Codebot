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

class AssetFinder {
	public function search($theQuery, $theLicenses, $theStart, $theLimit) {
		$theStart = (int)$theStart;
		$theLimit = (int)$theLimit;
		$theQuery = '%' . $theQuery . '%';

		$aRet = array(
			'success' => true,
			'start' => $theStart,
			'limit' => $theLimit,
			'items'	=> array()
		);

		$aQuery = Database::instance()->prepare("SELECT id, title, thumbnail FROM assets WHERE title LIKE ? AND (license & ?) <> 0 LIMIT " . $theStart . "," . $theLimit);

		if ($aQuery->execute(array($theQuery, $theLicenses))) {
			while($aRow = $aQuery->fetch(PDO::FETCH_OBJ)) {
				$aRet['items'][] = $aRow;
			}
		}

		return $aRet;
	}

	public function info($theItemId) {
		$aRet 	= null;
		$aQuery = Database::instance()->prepare("SELECT * FROM assets WHERE id = ?");

		if ($aQuery->execute(array($theItemId))) {
			$aRet 			= $aQuery->fetch(PDO::FETCH_OBJ);

			$aRet->preview 	= unserialize($aRet->preview);
			$aRet->files 	= unserialize($aRet->files);
		}

		return $aRet;
	}
}
?>
