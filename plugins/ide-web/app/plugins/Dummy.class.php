<?php
// Copyright (c) 2018 Fernando Bevilacqua <dovyski@gmail.com>
// Licensed under the MIT license, see LICENSE file.

namespace MyDummyNamespace;

/**
 * Dummy plugin to illustrate how to create a basic backend plugin for Codebot
 */
class MyDummyPlugin extends \Codebot\Plugins\Base {
	public function setup(\Codebot\App $theApp) {
		parent::setup($theApp);

		// Listen to a signal that indicates everything is ready.
		$aCallback = array($this, 'testing');
		$this->app()->signals->ready->add($aCallback);
	}

	public function testing() {
		// Stop listening to the 'ready' signal.
		$aCallback = array($this, 'testing');
		$this->app()->signals->ready->remove($aCallback);
	}
}

?>
