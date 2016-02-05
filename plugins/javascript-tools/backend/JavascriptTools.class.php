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

use \Codebot\Project;
use \Codebot\Disk;
use \Codebot\Utils;

class JavascriptTools extends \Codebot\Endpoints\Base {
	public function build(array $theParams) {
		$aProjectId = $this->getParam('project', $theParams);

		$aReturn 	= array();
		$aProject 	= Project::getById($aProjectId, true);
		$aUser 		= null;

		if($aProject == null) {
			throw new Exception('Unknown project with id ' . $theProjectId);
		}

		$aUser = $this->getUser();
		$aReturn = $this->compile($aProject, $aUser);

		if($aReturn['success']) {
			$aReturn = array_merge($aReturn, $this->deployForTesting($aReturn));
		}

		return $aReturn;
	}

	private function deployForTesting($theCompilationInfo) {
		$aReturn		= array();
		$aTestDir 		= md5($theCompilationInfo['mount'] . $theCompilationInfo['outDir'] . $theCompilationInfo['outFile']);
		$aTestingPath 	= CODEBOT_JAVASCRIPT_TESTING_POOL . $aTestDir;

		@mkdir($aTestingPath);

		$aTestingPath .= DIRECTORY_SEPARATOR . $theCompilationInfo['outDir'];
		@mkdir($aTestingPath);

		// Remove any slash from the end of the string, otherwise the
		// 'cp' command will go nuts.
		$aLastChar = $aTestingPath[strlen($aTestingPath) - 1];

		if($aLastChar == '/' || $aLastChar == '\\') {
			$aTestingPath = substr($aTestingPath, 0, -1);
		}

		Utils::systemExec('cp -R ' . $theCompilationInfo['mount'] . /*$theCompilationInfo['outDir'] .*/ '* ' . $aTestingPath, __FILE__, __LINE__);

		$aReturn['testingDirUrl'] 	= CODEBOT_JAVASCRIPT_PUBLIC_TESTING_URL . $aTestDir;
		$aReturn['testingFileUrl'] 	= CODEBOT_JAVASCRIPT_PUBLIC_TESTING_URL . $aTestDir . DIRECTORY_SEPARATOR . $theCompilationInfo['outDir'] . $theCompilationInfo['outFile'];

		return $aReturn;
	}

	private function compile($theProject, $theUser) {
		$aSettings 	= json_decode($theProject->settings);
		$aSettings 	= $aSettings === null || $aSettings === false ? new stdClass() : $aSettings;

		$aWidth 	= property_exists($aSettings, 'width') 		? $aSettings->width 		: 640;
		$aHeight 	= property_exists($aSettings, 'height') 	? $aSettings->height 		: 480;
		$aOutDir 	= property_exists($aSettings, 'outDir') 	? $aSettings->outDir 		: '/';
		$aOutFile 	= property_exists($aSettings, 'outFile') 	? $aSettings->outFile 		: 'index.html';

		$aDisk		= new Disk($theUser->disk);
		$aMount		= $aDisk->getFileSystemPath($theProject->path) . DIRECTORY_SEPARATOR;

		$aReturn = array(
			'success' 	=> true,
			'mount' 	=> $aMount,
			'outDir' 	=> $aOutDir,
			'outFile' 	=> $aOutFile
		);

		return $aReturn;
	}
}

?>
