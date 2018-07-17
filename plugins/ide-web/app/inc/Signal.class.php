<?php
// Copyright (c) 2018 Fernando Bevilacqua <dovyski@gmail.com>
// Licensed under the MIT license, see LICENSE file.

namespace Codebot;

class Signal {
	private $listeners;

	private function getKey($theListener) {
		if(is_string($theListener)) {
			return $theListener;
		} else if(is_array($theListener)) {
			return (is_string($theListener[0]) ? $theListener[0] : spl_object_hash($theListener[0])) . $theListener[1];
		} else {
			throw new \Exception('Invalid listener: it should be string or array(class, method).');
		}
	}

	public function add($theListener) {
		$aKey = $this->getKey($theListener);

		if(!isset($this->listeners[$aKey])) {
			$this->listeners[$aKey] = $theListener;
			return true;
		}

		return false;
	}

	public function remove($theListener) {
		$aKey = $this->getKey($theListener);

		if(isset($this->listeners[$aKey])) {
			unset($this->listeners[$aKey]);
			return true;
		}

		return false;
	}

	public function dispatch(array $theParams = array()) {
		if(count($this->listeners) == 0) {
			return;
		}
		foreach($this->listeners as $aKey => $aListener) {
			call_user_func_array($aListener, $theParams);
		}
	}
}

?>
