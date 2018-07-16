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
 * This script extracts assets links from a HTML file which contains the exported
 * bookmarks from Google Chrome.
 */

if(php_sapi_name() != 'cli') {
	exit('This is a command line tool.');
}

$aOptions = array(
    "file:",
    "url:",
	"help"
);

$aArgs = getopt("h", $aOptions);

if(isset($aArgs['h']) || isset($aArgs['help']) || $argc <= 2) {
     echo "Usage: \n";
     echo " php extract-links.php [options]\n\n";
     echo "Options:\n";
	 echo " --file=<path>  Path to the html file containing the exported\n";
     echo "                Google Chrome bookmarks.\n";
	 echo " --url=<str>    URL to be searched in the input file. An example\n";
	 echo "                is https://opengameart.org.\n";
     echo " --help, -h     Show this help.\n";
     echo "\n";
     exit(1);
}

$aFile = isset($aArgs['file']) ? $aArgs['file'] : '';
$aURL = isset($aArgs['url']) ? $aArgs['url'] : '';

if(!file_exists($aFile)) {
	echo 'Unable to access file provided via --file: "'.$aFile.'"' . "\n";
	exit(2);
}

if(empty($aURL)) {
	echo 'Invalid URL provided via --url: "'.$aURL.'". Use something like "https://opengameart.org"' . "\n";
	exit(3);
}

foreach (new SplFileObject($aFile) as $aLine) {
	if(empty(trim($aLine))) {
		continue;
	}

	$aMatches = array();
	preg_match_all('/<A HREF="(.*)" A/m', $aLine, $aMatches, PREG_SET_ORDER, 0);

	if(count($aMatches) > 0) {
		$aFileUrl = $aMatches[0][1];

		if(stripos($aFileUrl, $aURL) !== false) {
			echo $aFileUrl . "\n";
		}
	}
}

?>
