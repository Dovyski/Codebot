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


/**
 * Define paths
 */
define('CONF_FILE', dirname(__FILE__).'/'.'opauth.conf.php');
define('OPAUTH_LIB_DIR', dirname(__FILE__).'/inc/lib/Opauth/');

/**
* Load config
*/
if (!file_exists(CONF_FILE)) {
	trigger_error('Config file missing at '.CONF_FILE, E_USER_ERROR);
	exit();
}
require CONF_FILE;

/**
 * Instantiate Opauth with the loaded config but not run automatically
 */
require OPAUTH_LIB_DIR.'Opauth.php';
$aOpauth = new Opauth( $config, false );


/**
* Fetch auth response, based on transport configuration for callback
*/
$aResponse = null;

switch($aOpauth->env['callback_transport']) {
	case 'session':
		session_start();
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
		echo '<strong style="color: red;">Error: </strong>Unsupported callback_transport.'."<br>\n";
		break;
}

/**
 * Check if it's an error callback
 */
if (array_key_exists('error', $aResponse)) {
	echo '<strong style="color: red;">Authentication error: </strong> Opauth returns error auth response.'."<br>\n";
}

/**
 * Auth response validation
 *
 * To validate that the auth response received is unaltered, especially auth response that
 * is sent through GET or POST.
 */
else{
	if (empty($aResponse['auth']) || empty($aResponse['timestamp']) || empty($aResponse['signature']) || empty($aResponse['auth']['provider']) || empty($aResponse['auth']['uid'])) {
		echo '<strong style="color: red;">Invalid auth response: </strong>Missing key auth response components.'."<br>\n";
	} elseif (!$aOpauth->validate(sha1(print_r($aResponse['auth'], true)), $aResponse['timestamp'], $aResponse['signature'], $reason)) {
		echo '<strong style="color: red;">Invalid auth response: </strong>'.$reason.".<br>\n";
	} else {
		echo '<strong style="color: green;">OK: </strong>Auth response is validated.'."<br>\n";

		/**
		 * It's all good. Go ahead with your application-specific authentication logic
		 */
	}
}


/**
* Auth response dump
*/
echo "<pre>";
print_r($aResponse);
echo "</pre>";
