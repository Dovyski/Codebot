<?php
/**
 * This page will install Codebot and help you
 * configure it to your needs.
 */

// Include the bare minimum to make the instalation process
 require_once dirname(__FILE__).'/../api/inc/Auth.class.php';
 require_once dirname(__FILE__).'/../api/inc/Database.class.php';

// Include all configuration files
$aLocalConfigPath = dirname(__FILE__).'/../config.local.php';
$aHasLocalConfig = @include_once $aLocalConfigPath;
$aInstallerConfigFile = dirname(__FILE__) . '/../config.local.new.php'; // TODO: write to the right file.
$aInstallerConfigDir = realpath(dirname($aInstallerConfigFile));

$aTestFolderExample = realpath($aInstallerConfigDir . '/../../../') . DIRECTORY_SEPARATOR . 'testing' . DIRECTORY_SEPARATOR;

include_once dirname(__FILE__).'/../config.php';

function printNavigation($theCurrentStep, $theSteps) {
    $theCurrentStep = (int)$theCurrentStep;
    $theCurrentStep = $theCurrentStep < 1 ? 1 : $theCurrentStep;
    $theCurrentStep = $theCurrentStep >= count($theSteps) + 1 ? count($theSteps) + 1 : $theCurrentStep;

    $thePreviousStep = $theCurrentStep - 1;
    $thePreviousStep = $thePreviousStep < 1 ? 1 : $thePreviousStep;

    echo '<div class="navigation">';
        if($theCurrentStep > 1 && $theCurrentStep != count($theSteps)) {
            echo '<a href="index.php?step='.$thePreviousStep.'" class="btn btn-danger back">Back</a>';
        }
        if($theCurrentStep < count($theSteps)) {
            echo '<button type="submit" class="btn btn-info next">Next</button>';
        }
        if($theCurrentStep == count($theSteps)) {
            echo '<a href="../login/" class="btn btn-success next">Proceed to login</a>';
        }
    echo '</div>';
}

if($aHasLocalConfig) {
    // It look like Codebot is already installed or is running
    // in production. In any case, we skip the installation.
    header('Location: ../login/');
    exit();
}

// The instalation steps
$aSteps = array();
$aSteps[0] = array('name' => 'Preparation');
$aSteps[1] = array('name' => 'Database');
$aSteps[2] = array('name' => 'Configuration');
$aSteps[3] = array('name' => 'Have cake');

// Available Codebot configuration constants (see api/config.php)
$aConfigConstants = array();

// Get the current step
$aStep 	= isset($_REQUEST['step']) ? (int)$_REQUEST['step'] : 1;
$aError = '';

// Init the session
Codebot\Auth::init();

if($aStep == 1) {
	// TODO: check dependencies, writable dirs, files, etc.
    $aConfigFolderWritable = false; //is_writable($aInstallerConfigDir);
}

if($aStep == 2 && isset($_REQUEST['check_db'])) {
	$aName = isset($_REQUEST['name']) ? $_REQUEST['name'] : '';

	$aConfig = array(
		'host' => isset($_REQUEST['host']) ? $_REQUEST['host'] : '',
		'user' => isset($_REQUEST['user']) ? $_REQUEST['user'] : '',
		'password' => isset($_REQUEST['password']) ? $_REQUEST['password'] : ''
	);

	try {
		Codebot\Database::connect($aConfig);

		// Prepare the database name
		$aName = str_replace(array('"', "'"), '', $aName);

		// Create the database
		Codebot\Database::instance()->query('CREATE DATABASE IF NOT EXISTS ' . $aName);

		// Use this database from now one
		Codebot\Database::instance()->query('USE ' . $aName);

        // TODO: check if tables already exists, otherwise create them
		// Create Codebot tables
		$aFile = file(dirname(__FILE__) . '/../api/resources/structure.sql');

		if($aFile !== false) {
			Codebot\Database::runSqlFileContent($aFile);
			$aStep++;

		} else {
			$aError = 'Unable to read structure.sql';
		}

	} catch(PDOException $e) {
		$aError = $e->getMessage();
	}
}

// If we are in configuration step, we need the configuration
// constants used by Codebot.
if($aStep == 3) {
    $aConstants = get_defined_constants(true);

    foreach($aConstants['user'] as $aName => $aValue) {
        // Is this a Codebot constant?
        if(strpos($aName, 'CODEBOT_') !== false) {
            // Yeah, it is
            $aConfigConstants[$aName] = $aValue;
        }
    }
}

// Is it time to write the config file?
if($aStep == 3 && isset($_REQUEST['write_config'])) {
    // Ugly hack to get expection when writing the config file
    // Link: http://stackoverflow.com/a/3406181/29827
    set_error_handler(
        create_function(
            '$severity, $message, $file, $line',
            'throw new ErrorException($message, $severity, $severity, $file, $line);'
        )
    );

    try {
        $aConfigContent = "<?php\n";

        foreach($aConfigConstants as $aName => $aValue) {
            // Is the user specified value different from the one in the config file?
            // TODO: add database info here
            if($_REQUEST[$aName] != constant($aName)) {
                // Yeah, it is. Let's write that constant to the local config file then
                $aConfigContent .= "define('".$aName."', '".$_REQUEST[$aName]."');\n";
            }
        }
        $aConfigContent .= "?>";

        file_put_contents($aInstallerConfigFile, $aConfigContent);

        // We are finished!
        header('Location: index.php?step=4');
        exit();

    } catch(Exception $e) {
        $aError = $e->getMessage();
    }

    // Undo ugly hack.
    restore_error_handler();
}

