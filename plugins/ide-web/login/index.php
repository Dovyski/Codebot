<?php
/**
 * Authenticate the user using a local approach or oAuth, e.g. Github.
 */

// Include all internal files
include_once dirname(__FILE__).'/inc/globals.php';

// Check if opAuth should be invoked.
$aHaveParams = strpos($_SERVER['REQUEST_URI'], 'index.php/') !== false;

if($aHaveParams) {
	// Instantiate Opauth with the loaded config
	$aOpauth = new Opauth( $config );

} else {
	echo '<html>';
	echo '<head>';
		echo '<meta charset="utf-8">';
		echo '<title>Codebot - gamedev IDE on the cloud</title>';
		echo '<link rel="stylesheet" type="text/css" href="./css/zocial.css" />';
		echo '<link rel="stylesheet" type="text/css" href="./css/style.css" />';
	echo '</head>';

	echo '<body>';
		echo '<a href="https://github.com/Dovyski/Codebot" target="_blank"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/52760788cde945287fbb584134c4cbc2bc36f904/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f77686974655f6666666666662e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_white_ffffff.png"></a>';

		echo '<div class="content">';
			echo '<div class="login-panel">';
				if(isset($_GET['error'])) {
					echo '<div class="error">' . htmlspecialchars($_GET['error']) . '</div>';
				}

				echo '<div class="form">';
					echo '<img src="img/codebot-logo.png" title="Codebot"/>';

					echo '<form class="register-form">';
						echo '<input type="text" placeholder="name"/>';
						echo '<input type="password" placeholder="password"/>';
						echo '<input type="text" placeholder="email address"/>';
						echo '<button>create</button>';
						echo '<p class="message">Already registered? <a href="#">Sign In</a></p>';
					echo '</form>';

					echo '<form class="login-form" action="index.php" method="post">';
						echo '<input type="text" name="email" placeholder="Email"/>';
						echo '<input type="password" name="password" placeholder="Password"/>';
						echo '<button>login</button>';
						echo '<p class="message">Not registered? <a href="#">Create an account</a></p>';
					echo '</form>';

					echo '<a href="./index.php/github" class="zocial github">Login with Github</a>';
				echo '</div>';
			echo '</div>';
		echo '</div>';

		if(false) {
			echo '<div class="warning">Codebot is in <strong>closed alpha</strong>. In order to participate, you need an invite. If you want one, just ping <a href="https://twitter.com/As3GameGears" target="_blank">@As3GameGears</a> on twitter.</div>';
		}

		echo '<footer>Developed by <a href="http://twitter.com/As3GameGears" target="_blank">@As3GameGears</a><br />Icon made by <a href="http://www.simpleicon.com" title="SimpleIcon">SimpleIcon</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed under <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a></footer>';

	echo '</body>';
	echo '</html>';
}
