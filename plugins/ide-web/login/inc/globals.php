<?php

/**
 * Includes all required files to make the authentication work.
 */

// Include all configuration files
$aHasLocalConfig = @include_once dirname(__FILE__).'/../../config.local.php';
include_once dirname(__FILE__).'/../../config.php';

if(!$aHasLocalConfig) {
	// It look like Codebot has not been installed yet. Let's redirect to
	// the installation page.
	header('Location: ../install/');
	exit();
}

// Include system stuff
require_once dirname(__FILE__).'/../../api/inc/Auth.class.php';
require_once dirname(__FILE__).'/../../api/inc/Disk.class.php';
require_once dirname(__FILE__).'/../../api/inc/Database.class.php';
require_once dirname(__FILE__).'/../../api/inc/User.class.php';
require_once dirname(__FILE__).'/../../api/inc/Utils.class.php';
require_once dirname(__FILE__).'/../../app/inc/App.class.php';

// Initialize stuff
Codebot\Auth::init();
Codebot\Database::init();
Codebot\App::init();

// Initialize all OpAuth stuff
$aConfigFile 	= dirname(__FILE__).'/config.opauth.php';
$aOpAuthLibDir  = dirname(__FILE__).'/lib/Opauth/';

if (!file_exists($aConfigFile)) {
	trigger_error('OpAuth config file missing at '.$aConfigFile, E_USER_ERROR);
	exit();
}
require $aConfigFile;
require $aOpAuthLibDir.'Opauth.php';

?>
