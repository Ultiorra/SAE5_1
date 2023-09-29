<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Disposition, Content-Type, Content-Length, Accept-Encoding");
header("Content-type:application/json");
session_start();

$data = json_decode(file_get_contents("php://input"));
echo "received data : ";
print_r($data);

try
{
    $mysqlConnection = new PDO('mysql:host=localhost;dbname=prochess;charset=utf8', 'root', 'mdp', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
}
catch (Exception $e)
{
    die('Erreur : ' . $e->getMessage());
}

if (!isset($data->login) || !isset($data->password) || !isset($data->confirmPassword) || !isset($data->email)) {
    echo('Remplissez correctement. Un ou plusieurs champs n\'est pas set');
    return;
}

$pseudo = $data->login;
$email = $data->email;
$confirmPassword = hash("sha256", $data->confirmPassword);
$pw = hash("sha256", $data->password);

try
{
    $userStatement = $mysqlConnection->prepare('SELECT login FROM user');
    $userStatement->execute();
    $utilisateurs = $userStatement->fetchAll();
    $continue = true;

    if (strlen($pw) < 8 || $pw != $confirmPassword){
        http_response_code(400);
        $continue = false;
        print_r("Mot de passe trop court ou non identique");
    }

    foreach ($utilisateurs as $user) {
        if ($user['login'] === $pseudo){
            $continue = false;
            print_r("Ce pseudo est déjà utilisé");
            http_response_code(400);
        }
    }

    if ($continue === true){
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
        ];
        print_r("Inscription réussie");
        http_response_code(200);
        echo json_encode($response);
    }
}
catch (Exception $e)
{
    die('Erreur : ' . $e->getMessage());
}
?>