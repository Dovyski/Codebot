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
	echo '<html>';
	echo '<head>';
		echo '<meta charset="utf-8">';
		echo '<title>Codebot - gamedev IDE on the cloud</title>';
		echo '<link rel="stylesheet" type="text/css" href="css/zocial.css" />';
		echo '
			<style type="text/css">
				body {
					background: #2D2D2D;
					color: #efefef;
					font-family: Arial;
				}
				.panel {
					width: 300px;
					padding: 10px;
					margin: 70px auto;
					text-align: center;
				}

				.panel img {
					width: 169px;
					height: 169px;
				}

				h2 {
					margin: 2px 0 -10px 0;
				}

				.panel a {
					margin-top: 50px;
				}

				footer a:active,
				footer a:hover,
				footer a:visited,
				footer a:link,
				footer {
					color: #5d5d5d;
				}

				footer {
					width: 98%;
					position: absolute;
					bottom: 10px;
					font-size: 0.8em;
					text-align: center;
				}
			</style>';
	echo '</head>';

	echo '<body>';
		echo '<a href="https://github.com/Dovyski/Codebot" target="_blank"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/52760788cde945287fbb584134c4cbc2bc36f904/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f77686974655f6666666666662e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_white_ffffff.png"></a>';
		echo '<div class="panel">';
			echo '<img src="img/codebot-logo.png" title="Codebot"/>';
			echo '<h2>Codebot</h2>';
			echo '<p>Gamedev IDE on the cloud</p>';
			echo '<a href="./index.php/github" class="zocial github">Login with Github</a>';
		echo '</div>';
		echo '<footer>Developed by <a href="http://twitter.com/As3GameGears" target="_blank">@As3GameGears</a><br />Icon made by <a href="http://www.simpleicon.com" title="SimpleIcon">SimpleIcon</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed under <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a></footer>';
	echo '</body>';
	echo '</html>';
}
