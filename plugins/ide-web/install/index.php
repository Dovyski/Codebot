<?php
/**
 * This page will install Codebot and help you
 * configure it to your needs.
 */

// Include the bare minimum to make the instalation process
 require_once dirname(__FILE__).'/../api/inc/Auth.class.php';
 require_once dirname(__FILE__).'/../api/inc/Database.class.php';

// Include all configuration files
@include_once dirname(__FILE__).'/../api/config.local.php';
include_once dirname(__FILE__).'/../api/config.php';

// The instalation steps
$aSteps = array();
$aSteps[0] = array('name' => 'Preparation');
$aSteps[1] = array('name' => 'Database');
$aSteps[2] = array('name' => 'Configuration');
$aSteps[3] = array('name' => 'Have a cake!');

// Get the current step
$aStep 	= isset($_REQUEST['step']) ? (int)$_REQUEST['step'] : 0;
$aError = '';

// Init the session
Auth::init();

if($aStep == 0) {
	// TODO: check dependencies, writable dirs, files, etc.
}

if($aStep == 1 && isset($_REQUEST['check_db'])) {
	$aName = isset($_REQUEST['name']) ? $_REQUEST['name'] : '';

	$aConfig = array(
		'host' => isset($_REQUEST['host']) ? $_REQUEST['host'] : '',
		'user' => isset($_REQUEST['user']) ? $_REQUEST['user'] : '',
		'password' => isset($_REQUEST['password']) ? $_REQUEST['password'] : ''
	);

	try {
		Database::connect($aConfig);

		// Prepare the database name
		$aName = str_replace(array('"', "'"), '', $aName);

		// Create the database
		Database::instance()->query('CREATE DATABASE IF NOT EXISTS ' . $aName);

		// Use this database from now one
		Database::instance()->query('USE ' . $aName);

		// Create Codebot tables
		$aFile = file(dirname(__FILE__) . '/../api/inc/resources/structure.sql');

		if($aFile !== false) {
			Database::runSqlFileContent($aFile);
			$aStep++;

		} else {
			$aError = 'Unable to read structure.sql';
		}

	} catch(PDOException $e) {
		$aError = $e->getMessage();
	}
}

if($aStep == 2 && isset($_REQUEST['write_config'])) {

}

// Render the whole thing up
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
		echo '<ol>';
			foreach($aSteps as $aNumber => $aInfo) {
				echo '<li><strong>' . ($aNumber + 1) . '</strong> '. $aInfo['name'] .'</li>';
			}
		echo '</ol>';
	echo '</div>';

	if(!empty($aError)) {
		echo '<div class="warning"><strong>Something went wrong:</strong><br />'. $aError .'</div>';
	}

	echo '<div class="panel">';
		// TODO: get rid of this switch by fetching content from a dynamic dictionry or something
		switch($aStep) {
			case 2:
				echo '<h2>'.$aSteps[$aStep]['name'].'</h2>';
				echo '<form action="'.basename($_SERVER['PHP_SELF']).'?step='.$aStep.'" method="post">';
					echo '<div class="form-group">';
						echo '<label for="inputUser">DB User</label>';
						echo '<input type="input" class="form-control" name="user" id="inputUser" placeholder="E.g. codebot">';
					echo '</div>';

					echo '<input type="hidden" name="write_config" value="1">';
					echo '<button type="submit" class="btn btn-info">Next</button>';
				echo '</form>';
			break;

			case 1:
				echo '<h2>'.$aSteps[$aStep]['name'].'</h2>';
				echo '<form action="'.basename($_SERVER['PHP_SELF']).'?step='.$aStep.'" method="post">';
					echo '<div class="form-group">';
						echo '<label for="inputUser">DB User</label>';
						echo '<input type="input" class="form-control" name="user" id="inputUser" placeholder="E.g. codebot">';
					echo '</div>';
					echo '<div class="form-group">';
						echo '<label for="inputPassword">DB Password</label>';
						echo '<input type="password" class="form-control" name="password" id="inputPassword" placeholder="Password">';
					echo '</div>';
					echo '<div class="form-group">';
						echo '<label for="inputName">DB name</label>';
						echo '<input type="text" class="form-control" name="name" id="inputName" placeholder="E.g. codebot_db">';
					echo '</div>';
					echo '<div class="form-group">';
						echo '<label for="inputHost">DB host</label>';
						echo '<input type="text" class="form-control" name="host" id="inputHost" placeholder="E.g. localhost">';
					echo '</div>';

					echo '<input type="hidden" name="check_db" value="1">';
					echo '<button type="submit" class="btn btn-info">Next</button>';
				echo '</form>';
			break;

			case 0:
			default:
				echo '<h2>'.$aSteps[$aStep]['name'].'</h2>';
				echo '<form action="'.basename($_SERVER['PHP_SELF']).'?step='.($aStep + 1).'" method="post">';
					echo '<div class="form-group">';
						echo 'TODO: display preparation data.';
					echo '</div>';
					echo '<button type="submit" class="btn btn-info">Next</button>';
				echo '</form>';
			break;
		}
	echo '</div>';

	echo '<footer>Developed by <a href="http://twitter.com/As3GameGears" target="_blank">@As3GameGears</a><br />Icon made by <a href="http://www.simpleicon.com" title="SimpleIcon">SimpleIcon</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed under <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a></footer>';
echo '</body>';
echo '</html>';
