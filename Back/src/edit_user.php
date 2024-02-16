<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Disposition, Content-Type, Content-Length, Accept-Encoding");
header("Content-type:application/json");
session_start();

$data = json_decode(file_get_contents("php://input"));
//echo "received data : ";
//print_r($data);
$response = [
    'status' => 'None'
];

try
{
    $mysqlConnection = new PDO('mysql:host=localhost;dbname=prochess;charset=utf8', 'root', 'mdp', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
}
catch (Exception $e)
{
    die('Erreur : ' . $e->getMessage());
}

if (!isset($data->id) || !isset($data->login) || !isset($data->email)) {
    //http_response_code(400);
    die("Remplissez correctement. Un ou plusieurs champs n\'est pas set\n");
}

$id = $data->id;
$pseudo = $data->login;
$email = $data->email;
if(!isset($data->lichess_name)) {
    $lichess_name = null;
}else {
    $lichess_name = $data->lichess_name;
}

//check if user exists
try {
    $userStatement = $mysqlConnection->prepare('SELECT login FROM user WHERE id = :id');
    $userStatement->execute([
        'id' => $id,
    ]) or die(print_r($mysqlConnection->errorInfo()));
    $utilisateur = $userStatement->fetchAll();
    if (sizeof($utilisateur) == 0){
        http_response_code(400);
        die("Cet utilisateur n'existe pas\n");
    }
    //update user
    else {
        $updateUserStatement = $mysqlConnection->prepare('UPDATE user SET email = :email, lichess_name = :lichess_name, login = :login WHERE id = :id');
        $updateUserStatement->execute([
            'email' => $email,
            'lichess_name' => $lichess_name,
            'login' => $pseudo,
	    'id' => $id,
        ]) or die(print_r($mysqlConnection->errorInfo()));
        $response['status'] = "success";
        $response['message'] = "Utilisateur modifié";
        echo json_encode($response);
    }
} catch (Exception $e) {
    die('Erreur : ' . $e->getMessage());
}
?>