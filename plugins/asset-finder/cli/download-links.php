<?php
/*
	The MIT License (MIT)

	Copyright (c) 2018 Fernando Bevilacqua

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


/**
 * This script downloads assets from a list of links.
 */

if(php_sapi_name() != 'cli') {
	exit('This is a command line tool.');
}

$aOptions = array(
    "file:",
	"wait-min:",
	"wait-max:",
	"simulate",
    "start:",
	"help"
);

$aArgs = getopt("h", $aOptions);

if(isset($aArgs['h']) || isset($aArgs['help']) || $argc <= 1) {
     echo "Usage: \n";
     echo " php download-links.php [options]\n\n";
     echo "Options:\n";
	 echo " --file=<path>     Path to the file containing the list of links\n";
     echo "                   to be downloaded. Each link should be in a single line.\n";
	 echo " --wait-min=<int>  Minimum amount of seconds to wait between the download\n";
	 echo "                   of each asset link. Default is 5 seconds.\n";
	 echo " --wait-max=<int>  Maximum amount of seconds to wait between the download\n";
	 echo "                   of each asset link. Default is 10 seconds.\n";
	 echo " --simulate        Simulate the process without downloading anything.\n";
	 echo " --start=<int>     Line where the download should start. By default,\n";
	 echo "                   process starts at line 1 (first line).\n";
     echo " --help, -h        Show this help.\n";
     echo "\n";
     exit(1);
}

$aFile = isset($aArgs['file']) ? $aArgs['file'] : '';
$aWaitMin = isset($aArgs['wait-min']) ? (int)$aArgs['wait-min'] : 5;
$aWaitMax = isset($aArgs['wait-max']) ? (int)$aArgs['wait-max'] : 5;
$aSimulate = isset($aArgs['simulate']);
$aStart = isset($aArgs['start']) ? (int)$aArgs['start'] : 1;

if(!file_exists($aFile)) {
	echo 'Unable to access file provided via --file: "'.$aFile.'"' . "\n";
	exit(2);
}

$aLines = file($aFile);
$aCount = 0;
$aTotalLines = count($aLines);
$aFileBasename = basename($aFile);

$aOgaCmd = 'php "' . dirname(__FILE__) . DIRECTORY_SEPARATOR . 'oga.php"';

foreach ($aLines as $aLink) {
	$aLink = trim($aLink);
	$aCount++;

	if(empty($aLink)) {
		continue;
	}

	$aTag = sprintf('%s:%d [%.1f%%]', $aFileBasename, $aCount, (double)($aCount / $aTotalLines) * 100);

	if($aCount < $aStart) {
		continue;
	}

	$aCmd = '';

	if(stripos($aLink, 'opengameart.org') !== false) {
		$aCmd = $aOgaCmd . ' --url="'.$aLink.'"';
	}

	if(empty($aCmd)) {
		echo 'Unsupported asset provider in link: "'.$aLink.'"' . "\n";
		exit(3);
	}

	echo $aTag.' ' . $aLink . "\n";

	if(!$aSimulate) {
		$aOutput = array();
		$aRetVar = -1;

		exec($aCmd, $aOutput, $aRetVar);
		if($aRetVar != 0) {
			echo '  [FAILED] Error code: ' . $aRetVar . "\n";
		}
		sleep(rand($aWaitMin, $aWaitMax));
	}
}

echo 'Finished successfully!' . "\n";
echo ($aSimulate ? 'NOTE: this was a simulation, nothinig was downloaded.' . "\n" : '');
exit(0);

?>
