<?php

// System configuration
@define('CODEBOT_DEBUG_MODE',                   true);
@define('CODEBOT_DEV_MODE',                   	false); // ***WARNING*** If this directive is true in production, your server/users might be at risk!
@define('CODEBOT_LOG_ENABLED',                  true);
@define('CODEBOT_LOG_FILE',                     '/home/user/logs/app.log');

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
@define('CODEBOT_FLASH_PUBLIC_TESTING_URL',      '/testing/');
@define('CODEBOT_FLASH_TESTING_POOL',            '/var/www/testing/');
@define('CODEBOT_FLASH_OUTPUT_REPIPE',           '2>&1');
@define('CODEBOT_FLASH_FLEX_SDK',                'C:/Users/Dovyski/AppData/Local/FlashDevelop/Apps/flexairsdk/4.6.0+15.0.0/bin/');

// Javascript
@define('CODEBOT_JAVASCRIPT_PUBLIC_TESTING_URL', '/testing/');
@define('CODEBOT_JAVASCRIPT_TESTING_POOL',       '/var/www/html/testing/');

// Assets finder
@define('CODEBOT_ASSET_FINDER_MIRROR_FOLDER',	 '/var/www/assets/');
@define('CODEBOT_ASSET_FINDER_MIRROR_URL',	 	 'http://cdn.domain.com/assets/');

?>
