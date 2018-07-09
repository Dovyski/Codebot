<?php

// Internals
@define('CODEBOT_DEBUG_MODE',                   1); // If Codebot should run in debug mode, i.e. show SQL queries and file paths when an error occours.
@define('CODEBOT_DEV_MODE',                   	0); // If Codebot should run in development mode. When in dev mode, local authentication without username or password is allowed. <em>WARNING: if this directive is true in production, your server/users might be at risk!</em>
@define('CODEBOT_DEV_SIMULATE_SLOW',            0); // Set it to 1 to force frontend calls to wait before responding (simulation of a slow connection).
@define('CODEBOT_DEV_SLOW_AMOUNT',            	2); // Time, in seconds, to wait before responding frontend calls. It's only effective if both <code>CODEBOT_DEV_MODE</code> and <code>CODEBOT_DEV_SIMULATE_SLOW</code> are true.
@define('CODEBOT_LOG_ENABLED',                  1); // If internal Codebot calls, e.g. copy project files for online testing, should be logged or not.
@define('CODEBOT_LOG_FILE',                     '/home/user/logs/app.log'); // Path to file where log messages will be appended to.

// Database
@define('CODEBOT_DB_DSN',                       'mysql:host=localhost;dbname=codebot');
@define('CODEBOT_DB_USER',                      'root');
@define('CODEBOT_DB_PASSWORD',                  '');

// Session
@define('CODEBOT_SID',                          'codebotsid'); // Name of the session cookie to be used for authentication.

// OAuth authentication
@define('CODEBOT_OAUTH_PATH',                   '/plugins/ide-web/login/index.php/'); // URL where oAuth requests starts.
@define('CODEBOT_OAUTH_CALLBACK_PATH',          '/plugins/ide-web/login/oauth_return.php'); // URL that handles oAuth responses from the authentication server.
@define('CODEBOT_OAUTH_SECURITY_SALT',          'LDFmiilYf8Fyw5W10rx4W1KsVrieQCnpBzzpTBWA5vJidQKDx8pMJbmw28R1C4m'); // Salt used in oAuth operations.
@define('CODEBOT_GITHUB_APP_ID',                ''); // If Github is being used as an oAuth authentication, this is the APP_ID Codebot will use to make login attempts.
@define('CODEBOT_GITHUB_APP_SECRET',            ''); // If Github is being used as an oAuth authentication, this is the APP_SECRET required by Github.

// Project templates
@define('CODEBOT_PROJECT_TEMPLATES_FOLDER',		'/home/user/templates/'); // Path to a folder containing project templates.

// Disk
@define('CODEBOT_DISK_WORK_POOL',               '/tmp/'); // Path to a folder that will be used to store user data, e.g. projects and files. It is highly recommended that this folder is not visible from the web, i.e. not within the DocumentRoot of your webserver.

// Flash
@define('CODEBOT_FLASH_API_ENPOINT',      		 'flash');
@define('CODEBOT_FLASH_API_CLASS_FILE',      	 '/plugins/flash-tools/backend/FlashTools.class.php');
@define('CODEBOT_FLASH_API_CLASS_NAME',      	 'FlashTools');
//@define('CODEBOT_FLASH_PROJECT_FACTORY',    	 '{"type": "flash", "name": "Flash/AS3", "templates": {"flash-empty": {"name": "Empty", "icon": "test.png"}}}');
@define('CODEBOT_FLASH_PUBLIC_TESTING_URL',      '/testing/');
@define('CODEBOT_FLASH_TESTING_POOL',            '/var/www/testing/');
@define('CODEBOT_FLASH_OUTPUT_REPIPE',           '2>&1');
@define('CODEBOT_FLASH_FLEX_SDK',                'C:/Users/Dovyski/AppData/Local/FlashDevelop/Apps/flexairsdk/4.6.0+15.0.0/bin/');

// Javascript
@define('CODEBOT_JAVASCRIPT_API_ENPOINT',      	 'javascript');
@define('CODEBOT_JAVASCRIPT_API_CLASS_FILE',     '/plugins/javascript-tools/backend/JavascriptTools.class.php');
@define('CODEBOT_JAVASCRIPT_API_CLASS_NAME',     'JavascriptTools');
@define('CODEBOT_JAVASCRIPT_PROJECT_FACTORY',    '{"type": "js", "name": "HTML5/Javascript", "icon": "plugins/javascript-tools/img/js-empty.png", "templates": {"js-empty": {"name": "Empty", "icon": "plugins/javascript-tools/img/js-empty.png"}}}');
@define('CODEBOT_JAVASCRIPT_PUBLIC_TESTING_URL', '/testing/');
@define('CODEBOT_JAVASCRIPT_TESTING_POOL',       '/var/www/html/testing/');

// Assets finder
@define('CODEBOT_ASSET_FINDER_API_ENPOINT',      'assets');
@define('CODEBOT_ASSET_FINDER_API_CLASS_FILE',   '/plugins/asset-finder/backend/AssetFinder.class.php');
@define('CODEBOT_ASSET_FINDER_API_CLASS_NAME',   'AssetFinder');
@define('CODEBOT_ASSET_FINDER_MIRROR_FOLDER',	 '/var/www/assets/');
@define('CODEBOT_ASSET_FINDER_MIRROR_URL',	 	 'http://cdn.domain.com/assets/');

?>
