<?php
/**
 * Authenticate the user using a local approach or oAuth, e.g. Github.
 */

// Include all internal files
include_once dirname(__FILE__).'/inc/globals.php';

$aAction = isset($_REQUEST['action']) ? $_REQUEST['action'] : '';

// By default, perform no redirect.
$aLocation = '';

// Check for oAuth stuff
$aIsOAouth = strpos($_SERVER['REQUEST_URI'], 'index.php/') !== false;
if($aIsOAouth) {
	$aAction = 'oauth';
}

// If the user is already authenticated, we proceed differently
if(Codebot\Auth::isUserAuthenticated()) {
	$aAction = 'relogin';
}

if($aAction == 'oauth') {
	// Instantiate Opauth with the loaded config
	$aOpauth = new Opauth($gOpAuthConfig);

} else if ($aAction == 'login' || $aAction == 'relogin') {
	$aIsDevLogin = isset($_REQUEST['dev']);
	$aIsRunningInDevMode = defined('CODEBOT_DEV_MODE') && CODEBOT_DEV_MODE;

	if($aIsDevLogin) {
		if(!$aIsRunningInDevMode) {
			echo 'You must set CODEBOT_DEV_MODE to true in order to use this local authentication.';
			exit();
		}

		// Fake some auth response
		$aResponse = array(
			'provider' 	=> 'localhost-dev-provider',
			'uid' 		=> 'localhost-dev-uid',
			'info' 		=> array('email' => 'user@localhost')
		);

		$aUserId = Codebot\User::getOrCreateByOAuthInfo($aResponse);

	} else {
		if(Codebot\Auth::isUserAuthenticated()) {
			// Authenticated already. Just get info from session.
			$aUserId = Codebot\Auth::getAuthenticatedUserId();
		} else {
			// TODO: Get local user id based on credentials
			$aUserId = null;
		}
	}

	if($aUserId != null) {
		Codebot\Auth::authenticate($aUserId);
		$aUser 		= Codebot\User::getById($aUserId);
		$aLocation 	= sprintf(CODEBOT_URL_AFTER_LOGIN, $aUser->disk);

	} else {
		$_GET['error'] = 'Something went wrong with the local authentication.';
	}
}

// Were we told to redirect?
if(!empty($aLocation)) {
	header('Location: ' . $aLocation);
	exit();
}

echo '<html>';
echo '<head>';
	echo '<meta charset="utf-8">';
	echo '<title>Codebot - gamedev IDE on the cloud</title>';
	echo '<link rel="stylesheet" type="text/css" href="./css/zocial.css" />';
	echo '<link rel="stylesheet" type="text/css" href="./css/style.css" />';
echo '</head>';

echo '<body>';
	// Github corner (so called "Fork me on Github").
	echo '<a href="https://your-url" class="github-corner" aria-label="View source on Github" title="View source on Github"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#fff; color:#151513; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>';

	echo '<div class="content">';
		echo '<div class="login-panel">';
			if(isset($_GET['error'])) {
				echo '<div class="error">' . htmlspecialchars($_GET['error']) . '</div>';
			}

			echo '<div class="form">';
				echo '<img src="img/codebot-logo.png" title="Codebot"/>';

				echo '<form id="formRegister" class="register-form">';
					echo '<input type="hidden" name="action" value="register" />';
					echo '<input type="text" placeholder="name"/>';
					echo '<input type="password" placeholder="password"/>';
					echo '<input type="text" placeholder="email address"/>';
					echo '<button>create</button>';
					echo '<p class="message">Already registered? <a href="#">Sign In</a></p>';
				echo '</form>';

				echo '<form id="formLogin" class="login-form" action="index.php" method="post">';
					echo '<input type="hidden" name="action" value="login" />';
					echo '<input type="text" name="email" placeholder="Email"/>';
					echo '<input type="password" name="password" placeholder="Password"/>';
					echo '<button>login</button>';
					echo '<p class="message">Not registered? <a href="javascript:void(0)" onclick="alert(\'Sorry, registration by e-mail/password is not working at the moment. Please sign-in using Github.\')">Create an account</a>.</p>';
				echo '</form>';

				echo '<h4>or</h4>';
				echo '<a href="./index.php/github" class="zocial github" title="Click here to login using your Github information.">Sign-in using Github</a>';

				if(defined('CODEBOT_DEV_MODE') && CODEBOT_DEV_MODE) {
					echo '<a href="./index.php?action=login&dev=1" class="zocial primary dev-btn" title="You are seeing this because CODEBOT_DEV_MODE is true. A dev login will create a local account and authenticate using that.">Dev sign-in</a>';
				}
			echo '</div>';
		echo '</div>';
	echo '</div>';

	if(false) {
		echo '<div class="warning">Codebot is in <strong>closed alpha</strong>. In order to participate, you need an invite. If you want one, just ping <a href="https://twitter.com/As3GameGears" target="_blank">@As3GameGears</a> on twitter.</div>';
	}

	echo '<footer>Developed by <a href="http://twitter.com/As3GameGears" target="_blank">@As3GameGears</a><br />Icon made by <a href="http://www.simpleicon.com" title="SimpleIcon">SimpleIcon</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed under <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a></footer>';

echo '</body>';
echo '</html>';
