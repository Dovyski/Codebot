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
/*
{title: "Test.as", path: "/proj/Test.as", name: "Test.as"},
{title: "Folder 2", folder: true, key: "folder2", path: "/proj/Folder 2/", name: "Folder 2",
children: [
	{title: "Test2.as", path: "/proj/Folder 2/Test2.as", name: "Test2.as"},
	{title: "Test3.as", path: "/proj/Folder 2/Test3.as", name: "Test3.as"}
]
},
*/
function listDirectory($theDir, $thePrettyDir = '') {
	$aContent = array();
	foreach (scandir($theDir) as $aNode) {
		if ($aNode == '.' || $aNode == '..') continue;

		$aObj = new stdClass();
		$aObj->title = $aNode;
		$aObj->name = $aNode;
		$aObj->path = $thePrettyDir . $aNode;

		if (is_dir($theDir . '/' . $aNode)) {
			$aObj->folder = true;
			$aObj->key = $aObj->path;
			$aObj->children = listDirectory($theDir . $aNode . '/', $thePrettyDir . $aNode . '/');
		}

		$aContent[] = $aObj;
	}
	return $aContent;
}

function webdiskCreateProject($theDisk, $theProjectName) {
	$aPath = WORK_POOL . '/' . $theDisk . '/' . $theProjectName;
	mkdir($aPath);

	file_put_contents($aPath . '/README.txt', "This is a test!\nA nice welcome message will be placed here.\n\nCheers,\nCodebot Team");
}

?>
