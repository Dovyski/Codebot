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

function dbfsGetNodeById(& $theList, $theNodeId) {
	$aRet = null;

	if(count($theList) == 0) return null;

	foreach($theList as &$aNode) {
		if($aNode->id == $theNodeId) {
			$aRet = $aNode;
			break;

		} else if(isset($aNode->folder)) {
			$aRet = dbfsGetNodeById($aNode->children, $theNodeId);
		}
	}

	return $aRet;
}

function dbfsList() {
	global $gDb;

	$aRet = array();
	$aQuery = $gDb->prepare("SELECT id, fk_parent, name, dir FROM files WHERE 1");

	if ($aQuery->execute()) {
		while($aRow = $aQuery->fetch(PDO::FETCH_OBJ)) {
			if($aRow->dir) {
				$aRow->folder = true;
				$aRow->key = $aRow->name;
				$aRow->children = array();
			}
			unset($aRow->dir);
			$aRow->title = $aRow->name;

			$aRet[] = $aRow;
		}

		foreach($aRet as $aId => $aNode) {
			if($aNode->fk_parent != null) {
				$aParent = dbfsGetNodeById($aRet, $aNode->fk_parent);

				if($aParent != null) {
					$aParent->children[] = $aNode;
					unset($aRet[$aId]);
				}
			}
		}
	}

	return array_values($aRet);
}

?>
