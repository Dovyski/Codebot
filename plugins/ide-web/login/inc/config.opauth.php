<?php
/**
 * Opauth basic configuration file to quickly get you started
 * ==========================================================
 * To use: rename to opauth.conf.php and tweak as you like
 * If you require advanced configuration options, refer to opauth.conf.php.advanced
 */

$config = array(
/**
 * Path where Opauth is accessed.
 *  - Begins and ends with /
 *  - eg. if Opauth is reached via http://example.org/auth/, path is '/auth/'
 *  - if Opauth is reached via http://auth.example.org/, path is '/'
 */
	'path' => CODEBOT_OAUTH_PATH,

/**
 * Callback URL: redirected to after authentication, successful or otherwise
 */
	'callback_url' => CODEBOT_OAUTH_CALLBACK_PATH,

/**
 * A random string used for signing of $auth response.
 */
	'security_salt' => CODEBOT_OAUTH_SECURITY_SALT,

/**
 * Strategy
 * Refer to individual strategy's documentation on configuration requirements.
 *
 * eg.
 * 'Strategy' => array(
 *
 *   'Facebook' => array(
 *      'app_id' => 'APP ID',
 *      'app_secret' => 'APP_SECRET'
 *    ),
 *
 * )
 *
 */
	'Strategy' => array(
		// Define strategies and their respective configs here
		'GitHub' => array(
			'client_id' => CODEBOT_GITHUB_APP_ID,
			'client_secret' => CODEBOT_GITHUB_APP_SECRET
		)
	),
);
