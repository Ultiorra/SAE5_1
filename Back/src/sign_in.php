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
    $mysqlConnection = new PDO('mysql:host=localhost;dbname=prochess;charset=utf8', 'root', 'root', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
}
catch (Exception $e)
{
    die('Erreur : ' . $e->getMessage());
}

if (!isset($data->login) || !isset($data->password) || !isset($data->confirmPassword) || !isset($data->email)) {
    //http_response_code(400);
    die("Remplissez correctement. Un ou plusieurs champs n\'est pas set\n");
}

$pseudo = $data->login;
$email = $data->email;
$confirmPassword = hash("sha256", $data->confirmPassword);
$pw = hash("sha256", $data->password);

try
{
    $userStatement = $mysqlConnection->prepare('SELECT login FROM user WHERE login = :login');
    $userStatement->execute([
        'login' => $pseudo,
    ]) or die(print_r($mysqlConnection->errorInfo()));
    $utilisateur = $userStatement->fetchAll();
    if (sizeof($utilisateur) > 0){
        http_response_code(400);
        die("Ce pseudo est déjà utilisé\n");
        $continue = false;
    }
    else {
        $continue = true;
    }

    if (strlen($pw) < 8 || $pw != $confirmPassword){
        http_response_code(400);
        $continue = false;
        $response['status'] = "Mot de passe trop court ou non identique\n";
        die("Mot de passe trop court ou non identique\n");
    }

    if ($continue){
        $newuserStatement = $mysqlConnection->prepare('INSERT INTO user (login, password, email) VALUES (:ps, :pw, :em)');
        $newuserStatement->execute([
            'ps' => $pseudo,
            'pw' => $pw,
            'em' => $email,
        ]);
        $response = [
            'status' => 'success',
            'message' => 'Vous avez creer votre compte',
            'user' => $pseudo,
            'email' => $email,
            'userid' => $mysqlConnection->lastInsertId(),
        ];
        http_response_code(200);
        echo json_encode($response);
        //die("Inscription réussie");
    }
}
catch (Exception $e)
{
    die('Erreur : ' . $e->getMessage());
}
?>