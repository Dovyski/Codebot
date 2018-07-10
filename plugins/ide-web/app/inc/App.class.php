<?php
// Copyright (c) 2018 Fernando Bevilacqua <dovyski@gmail.com>
// Licensed under the MIT license, see LICENSE file.

namespace Codebot;

require_once dirname(__FILE__).'/Signal.class.php';
require_once dirname(__FILE__).'/Signals.class.php';
require_once dirname(__FILE__).'/../plugins/Base.class.php';

/**
 * Control the app context on the backend side. This class is not responsible for
 * fine controlling things, e.g. session and authentication. It is more high level.
 * It controls, for instance, the loading and handling of plugins on the backend.
 */
class App {
	private static $mInstance;
	private $mPlugins;

	public $signals;

	private function loadPlugins() {
		if(empty(CODEBOT_PLUGINS)) {
			return;
		}
		$aPluginEntries = explode(';', CODEBOT_PLUGINS);

		foreach($aPluginEntries as $aEntry) {
			if(empty($aEntry)) {
				continue;
			}

			$aParts = explode('|', $aEntry);
			$aClassName = $aParts[0];
			$aClassPath = $aParts[1];

			if(!file_exists($aClassPath)) {
				throw new \Exception('Unable to load plugin class "'.$aClassName.'" (path="'.$aClassPath.'")');
			}

			try {
				require_once($aClassPath);
				$this->mPlugins[] = new $aClassName();

			} catch(\Error $e) {
				throw new \Exception('Unable to instantiate plugin class "'.$aClassName.'": ' + $e-getMessage());
			}
		}
	}

	private function setup() {
		if(count($this->mPlugins) > 0) {
			foreach($this->mPlugins as $aPlugin) {
				$aPlugin->setup($this);
			}
		}
	}

	function __construct() {
		$this->signals = new Signals();

		if(CODEBOT_USE_PLUGINS) {
			$this->loadPlugins();
		}
	}

	public static function init() {
		self::$mInstance = new App();
		self::$mInstance->setup();
	}

	public static function instance() {
		return self::$mInstance;
	}
}

?>
