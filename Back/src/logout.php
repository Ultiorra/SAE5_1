<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Disposition, Content-Type, Content-Length, Accept-Encoding");
header("Content-type:application/json");
try
{
	session_start();
	session_destroy();
	//header('Location: home.php');
	http_response_code(200);
	$response = "Successfully logout";
	echo json_encode($response);	
	exit;
}
catch (Exception $e)
{
    die('Erreur : ' . $e->getMessage());
}
?>