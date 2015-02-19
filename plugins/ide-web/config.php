<?php

// Database info
@define('DB_DSN',           	'mysql:host=localhost;dbname=codebot');
@define('DB_USER',				'root');
@define('DB_PASSWORD',			'');

// Session info
@define('SID',					'codebotsid');

// OAuth stuff
@define('OAUTH_PATH',			'/plugins/ide-web/login/index.php/');
@define('OAUTH_CALLBACK_PATH',	'/plugins/ide-web/login/oauth_return.php');
@define('OAUTH_SECURITY_SALT',	'LDFmiilYf8Fyw5W10rx4W1KsVrieQCnpBzzpTBWA5vJidQKDx8pMJbmw28R1C4m');
@define('GITHUB_APP_ID',		'');
@define('GITHUB_APP_SECRET',	'');

// Project templates
@define('PROJECT_TEMPLATES_FOLDER',		'/home/user/templates/');

?>
