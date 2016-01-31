<?php
/*
	The MIT License (MIT)

	Copyright (c) 2016 Fernando Bevilacqua

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

namespace Codebot\Endpoints;

/**
 * Base API endpoint. All endpoints should extend this class
 * to obtain basic funcionality and utilities regarding endpoints.
 */
class Base {
	/**
	 * [getParam description]
	 * @param  [type] $theName   [description]
	 * @param  [type] $theParmas [description]
	 * @return [type]            [description]
	 */
	public function getParam($theName, $theParams, $theRequired = true, $theCanBeEmpty = false) {
		$aRet = null;

		if(isset($theParams[$theName])) {
			if(!empty($theParams[$theName])) {
				$aRet = $theParams[$theName];
			} else {
				throw new \Exception('Empty param: ' . $theName);
			}
		} else if($theRequired) {
			throw new \Exception('Missing param: ' . $theName);
		}

		return $aRet;
	}
}

?>
