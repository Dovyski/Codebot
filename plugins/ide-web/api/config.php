<?php

// System configuration
@define('CODEBOT_DEBUG_MODE',                   true);

// Database info
@define('CODEBOT_DB_DSN',                       'mysql:host=localhost;dbname=codebot');
@define('CODEBOT_DB_USER',                      'root');
@define('CODEBOT_DB_PASSWORD',                  '');

// Session info
@define('CODEBOT_SID',                          'codebotsid');

// OAuth stuff
@define('CODEBOT_OAUTH_PATH',                   '/plugins/ide-web/login/index.php/');
@define('CODEBOT_OAUTH_CALLBACK_PATH',          '/plugins/ide-web/login/oauth_return.php');
@define('CODEBOT_OAUTH_SECURITY_SALT',          'LDFmiilYf8Fyw5W10rx4W1KsVrieQCnpBzzpTBWA5vJidQKDx8pMJbmw28R1C4m');
@define('CODEBOT_GITHUB_APP_ID',                '');
@define('CODEBOT_GITHUB_APP_SECRET',            '');

// Project templates
@define('CODEBOT_PROJECT_TEMPLATES_FOLDER',		'/home/user/templates/');

// Disk
@define('CODEBOT_DISK_WORK_POOL',               '/tmp/');

// Flash
@define('CODEBOT_PUBLIC_TESTING_URL',           '/testing/');
@define('CODEBOT_TESTING_POOL',                 '/var/www/testing/');
@define('CODEBOT_OUTPUT_REPIPE',                '2>&1');
@define('CODEBOT_FLEX_SDK',                     'C:/Users/Dovyski/AppData/Local/FlashDevelop/Apps/flexairsdk/4.6.0+15.0.0/bin/');

?>
