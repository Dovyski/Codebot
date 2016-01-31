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

/**
 * Handles all API REST calls, instantiating the correct class to answer the
 * the requested method.
 */
class Router {
	private $mHandlers;
	private static $mTerms = array('_API_ENPOINT', '_API_CLASS_FILE', '_API_CLASS_NAME');

	function __construct() {
		$mHandlers = array();
	}

	private function includeFileAndApiEndpoint($theIncludes) {
		$aDir = dirname(__FILE__) . '/../../../../';

		foreach($theIncludes as $aOwner => $aTool) {
			foreach(self::$mTerms as $aTerm) {
				if(!isset($aTool[$aTerm])) {
					throw new Exception('API "' . $aOwner . '" in config file is missing info ' . $aOwner . $aTerm . '.');
				}
			}

			$aFile = $aDir . $aTool['_API_CLASS_FILE'];

			if(file_exists($aFile)) {
				require_once($aFile);
				$this->add($aTool['_API_ENPOINT'], $aTool['_API_CLASS_NAME']);

			} else {
				throw new Exception('Class file (informed in ' . $aOwner . $aTerm . ') does not exist: ' . $aFile);
			}
		}
	}

	private function invokeMethod($theClass, $theObj, $theMethod, $theParams) {
		$aReflection = new ReflectionMethod($theClass, $theMethod);
		$aRet = $aReflection->invoke($theObj, $theParams);

		return $aRet;
	}

	public function add($theAlias, $theClassHandler) {
		$this->mHandlers[$theAlias] = $theClassHandler;
	}

	public function addConfigDefinedEndpoints() {
		$aConstants = get_defined_constants(true);
		$aConfig = $aConstants['user'];
		$aMatches = array();
		$aInclude = array();

		foreach ($aConfig as $aName => $aValue) {
			if(preg_match_all('/(.*)('.implode('|', self::$mTerms).')/', $aName, $aMatches) != 0) {
				$aOwner = $aMatches[1][0];
				$aType  = $aMatches[2][0];

				$aInclude[$aOwner][$aType] = $aValue;
			}
		}

		$this->includeFileAndApiEndpoint($aInclude);
	}

	public function run($theRequest) {
		$aRet 		= '';

		$aAlias 	= isset($theRequest['class']) ? $theRequest['class'] : '';
		$aMethod 	= isset($theRequest['method']) ? $theRequest['method'] : '';

		unset($theRequest['class']);
		unset($theRequest['method']);

		// Do we have the handler to process this method?
		if(!isset($this->mHandlers[$aAlias])) {
			// No, we dont. It's a no show.
			throw new Exception('Unknown API class named "'.$aAlias.'".');
		}

		$aClass = $this->mHandlers[$aAlias];
		$aRet 	= array('out' => '', 'mime' => '');

		$aObj 	= new $aClass;
		$aOut 	= $this->invokeMethod($aClass, $aObj, $aMethod, $theRequest);

		// Decide which content-type the class wants for its content type.
		// If none is provided, we use json.
		$aMime 	= isset($aClass::$contentType) && isset($aClass::$contentType[$aMethod]) ? $aClass::$contentType[$aMethod] : 'application/json';

		// If content-type is json, we do the convertion here in the router.
		$aRet['mime'] = $aMime;
		$aRet['out']  = $aMime == 'application/json' ? json_encode($aOut) : $aOut;

		return $aRet;
	}
}

?>
