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

class Auth {
    public static function authenticate($theUserId) {
        $_SESSION['id'] = $theUserId;
    }

    public static function getAuthenticatedUserId() {
        return $_SESSION['id'];
    }

    public static function signInUsingOAuthInfo($theInfo) {
    	$aProvider 		= $theInfo['provider'];
    	$aUid 			= $theInfo['uid'];
    	$aLocalUser 	= userGetByProviderId($aProvider, $aUid);
    	$aLocalUserId 	= null;

    	if($aLocalUser == null) {
    		// No local account has been found.
    		// Let's create one then.

    		$aDisk 			= diskCreate($aProvider . $aUid);
    		$aEmail 		= isset($theInfo['info']['email']) ? $theInfo['info']['email'] : '';
    		$aAuthUid 		= $aProvider . '/' . $aUid;

    		$aLocalUserId 	= userCreate($aEmail, $aDisk, $aAuthUid, serialize($theInfo));

    	} else {
    		$aLocalUserId = $aLocalUser->id;
    	}

    	// Authenticate
    	$_SESSION['id'] = $aLocalUserId;
    	return true;
    }

    public static function init() {
        session_name(CODEBOT_SID);
        session_start();
    }

    public static function isUserAuthenticated() {
        return isset($_SESSION['id']) && $_SESSION['id'] != -1;
    }
}

?>
