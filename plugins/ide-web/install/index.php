<?php
/**
 * This page will install Codebot and help you
 * configure it to your needs.
 */

// Include the bare minimum to make the instalation process
 require_once dirname(__FILE__).'/../api/inc/Auth.class.php';
 require_once dirname(__FILE__).'/../api/inc/Database.class.php';

// Include all configuration files
@include_once dirname(__FILE__).'/../config.local.php';
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

// The instalation steps
$aSteps = array();
$aSteps[0] = array('name' => 'Preparation');
$aSteps[1] = array('name' => 'Database');
$aSteps[2] = array('name' => 'Configuration');
$aSteps[3] = array('name' => 'Have a cake!');

// Available Codebot configuration constants (see api/config.php)
$aConfigConstants = array();

// Get the current step
$aStep 	= isset($_REQUEST['step']) ? (int)$_REQUEST['step'] : 0;
$aError = '';

// Init the session
Codebot\Auth::init();

if($aStep == 1) {
	// TODO: check dependencies, writable dirs, files, etc.
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

        $aConfigFile = dirname(__FILE__) . '/../config.local.new.php'; // TODO: write to the right file.
        file_put_contents($aConfigFile, $aConfigContent);

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
		echo '<h2>Installation</h2>';
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
                    printNavigation($aStep, $aSteps);
				echo '</form>';
			break;

            case 1:
			case 0:
			default:
				echo '<form action="'.basename($_SERVER['PHP_SELF']).'?step='.($aStep <= 1 ? 2 : 1).'" method="post">';
					echo '<div class="form-group">';
						echo 'TODO: display preparation data.';
					echo '</div>';
                    printNavigation($aStep, $aSteps);
				echo '</form>';
			break;
		}
	echo '</div>';

	echo '<footer>Developed by <a href="http://twitter.com/As3GameGears" target="_blank">@As3GameGears</a><br />Icon made by <a href="http://www.simpleicon.com" title="SimpleIcon">SimpleIcon</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed under <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a></footer>';
echo '</body>';
echo '</html>';
