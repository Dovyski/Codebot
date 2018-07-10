<?php
// Copyright (c) 2018 Fernando Bevilacqua <dovyski@gmail.com>
// Licensed under the MIT license, see LICENSE file.

namespace Codebot\Endpoints;

use Codebot\Auth;
use Exception;

class Credentials extends Base {
	public function logout() {
		$aUser = $this->getUser();
		$aSuccess = Auth::logout($aUser->id);

		return array('success' => $aSuccess, 'msg' => '');
	}

	public function profile() {
		$aUser = $this->getUser();
		return array(
			'success' => true,
			'user' => array(
				'id' => $aUser->id,
				'email' => $aUser->email,
				'gravatar_hash' => md5(strtolower(trim($aUser->email)))
			)
		);
	}
}

?>
