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

use \Codebot\Database;
use \Codebot\Project;
use \Codebot\Disk;
use \Codebot\Utils;

class AssetFinder extends \Codebot\Endpoints\Base {
	private function expandItemURLs($theAssetObject) {
		if(property_exists($theAssetObject, 'thumbnail')) {
			$theAssetObject->thumbnail = CODEBOT_ASSET_FINDER_MIRROR_URL . $theAssetObject->thumbnail;
		}

		if(property_exists($theAssetObject, 'preview')) {
			foreach($theAssetObject->preview as $aIndex => $aPreview) {
				$theAssetObject->preview[$aIndex] = CODEBOT_ASSET_FINDER_MIRROR_URL . $aPreview;
			}
		}

		if(property_exists($theAssetObject, 'files')) {
			foreach($theAssetObject->files as $aIndex => $aFile) {
				$theAssetObject->files[$aIndex]['url'] = CODEBOT_ASSET_FINDER_MIRROR_URL . $aFile['url'];
			}
		}

		return $theAssetObject;
	}

	public function search(array $theParams) {
		$aQuery = $this->getParam('query', $theParams);
		$aLicenses = (int)$this->getParam('license', $theParams);
		$aStart = (int)$this->getParam('start', $theParams);
		$aLimit  = (int)$this->getParam('limit', $theParams);

		$aQuery = '%' . $aQuery . '%';

		$aRet = array(
			'success' => true,
			'start' => $aStart,
			'limit' => $aLimit,
			'items'	=> array()
		);

		$aDbQuery = Database::instance()->prepare("SELECT id, title, thumbnail FROM assets WHERE title LIKE ? AND (license & ?) <> 0 LIMIT " . $aStart . "," . $aLimit);

		if ($aDbQuery->execute(array($aQuery, $aLicenses))) {
			while($aRow = $aDbQuery->fetch(PDO::FETCH_OBJ)) {
				$aRet['items'][] = $this->expandItemURLs($aRow);
			}
		}

		return $aRet;
	}

	public function info(array $theParams) {
		$aItem	= $this->getParam('item', $theParams);
		$aRet 	= null;
		$aQuery = Database::instance()->prepare("SELECT * FROM assets WHERE id = ?");

		if ($aQuery->execute(array($aItem))) {
			$aRet 			= $aQuery->fetch(PDO::FETCH_OBJ);

			$aRet->preview 	= unserialize($aRet->preview);
			$aRet->files 	= unserialize($aRet->files);
		}

		if($aRet != null) {
			$this->expandItemURLs($aRet);
		}

		return $aRet;
	}

	private function resolveFileSystemPath($theProjectId, $theFolder) {
		$aUser = $this->getUser();
		$aProject = Project::getById($theProjectId, true);

		if($aProject == null) {
			throw new Exception('Unknown project with id ' . $theProjectId);
		}

		if($aProject->fk_user != $aUser->id) {
			throw new Exception('The user is not allowed to view the project');
		}

		$theFolder = Utils::removeAnySlashAtEnd($theFolder);
		$aDisk = new Disk($aUser->disk);
		$aPath = $aDisk->getFileSystemPath(array($aProject->path, $theFolder));

		return $aPath;
	}

	public function fetch(array $theParams) {
		$aItemId 		  = $this->getParam('item', $theParams);
		$aProjectId 	  = $this->getParam('project', $theParams);
		$aDestinationPath = $this->getParam('destination', $theParams);
		$aRet 			  = array();

		$aItem = $this->info($theParams);

		if($aItem != null) {
			$aRealPath = $this->resolveFileSystemPath($aProjectId, $aDestinationPath);

			if(count($aItem->files) > 0) {
				$aRet['downloaded'] = array();

				foreach($aItem->files as $aFile) {
					// TODO: use some sort of pipe to avoid loading the file to the memory.
					$aData 			= Utils::downloadFile($aFile['url']);
					$aDestination 	= $aRealPath . $aFile['name'];

					Utils::log('Downloaded "'.$aFile['url'].'" to "'.$aDestination.'"', 'AssetFinder', __LINE__);

					$aLocalFile = @fopen($aDestination, 'w+');

					if($aLocalFile !== false && @fwrite($aLocalFile, $aData) !== false) {
						$aRet['success'] = true;
						$aRet['downloaded'][] = array(
							'name' => $aFile['name'],
							'path' => $aDestinationPath . DIRECTORY_SEPARATOR . $aFile['name']
						);

						fclose($aLocalFile);

					} else {
						$aRet['error'] = true;
						$aRet['message'] = 'Unable to write to file in folder ' . $aDestinationPath;
					}
				}
			} else {
				$aRet['error'] = true;
				$aRet['message'] = 'Item has no files to download.';
			}
		} else {
			$aRet['error'] = true;
			$aRet['message'] = 'Item does not exist.';
		}

		return $aRet;
	}
}
?>
