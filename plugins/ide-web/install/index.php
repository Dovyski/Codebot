<?php
/**
 * This page will install Codebot and help you
 * configure it to your needs.
 */

// Include all configuration files
@include_once dirname(__FILE__).'/../api/config.local.php';
include_once dirname(__FILE__).'/../api/config.php';

echo '<html>';
echo '<head>';
	echo '<meta charset="utf-8">';
	echo '<title>Codebot - Installation</title>';
	echo '<link href="../site/css/bootstrap.min.css" rel="stylesheet">';
	echo '<link href="./css/style.css" rel="stylesheet">';
echo '</head>';

echo '<body>';
	echo '<header>';
		echo '<img src="../site/img/codebot-logo.png" title="Codebot"/>';
		echo '<h2>Installation</h2>';
	echo '</header>';

	echo '<div class="panel">';
		echo '<h2>Progress</h2>';
		echo '<ul>';
			echo '<li>Hey</li>';
			echo '<li>ss</li>';
		echo '</ul>';
	echo '</div>';

	echo '<div class="panel">';
		echo '<h2>Database</h2>';
		echo '
		<form>
		  <div class="form-group">
		    <label for="exampleInputEmail1">Email address</label>
		    <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Email">
		  </div>
		  <div class="form-group">
		    <label for="exampleInputPassword1">Password</label>
		    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
		  </div>
		</form>
		';
	echo '</div>';
	echo '<div class="warning">Codebot is in <strong>closed alpha</strong>. In order to participate, you need an invite. If you want one, just ping <a href="https://twitter.com/As3GameGears" target="_blank">@As3GameGears</a> on twitter.</div>';

	echo '<footer>Developed by <a href="http://twitter.com/As3GameGears" target="_blank">@As3GameGears</a><br />Icon made by <a href="http://www.simpleicon.com" title="SimpleIcon">SimpleIcon</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed under <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a></footer>';
echo '</body>';
echo '</html>';
