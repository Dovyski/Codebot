<?php
/*
	The MIT License (MIT)

	Copyright (c) 2015 Fernando Bevilacqua

	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

namespace Codebot;

class Signal {
	private $listeners;

	private function getKey($theListener) {
		if(is_string($theListener)) {
			return $theListener;
		} else if(is_array($theListener)) {
			return implode('', $theListener);
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
		foreach($this->listeners as $aKey => $aListener) {
			echo 'Dispatching...';
			call_user_func_array($aListener, $theParams);
		}
	}
}

?>
