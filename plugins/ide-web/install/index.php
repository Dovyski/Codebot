<?php
/**
 * This page will install Codebot and help you
 * configure it to your needs.
 */

// Include the bare minimum to make the instalation process
 require_once dirname(__FILE__).'/../api/inc/Auth.class.php';
 require_once dirname(__FILE__).'/../api/inc/Database.class.php';
 require_once dirname(__FILE__).'/../api/inc/Utils.class.php';

// Include all configuration files
$aConfigPath = dirname(__FILE__).'/../config.php';
$aLocalConfigPath = dirname(__FILE__).'/../config.local.php';
$aHasLocalConfig = @include_once $aLocalConfigPath;
$aInstallerConfigFile = $aLocalConfigPath;
$aInstallerConfigDir = realpath(dirname($aInstallerConfigFile));

$aTestFolderExample = realpath($aInstallerConfigDir . '/../../../') . DIRECTORY_SEPARATOR . 'testing' . DIRECTORY_SEPARATOR;

include_once $aConfigPath;

function printNavigation($theCurrentStep, $theSteps) {
    $theCurrentStep = (int)$theCurrentStep;
    $theCurrentStep = $theCurrentStep < 1 ? 1 : $theCurrentStep;
    $theCurrentStep = $theCurrentStep >= count($theSteps) + 1 ? count($theSteps) + 1 : $theCurrentStep;

    $thePreviousStep = $theCurrentStep - 1;
    $thePreviousStep = $thePreviousStep < 1 ? 1 : $thePreviousStep;

    echo '<div class="navigation">';
        if($theCurrentStep > 1 && $theCurrentStep != count($theSteps)) {
            echo '<a href="index.php?step='.$thePreviousStep.'" class="btn btn-danger back"><i class="fa fa-chevron-left"></i> Back</a>';
        }
        if($theCurrentStep < count($theSteps)) {
            echo '<button type="submit" class="btn btn-info next">Next <i class="fa fa-chevron-right"></i></button>';
        }
        if($theCurrentStep == count($theSteps)) {
            echo '<a href="../login/" class="btn btn-success next">Proceed to login <i class="fa fa-chevron-right"></i></a>';
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

// Init session stuff
Codebot\Auth::init();

if($aStep == 1) {
    $aConfigFolderWritable = is_writable($aInstallerConfigDir);
}

if($aStep == 2 && isset($_REQUEST['check_db'])) {
    $aName = isset($_REQUEST['name']) ? $_REQUEST['name'] : '';

	$aConfig = array(
		'host' => isset($_REQUEST['host']) ? $_REQUEST['host'] : '',
		'user' => isset($_REQUEST['user']) ? $_REQUEST['user'] : '',
		'password' => isset($_REQUEST['password']) ? $_REQUEST['password'] : ''
	);

    $_SESSION['db'] = $aConfig;
    $_SESSION['db']['name'] = $aName;

	try {
        if(empty($aConfig['user'])) {
            throw new \Exception('Empty DB user is not allowed. Choose something like "codebot" instead.');
        }

        if(empty($aName)) {
            throw new \Exception('Empty DB name is not allowed. Choose something like "codebot_db" instead.');
        }

		Codebot\Database::connect($aConfig);

		// Prepare the database name
		$aName = str_replace(array('"', "'"), '', $aName);

		// Create the database
		Codebot\Database::instance()->query('CREATE DATABASE IF NOT EXISTS ' . $aName);

		// Use this database from now one
		Codebot\Database::instance()->query('USE ' . $aName);

        $aTables = Codebot\Database::findTables();
        if(count($aTables) > 0) {
            throw new \Exception('Informed database already has tables, i.e. <em>'.implode(', ', $aTables).'</em>. If you want to use this database and its existing tables, click <a href="index.php?step=3">here</a> to proceed.');
        }

		// Create Codebot tables
		$aFile = file(dirname(__FILE__) . '/../api/resources/structure.sql');

		if($aFile !== false) {
			Codebot\Database::runSqlFileContent($aFile);
			$aStep++;

		} else {
			$aError = 'Unable to read structure.sql. Are the installation files corrupted?';
		}

	} catch(Exception $e) {
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

    // Replace DB stuff with information collected previously
    $aHost = empty($_SESSION['db']['host']) ? 'localhost' : $_SESSION['db']['host'];
    $aConfigConstants['CODEBOT_DB_DSN'] = 'mysql:host='.$aHost.';dbname=' . $_SESSION['db']['name'];
    $aConfigConstants['CODEBOT_DB_USER'] = $_SESSION['db']['user'];
    $aConfigConstants['CODEBOT_DB_PASSWORD'] = $_SESSION['db']['password'];

    $aConfigInfo = Codebot\Utils::parsePHPConfigFile($aConfigPath);
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
        $aConfigContent .= "// File automatically generated by Codebot installer on ".date(DATE_RFC2822).".\n";

        foreach($aConfigConstants as $aName => $aValue) {
            // Is the user specified value different from the one in the config file?
            if($_REQUEST[$aName] != constant($aName) || stripos($aName, 'CODEBOT_DB_') !== false) {
                // Yeah, it is. Let's write that constant to the local config file then
                $aConfigContent .= "define('".$aName."', '".$_REQUEST[$aName]."');\n";
            }
        }
        $aConfigContent .= "?>";

        file_put_contents($aInstallerConfigFile, $aConfigContent);

        // We are finished!
        unset($_SESSION['db']);
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
                $aClass = '';
                if($aNumber + 1 == $aStep) {
                    $aClass = 'active';
                } else if($aNumber + 1 < $aStep) {
                    $aClass = 'ready';
                }
				echo '<li class="' . $aClass . '"><strong>' . ($aNumber + 1) . '</strong> '. $aInfo['name'] .'</li>';
			}
		echo '</ol>';
	echo '</div>';

	if(!empty($aError)) {
		echo '<div class="warning"><strong><i class="fa fa-warning"></i> Oops!</strong><br />'. $aError .'</div>';
	}

	echo '<div class="panel">';
		switch($aStep) {
            case 4:
                echo '<div class="finished">';
                    echo '<i class="fa fa-check"></i>';
                    echo '<h3>You are done!</h3>';
                    echo '<p>Codebot is now installed and ready to be used. Have some cake with coffee and enjoy this gamedev IDE on the cloud.</p>';
                echo '</div>';
                printNavigation($aStep, $aSteps);
            break;

			case 3:
                echo '<h3>Fine tuning</h3>';
                echo '<p>Use the options below to tweak Codebot to your needs. By default, everything required for a good and complete user experience is enabled. You can change settings later on by editing the file <code>'.$aInstallerConfigFile.'</code>.</p>';
                echo '<p></p>';
				echo '<form action="'.basename($_SERVER['PHP_SELF']).'?step='.$aStep.'" method="post">';
                    foreach($aConfigInfo as $aSection => $aSessionConstants) {
                        echo '<h4><i class="fa fa-cogs"></i> '.$aSection.'</h4><hr />';
                        foreach($aSessionConstants as $aName => $aDesc) {
                            if(!isset($aConfigConstants[$aName])) {
                                continue;
                            }
                            $aValue = $aConfigConstants[$aName];
                            echo '<div class="form-group">';
        						echo '<label for="'.$aName.'">'.$aName.'</label>';
                                echo $aDesc != '' ? '<p>' . $aDesc . '</p>' : '';
        						echo '<input type="input" class="form-control" name="'.$aName.'" id="'.$aName.'" value="'.htmlentities($aValue).'">';
        					echo '</div>';
                        }
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
						echo '<input type="input" class="form-control" name="user" id="inputUser" placeholder="E.g. codebot" value="'.@$_SESSION['db']['user'].'">';
					echo '</div>';
					echo '<div class="form-group">';
						echo '<label for="inputPassword">DB Password</label>';
						echo '<input type="password" class="form-control" name="password" id="inputPassword" placeholder="Password" value="'.@$_SESSION['db']['password'].'">';
					echo '</div>';
					echo '<div class="form-group">';
						echo '<label for="inputName">DB name</label>';
						echo '<input type="text" class="form-control" name="name" id="inputName" placeholder="E.g. codebot_db" value="'.@$_SESSION['db']['name'].'">';
					echo '</div>';
					echo '<div class="form-group">';
						echo '<label for="inputHost">DB host</label>';
						echo '<input type="text" class="form-control" name="host" id="inputHost" placeholder="E.g. localhost" value="'.@$_SESSION['db']['host'].'">';
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
