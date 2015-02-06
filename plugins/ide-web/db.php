<?php

global $gDb;

try {
    $gDb = new PDO(DB_DSN, DB_USER, DB_PASSWORD, array(PDO::ATTR_PERSISTENT => true));
	$gDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    print "Database error! " . $e->getMessage();
    die();
}

?>
