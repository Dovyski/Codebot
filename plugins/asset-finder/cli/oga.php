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


/**
 * This script indexes different assets provider websites (e.g. OpenGameArt)
 * in order to create a searchable database of entries available to the
 * assets finder plugin.
 */

@include_once dirname(__FILE__).'/../../ide-web/config.local.php';
include_once dirname(__FILE__).'/../../ide-web/config.php';

require_once dirname(__FILE__).'/../../ide-web/api/inc/Database.class.php';
require_once dirname(__FILE__).'/../../ide-web/api/inc/Utils.class.php';

require_once dirname(__FILE__) . '/3rdparty/querypath/qp.php';

if(php_sapi_name() != 'cli') {
	exit('This is a command line tool.');
}

$aOptions = array(
    "url:",
    "help",
	"force"
);

$aArgs = getopt("hf", $aOptions);

if(isset($aArgs['h']) || isset($aArgs['help']) || $argc <= 1) {
     echo "Usage: \n";
     echo " php oga.php [options]\n\n";
     echo "Options:\n";
     echo " --url=<str>  URL of the asset to be downloaded from OpenGameArt.org.\n";
	 echo " --force, -f  Force a download even if the asset already exists in\n";
	 echo "              in the local cache/db.\n";
     echo " --help, -h   Show this help.\n";
     echo "\n";
     exit(1);
}

use \Codebot\Utils;
use \Codebot\Database;

if(!file_exists(CODEBOT_ASSET_FINDER_MIRROR_FOLDER)) {
	echo 'Unable to access mirror folder: "'.CODEBOT_ASSET_FINDER_MIRROR_FOLDER.'". Ensure CODEBOT_ASSET_FINDER_MIRROR_FOLDER points to a valid folder.' . "\n";
	exit(2);
}

$aURL = isset($aArgs['url']) ? $aArgs['url'] : '';
$aForce = isset($aArgs['f']) || isset($aArgs['force']);

if(empty($aURL)) {
	echo 'Provide a valid URL via --url.' . "\n";
	exit(3);
}

$aInfo = parse_url($aURL);

if(!isset($aInfo['host'])) {
	echo 'Invalid URL provided via --url: "'.$aURL.'".' . "\n";
	echo 'URL should be "https://opengameart.org/content/AAA" where "AAA" is the target asset.' . "\n";
	exit(4);
}

Database::init();

echo 'Parsing URL content.' . "\n";

$aChannel = $aInfo['host'];
$aQp = htmlqp($aURL);

$aTitle 	= $aQp->find('div.group-header h2')->text();
$aAuthor 	= $aQp->find('div.group-left span.username')->text();
$aLicenses	= array();

$aQp->find('div.field-name-field-art-licenses div.license-icon a')->each(function($theIndex, $theElement) {
	global $aLicenses;
	$aLicenses[] = $theElement->getAttribute('href');
});

$aPreviews 	= array();

$aQp->find('div.field-name-field-art-preview div.field-item img')->each(function($theIndex, $theElement) {
	global $aPreviews;
	$aPreviews[] = $theElement->getAttribute('src');
});

$aDescription	= $aQp->find('div.field-type-text-with-summary div.field-item')->text();
$aFiles			= array();

$aQp->find('div.field-name-field-art-files div.field-item a')->each(function($theIndex, $theElement) {
	global $aFiles;
	$aFiles[] = array('name' => $theElement->textContent, 'url' => $theElement->getAttribute('href'));
});

$aTitleId 			= str_replace(array(' ', '.', '/', '\\', '[', ']', '(', ')', ':', ';', ','), '-', $aTitle);
$aChannelFolder 	= CODEBOT_ASSET_FINDER_MIRROR_FOLDER . $aChannel . DIRECTORY_SEPARATOR;
$aAssetFolder		= $aTitleId . DIRECTORY_SEPARATOR;
$aPreviewFolder		= $aAssetFolder . 'preview' . DIRECTORY_SEPARATOR;

if(file_exists($aChannelFolder . $aAssetFolder) && !$aForce) {
	echo 'Asset "'.$aTitleId.'" already exists in the local cache: "'.$aChannelFolder . $aAssetFolder.'". Use -f to force a download anyway.' . "\n";
	exit(5);
}

echo 'Creating folders to house downloads.' . "\n";

@mkdir($aChannelFolder . $aAssetFolder, 0755, true);
@mkdir($aChannelFolder . $aPreviewFolder, 0755, true);

echo 'Downloading previews:' . "\n";

// Download asset preview images to local mirror
foreach($aPreviews as $aIndex => $aPreview) {
	echo ' ' . $aPreview . "\n";
	$aInfo 	 = parse_url($aPreview);
	$aNewUrl = $aPreviewFolder . basename($aInfo['path']);

	file_put_contents($aChannelFolder . $aNewUrl, Utils::downloadFile($aPreview));
	$aPreviews[$aIndex] = $aChannel . '/' . str_replace('\\', '/', $aNewUrl);
}

echo 'Downloading assets:' . "\n";

// Download asset files to local mirror
foreach($aFiles as $aIndex => $aFile) {
	echo ' ' . $aFile['url'] . "\n";
	$aInfo 	 = parse_url($aFile['url']);
	$aNewUrl = $aAssetFolder . basename($aInfo['path']);

	file_put_contents($aChannelFolder . $aNewUrl, Utils::downloadFile($aFile['url']));
	$aFiles[$aIndex]['url'] = $aChannel . '/' . str_replace('\\', '/', $aNewUrl);
}

echo 'Creating DB entries.' . "\n";

// TODO: check for duplicates before inserting anything.
$aQuery = Database::instance()->prepare("INSERT INTO assets (title, author, url, channel, license, thumbnail, preview, files, description, attribution) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$aQuery->execute(array($aTitle, $aAuthor, $aURL, $aChannel, 1, $aPreviews[0], serialize($aPreviews), serialize($aFiles), $aDescription, 'Atrribution: '));

echo 'Finished successfully!' . "\n";
exit(0);

?>
