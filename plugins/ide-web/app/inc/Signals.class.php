<?php
// Copyright (c) 2018 Fernando Bevilacqua <dovyski@gmail.com>
// Licensed under the MIT license, see LICENSE file.

namespace Codebot;

/**
 * Represent a pool of signals.
 */
class Signals {
	/**
	 * Invoked when a new user is created. It could be after Codebot received an oAuth
	 * response, or when a user clicked the dev login button.
	 * @var Codebot\Signal
	 */
	public $userCreated;

	/**
	 * Invoked when all internal setup of the backend has finished.
	 * @var Codebot\Signal
	 */
	public $ready;

	function __construct() {
		$this->userCreated = new Signal();
		$this->ready = new Signal();
	}
}

?>
