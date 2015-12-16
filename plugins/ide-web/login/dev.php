<?php
/**
 * This is fake login backend that allows developers to easily
 * setup a local working version of Codebot.
 *
 */

// Include all internal stuff.
include_once dirname(__FILE__).'/inc/globals.php';

// If we are not running in DEV_MODE, quit immediately.
if(!defined('CODEBOT_DEV_MODE') || CODEBOT_DEV_MODE == false) {
	echo 'You must set CODEBOT_DEV_MODE to true in order to use this local authentication.';
	exit();
}

// Fake some auth response
$aResponse = array(
	'provider' 	=> 'localhost-dev-provider',
	'uid' 		=> 'localhost-dev-uid',
	'info' 		=> array('email' => 'user@localhost')
);

$aLocation = '/';

// It's all good. Let's get the local account for that
// oauth info (or create a new one, if it doesnt exist.)
$aUserId = User::getOrCreateByOAuthInfo($aResponse);

if($aUserId != null) {
	Auth::authenticate($aUserId);

	$aUser 		= User::getById($aUserId);
	$aLocation 	= './../../../?disk=' . $aUser->disk;

} else {
	echo 'Something went wrong with the local authentication.';
}

header('Location: ' . $aLocation);
exit();