// Render the whole thing up
echo '<html>';
echo '<head>';
	echo '<meta charset="utf-8">';
	echo '<title>Codebot - Installation</title>';
	echo '<link href="../site/css/bootstrap.min.css" rel="stylesheet">';
    echo '<link href="../../../css/3rdparty/font-awesome/css/font-awesome.min.css" rel="stylesheet">';
	echo '<link href="./css/style.css" rel="stylesheet">';

echo '</head>';

echo '<body>';
	echo '<header>';
		echo '<img src="../site/img/codebot-logo.png" title="Codebot"/>';
        echo '<div class="headline">';
            echo '<i class="fa fa-wrench"></i>';
            echo '<h2>Installation</h2>';
            echo '<p>Follow the steps below to install Codebot.</p>';
        echo '<div>';
	echo '</header>';

	echo '<div class="panel steps">';
		echo '<ol>';
			foreach($aSteps as $aNumber => $aInfo) {
				echo '<li class="'.(($aNumber + 1) == $aStep ? 'active' : '').'"><strong>' . ($aNumber + 1) . '</strong> '. $aInfo['name'] .'</li>';
			}
		echo '</ol>';
	echo '</div>';

	if(!empty($aError)) {
		echo '<div class="warning"><strong><i class="fa fa-warning"></i> Oops!</strong><br />'. $aError .'</div>';
	}

	echo '<div class="panel">';
		switch($aStep) {
            case 4:
                echo 'You are done!';
                printNavigation($aStep, $aSteps);
            break;

			case 3:
				echo '<form action="'.basename($_SERVER['PHP_SELF']).'?step='.$aStep.'" method="post">';
                    foreach($aConfigConstants as $aParam => $aValue) {
                        echo '<div class="form-group">';
    						echo '<label for="'.$aParam.'">'.$aParam.'</label>';
    						echo '<input type="input" class="form-control" name="'.$aParam.'" id="'.$aParam.'" value="'.$aValue.'">';
    					echo '</div>';
                    }

					echo '<input type="hidden" name="write_config" value="1">';
                    printNavigation($aStep, $aSteps);
				echo '</form>';
			break;

			case 2:
                echo '<h3>Database</h3>';
                echo '<p>Please enter below the credentials of the database user that Codebot will work with. The installer will use that user to create the required database structures for you, e.g. tables.</p>';
				echo '<form action="'.basename($_SERVER['PHP_SELF']).'?step='.$aStep.'" method="post">';
					echo '<div class="form-group">';
						echo '<label for="inputUser">DB User</label>';
						echo '<input type="input" class="form-control" name="user" id="inputUser" placeholder="E.g. codebot" value="'.@$_SESSION['db_user'].'">';
					echo '</div>';
					echo '<div class="form-group">';
						echo '<label for="inputPassword">DB Password</label>';
						echo '<input type="password" class="form-control" name="password" id="inputPassword" placeholder="Password" value="'.@$_SESSION['db_password'].'">';
					echo '</div>';
					echo '<div class="form-group">';
						echo '<label for="inputName">DB name</label>';
						echo '<input type="text" class="form-control" name="name" id="inputName" placeholder="E.g. codebot_db" value="'.@$_SESSION['db_name'].'">';
					echo '</div>';
					echo '<div class="form-group">';
						echo '<label for="inputHost">DB host</label>';
						echo '<input type="text" class="form-control" name="host" id="inputHost" placeholder="E.g. localhost" value="'.@$_SESSION['db_host'].'">';
					echo '</div>';

                    echo '<input type="hidden" name="check_db" value="1">';
                    printNavigation($aStep, $aSteps);
				echo '</form>';
			break;

            case 1:
			case 0:
			default:
				echo '<form action="'.basename($_SERVER['PHP_SELF']).'?step='.($aStep <= 1 ? 2 : 1).'" method="post">';
					echo '<div class="form-group">';
                        echo '<h3>Welcome!</h3>';
                        echo '<p>This installer will help you with the setup. It should take less then 5 min, then you can have some cake. Before we even begin, please make sure you have the following available:</p>';

                        echo '<ul>';
                            echo '<li>';
                                echo '<i class="fa fa-database"></i>';
                                echo '<p class="item-title">Access to a database</p>';
                                echo '<p class="item-info">At the moment, only MySQL works. Your database user must have enough privileges to create tables and foreign keys.</p>';
                            echo '</li>';
                            echo '<li>';
                                echo '<i class="fa fa-folder-open"></i>';
                                echo '<p class="item-title">Non-web-visible folder (store data)</p>';
                                echo '<p class="item-info">This folder will be used to store user data, e.g. projects and files. It is recommended that this folder is outside your web server\'s document root, i.e. non visible from the web.</p>';
                            echo '</li>';
                            echo '<li>';
                                echo '<i class="fa fa-folder"></i>';
                                echo '<p class="item-title">Web-visible folder (store test files)</p>';
                                echo '<p class="item-info">Users can hit "Play" in Codebot to preview their project in action. When it happens, projects files are be copied to a web-visible folder and made available via an URL. A good folder for this would be something like <code>'.$aTestFolderExample.'</code>.</p>';
                            echo '</li>';
                        echo '</ul>';

                        if(!$aConfigFolderWritable) {
                            echo '<div class="alert alert-warning" role="alert"><strong>Heads up!</strong><br />It seems the installer can\'t write to folder <code>'.$aInstallerConfigDir.'</code>, which is where the configuration file will be. You can proceed with the instalation, but a manual step will be required at the end.</div>';
                        }
					echo '</div>';
                    printNavigation($aStep, $aSteps);
				echo '</form>';
			break;
		}
	echo '</div>';

	echo '<footer>Developed by <a href="http://twitter.com/As3GameGears" target="_blank">@As3GameGears</a><br />Icon made by <a href="http://www.simpleicon.com" title="SimpleIcon">SimpleIcon</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed under <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a></footer>';
echo '</body>';
echo '</html>';
