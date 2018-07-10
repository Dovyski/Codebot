<?php
/**
 * Callback for Opauth
 *
 * This file (callback.php) provides an example on how to properly receive auth response of Opauth.
 *
 * Basic steps:
 * 1. Fetch auth response based on callback transport parameter in config.
 * 2. Validate auth response
 * 3. Once auth response is validated, your PHP app should then work on the auth response
 *    (eg. registers or logs user in to your site, save auth data onto database, etc.)
 *
 */

// Include all internal stuff.
include_once dirname(__FILE__).'/inc/globals.php';

$aLocation = './?error=';

// Instantiate Opauth with the loaded config but not run automatically
$aOpauth = new Opauth($gOpAuthConfig, false);

// Fetch auth response, based on transport configuration for callback
$aResponse = null;

switch($aOpauth->env['callback_transport']) {
	case 'session':
		$aResponse = $_SESSION['opauth'];
		unset($_SESSION['opauth']);
		break;
	case 'post':
		$aResponse = unserialize(base64_decode( $_POST['opauth'] ));
		break;
	case 'get':
		$aResponse = unserialize(base64_decode( $_GET['opauth'] ));
		break;
	default:
		$aLocation .= 'Unsupported callback_transport.';
		break;
}

// Check if it's an error callback
if ($aResponse == null || array_key_exists('error', $aResponse)) {
	$aLocation .= 'Error in oAuth response.';

} else {
	// Auth response validation
	// To validate that the auth response received is unaltered, especially auth response that
	// is sent through GET or POST.

	if (empty($aResponse['auth']) || empty($aResponse['timestamp']) || empty($aResponse['signature']) || empty($aResponse['auth']['provider']) || empty($aResponse['auth']['uid'])) {
		$aLocation .= 'Missing key auth response components.';

	} elseif (!$aOpauth->validate(sha1(print_r($aResponse['auth'], true)), $aResponse['timestamp'], $aResponse['signature'], $aReason)) {
		$aLocation .= $aReason;

	} else {
		// It's all good. Let's get the local account for that
		// oauth info (or create a new one, if it doesnt exist.)
		$aUserId = Codebot\User::getOrCreateByOAuthInfo($aResponse['auth']);

		if($aUserId != null) {
			Codebot\Auth::authenticate($aUserId);

			$aUser 		= Codebot\User::getById($aUserId);
			$aLocation 	= sprintf(CODEBOT_OAUTH_URL_AFTER_LOGIN, $aUser->disk);
		}
	}
}

header('Location: ' . $aLocation);
exit();
