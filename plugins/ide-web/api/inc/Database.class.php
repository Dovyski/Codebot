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

class Database {
	private static $mInstance;

	public static function init() {
		try {
			self::connect(array(
				'dsn' => CODEBOT_DB_DSN,
				'host' => '',
				'name' => '',
				'user' => CODEBOT_DB_USER,
				'password' => CODEBOT_DB_PASSWORD
			));
		} catch (\PDOException $e) {
		    throw new \Exception('Database error! ' . trim($e->getMessage()));
		}
	}

	public static function connect($theConfig) {
		$aDsn = '';
		if(isset($theConfig['dsn'])) {
			$aDsn = $theConfig['dsn'];
		} else {
			$aDsn = 'mysql:host=' . $theConfig['host'] . (isset($theConfig['name']) ? ';dbname=' . $theConfig['name'] : '');
		}

	    $aDb = new \PDO($aDsn, $theConfig['user'], $theConfig['password'], array(\PDO::ATTR_PERSISTENT => true));
		$aDb->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

		self::$mInstance = $aDb;
	}

	public static function runSqlFileContent(array $theLines) {
		$aBuffer = '';

		foreach($theLines as $aLine) {
			if(!empty($aLine)) {
				$aBuffer .= $aLine;

				if(strpos($aLine, ';') !== false) {
					self::instance()->query($aBuffer);
					$aBuffer = '';
				}
			}
		}
	}

	public static function instance() {
		return self::$mInstance;
	}
}

?>
