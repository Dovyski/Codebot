<?php
// Copyright (c) 2018 Fernando Bevilacqua <dovyski@gmail.com>
// Licensed under the MIT license, see LICENSE file.

namespace Codebot\Plugins;

// Include a few dependencies
require_once dirname(__FILE__).'/../../api/inc/Project.class.php';
require_once dirname(__FILE__).'/../../api/endpoints/Base.class.php';
require_once dirname(__FILE__).'/../../api/endpoints/Project.class.php';

/**
 * This class provisions newly created users with some template projects,
 * so the user has something to play with when arriving.
 */
class UserProvisioner extends Base {
	public function setup(\Codebot\App $theApp) {
		parent::setup($theApp);

		// Listen to a signal that indicates everything is ready.
		$aCallback = array($this, 'doProvision');
		$this->app()->signals->userCreated->add($aCallback);
	}

	public function doProvision($theUserId) {
		$aUser = \Codebot\User::getById($theUserId);
		if($aUser == null) {
			// Let's fail silently.
			return;
		}

		// TODO: get those values from a config file
		$aData = array(
			'name' 		=> 'My example project',
			'type'		=> 'js',
			'template'	=> 'js-phaser-complete-game',
			'git_repo'	=> ''
		);
		$aProject = \Codebot\Endpoints\Project::materializeProject($aUser, $aData);
	}
}

?>
