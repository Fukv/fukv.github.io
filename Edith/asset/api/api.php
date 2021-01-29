<?php

function escape($data, $db = NULL) {
	if (empty($db)) {
		$db = $GLOBALS["db"];
	}

	return mysqli_real_escape_string($db, trim($data));
}

function respond($ret = false) {

	if (gettype($ret) != "array") {
		$ret = Array();
		$ret["success"] = false;
		$ret["errorExpl"] = "Ret n'est pas défini";
	}

	if (empty($ret["success"])) { // si une erreur s'est produite
		if (empty($ret["errorExpl"])) {
			$ret["errorExpl"] = "Une erreur s'est produit, sans explication";
		}
	}

	header('Content-Type: application/json');
	echo json_encode($ret);
	
	die();

}

function error($errorExpl = false) {

	$ret = Array();
	$ret["success"] = false;
	if (!empty($errorExpl)) {
		$ret["errorExpl"] = $errorExpl;
	}
	
	respond($ret);

	die();
}

if(!($GLOBALS["db"] = mysqli_connect('localhost', 'root', '', 'Edith'))) {
	error("Impossible de se connecter a la BDD Edith");
}

function sqlLaunch($sql) {
	$db = $GLOBALS["db"];
	return mysqli_query($db, $sql);
}


// Functions

function getFile($arg = false) {

	if (empty($arg)) {
		error("getFile, la requête ne contient pas d'arguments");
	}

	if (empty($arg["fileName"])) {
		error("getFile, fileName non renseigné");
	}

	$fileName = escape($arg["fileName"]);

	$result = mysqli_fetch_array(sqlLaunch("SELECT * FROM `files` WHERE `fileName` LIKE '$fileName'"));
	$ret = array("perm" => $result["perm"], "fileName" => $result["fileName"], "content" => $result["content"]);

	respond(array("success" => true, "result" => $ret));
}

function writeFile($arg = false) {

	if (empty($arg)) {
		error("writeFile, la requête ne contient pas d'arguments");
	}

	// file name
	if (empty($arg["fileName"]) || gettype($arg["fileName"]) != "string") {
		error("writeFile, fileName n'est pas correct ou n'est pas spécifié");
	}
	$fileName = escape($arg["fileName"]);
	if (mysqli_num_rows(sqlLaunch("SELECT `id` FROM `files` WHERE `fileName` = '$fileName'")) == 0) {
		error("writeFile, le fichier n'existe pas");
	}

	// content
	if (empty($arg["content"]) || gettype($arg["content"]) != "string") {
		error("writeFile, content n'est pas correct ou n'est pas spécifié");
	}
	$content = escape($arg["content"]);

	if(sqlLaunch("UPDATE `files` SET `content` = '$content' WHERE `files`.`fileName` = '$fileName';")) {
		respond(array("success" => true));
	} else {
		respond(array("success" => false, "errorExpl" => "writeFile, l'écriture ne s'est pas correctement passé"));
	}
}

function createFile($arg = false) {

	if (empty($arg)) {
		error("createFile, la requête ne contient pas d'arguments");
	}

	if (empty($arg["fileName"]) || gettype($arg["fileName"]) != "string") {
		error("createFile, fileName n'est pas correct ou n'est pas spécifié");
	}

	$fileName = escape($arg["fileName"]);

	if (mysqli_num_rows(sqlLaunch("SELECT `id` FROM `files` WHERE `fileName` = '$fileName'")) != 0) {
		error("createFile, le fichier existe déjà");
	}


	if(sqlLaunch("INSERT INTO `files` (`id`, `perm`, `fileName`, `content`) VALUES (NULL, '33', '$fileName', '');")) {
		respond(array("success" => true));
	} else {
		respond(array("success" => false, "errorExpl" => "createFile, le fichier n'a pas pu être créé"));
	}

}

function execute($requ) {

	$opcodePoss = ["GET", "WRITE", "CREATE"];

	if (in_array($requ["opcode"], $opcodePoss)) {
		switch ($requ["opcode"]) {
			case 'GET':
				getFile($requ["arg"]);
				break;
			case 'WRITE':
				writeFile($requ["arg"]);
				break;
			case 'CREATE':
				createFile($requ["arg"]);
				break;
			default:
				error("Étrange .. opcode reconnu mais pas exécute");
				break;
		}

	} else {
		error("Opcode non reconnu");
	}

}

function get() {
	if (!isset($_POST["requ"])) {
		error("Aucune requête reçue");
	}

	$requJson = $_POST["requ"];

	$requ = json_decode($requJson, true);

	if (json_last_error_msg() != "No error") {
		error("La requête contient une erreur JSON");
	}
	if (!isset($requ["opcode"])) {
		error("La requête ne contient pas d'opcode");
	}
	if (!gettype($requ["opcode"]) == "string") {
		error("L'opcode de la requête n'est pas un string");
	}

	execute($requ);

}

get();


respond(array("success" => false, "errorExpl" => "Aucun code de sortie"));
?>