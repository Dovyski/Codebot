<?php
// Copyright (c) 2018 Fernando Bevilacqua <dovyski@gmail.com>
// Licensed under the MIT license, see LICENSE file.

namespace Codebot\Plugins;

/**
 * Base class for all backend plugins in Codebot.
 */
class Base {
	private $mApp;

	public function setup(\Codebot\App $theApp) {
		$this->mApp = $theApp;
	}

	public function app() {
		return $this->mApp;
	}
}

?>
