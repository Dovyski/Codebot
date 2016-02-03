<?php

/**
 * Includes all required files to make the authentication work.
 */

// Include all configuration files
@include_once dirname(__FILE__).'/../../config.local.php';
include_once dirname(__FILE__).'/../../config.php';

// Include system stuff
require_once dirname(__FILE__).'/../../api/inc/Auth.class.php';
require_once dirname(__FILE__).'/../../api/inc/Disk.class.php';
require_once dirname(__FILE__).'/../../api/inc/Database.class.php';
require_once dirname(__FILE__).'/../../api/inc/User.class.php';
require_once dirname(__FILE__).'/../../api/inc/Utils.class.php';

// Initialize stuff
Codebot\Auth::init();
Codebot\Database::init();

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
