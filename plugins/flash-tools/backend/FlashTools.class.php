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

class FlashTools {
	public function build($theProjectId) {
		$aReturn 	= array();
		$aProject 	= Project::getById($theProjectId, true);
		$aUser 		= null;

		if($aProject == null) {
			throw new Exception('Unknown project with id ' . $theProjectId);
		}

		$aUser = User::getById($aProject->fk_user);

		if($aUser == null) {
			throw new Exception('Invalid user');
		}

		$aReturn = $this->compile($aProject, $aUser);

		if($aReturn['success']) {
			$aReturn = array_merge($aReturn, $this->deployForTesting($aReturn));
		}

		return $aReturn;
	}

	private function deployForTesting($theCompilationInfo) {
		$aReturn		= array();
		$aTestDir 		= md5($theCompilationInfo['mount'] . $theCompilationInfo['outDir'] . $theCompilationInfo['outFile']);
		$aTestingPath 	= CODEBOT_FLASH_TESTING_POOL . $aTestDir;

		@mkdir($aTestingPath);

		$aTestingPath .= DIRECTORY_SEPARATOR . $theCompilationInfo['outDir'];
		@mkdir($aTestingPath);

		// Remove any slash from the end of the string, otherwise the
		// 'cp' command will go nuts.
		$aLastChar = $aTestingPath[strlen($aTestingPath) - 1];

		if($aLastChar == '/' || $aLastChar == '\\') {
			$aTestingPath = substr($aTestingPath, 0, -1);
		}

		exec('cp -R ' . $theCompilationInfo['mount'] . $theCompilationInfo['outDir'] . '* ' . $aTestingPath);

		$aReturn['testingDirUrl'] 	= CODEBOT_FLASH_PUBLIC_TESTING_URL . $aTestDir;
		$aReturn['testingFileUrl'] 	= CODEBOT_FLASH_PUBLIC_TESTING_URL . $aTestDir . DIRECTORY_SEPARATOR . $theCompilationInfo['outDir'] . $theCompilationInfo['outFile'];

		return $aReturn;
	}

	private function compile($theProject, $theUser) {
		$aSettings 	= json_decode($theProject->settings);
		$aSettings 	= $aSettings === null || $aSettings === false ? new stdClass() : $aSettings;

		$aWidth 	= property_exists($aSettings, 'width') 		? $aSettings->width 		: 640;
		$aHeight 	= property_exists($aSettings, 'height') 	? $aSettings->height 		: 480;
		$aSwf 		= property_exists($aSettings, 'swf') 		? $aSettings->swf 			: 22;
		$aDebug 	= property_exists($aSettings, 'debug') 		? $aSettings->debug 		: 'true';
		$aLibs 		= property_exists($aSettings, 'libs') 		? $aSettings->libs 			: '/lib/';
		$aDocClass 	= property_exists($aSettings, 'docClass') 	? $aSettings->docClass 		: '/src/Mode.as';
		$aOutDir 	= property_exists($aSettings, 'outDir') 	? $aSettings->outDir 		: '/bin/';
		$aOutFile 	= property_exists($aSettings, 'outFile') 	? $aSettings->outFile 		: 'Mode.swf';

		// TODO: use config.xml to invoke mxmlc
		// TODO: escape shell stuff using escapeshellarg().
		$aDisk		= new Disk();
		$aMount		= $aDisk->dirPath($theUser->disk, $theProject->path);
		$aCommand	= CODEBOT_FLASH_FLEX_SDK . 'mxmlc -default-size '.$aWidth.' '.$aHeight.' '.$aMount.$aDocClass.' -library-path+='.$aMount.$aLibs.' -swf-version='.$aSwf.' -debug='.$aDebug.' -static-link-runtime-shared-libraries=true -o '.$aMount.$aOutDir.$aOutFile.' '.CODEBOT_FLASH_OUTPUT_REPIPE;

		$aLogs = Utils::systemExec($aCommand, __FILE__, __LINE__);

		array_shift($aLogs);

		foreach($aLogs as $aKey => $aValue) {
			$aPos = strpos($aLogs[$aKey], $theProject->path);

			if($aPos !== false) {
				$aLogs[$aKey] = substr($aLogs[$aKey], $aPos + strlen($theProject->path));
			}
		}

		$aReturn = array(
			'success' 	=> count($aLogs) == 1,
			'mount' 	=> $aMount,
			'outDir' 	=> $aOutDir,
			'outFile' 	=> $aOutFile,
			'log' 		=> $aLogs
		);

		return $aReturn;
	}
}

?>
