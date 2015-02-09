<?php
/**
 * Opauth example
 *
 * This is an example on how to instantiate Opauth
 * For this example, Opauth config is loaded from a separate file: opauth.conf.php
 *
 */

require_once dirname(__FILE__).'/../globals.php';

// Define paths
define('CONF_FILE', dirname(__FILE__).'/'.'config.opauth.php');
define('OPAUTH_LIB_DIR', dirname(__FILE__).'/inc/lib/Opauth/');

// Load config
if (!file_exists(CONF_FILE)) {
	trigger_error('Config file missing at '.CONF_FILE, E_USER_ERROR);
	exit();
}
require CONF_FILE;

$aHaveParams = strpos($_SERVER['REQUEST_URI'], 'index.php/') !== false;

if($aHaveParams) {
	// Instantiate Opauth with the loaded config
	require OPAUTH_LIB_DIR.'Opauth.php';
	$aOpauth = new Opauth( $config );

} else {
	echo 'Login screen';
}
