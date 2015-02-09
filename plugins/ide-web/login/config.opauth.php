<?php
/**
 * Opauth basic configuration file to quickly get you started
 * ==========================================================
 * To use: rename to opauth.conf.php and tweak as you like
 * If you require advanced configuration options, refer to opauth.conf.php.advanced
 */

@include_once dirname(__FILE__).'/../config.local.php';
include_once dirname(__FILE__).'/../config.php';

$config = array(
/**
 * Path where Opauth is accessed.
 *  - Begins and ends with /
 *  - eg. if Opauth is reached via http://example.org/auth/, path is '/auth/'
 *  - if Opauth is reached via http://auth.example.org/, path is '/'
 */
	'path' => OAUTH_PATH,

/**
 * Callback URL: redirected to after authentication, successful or otherwise
 */
	'callback_url' => OAUTH_CALLBACK_PATH,

/**
 * A random string used for signing of $auth response.
 */
	'security_salt' => OAUTH_SECURITY_SALT,

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
			'client_id' => GITHUB_APP_ID,
			'client_secret' => GITHUB_APP_SECRET
		)
	),
);
