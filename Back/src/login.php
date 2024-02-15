<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Disposition, Content-Type, Content-Length, Accept-Encoding");
header("Content-type:application/json");
session_start();

$data = json_decode(file_get_contents("php://input"));

try {
    $mysqlConnection = new PDO('mysql:host=localhost;dbname=prochess;charset=utf8', 'root', 'mdp', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
} catch (Exception $e) {
    die('Erreur : ' . $e->getMessage());
}

if (!isset($data->login) || !isset($data->password)) {
    die("Remplissez correctement. Un ou plusieurs champs n'est pas set\n");
}

try {
    $pseudo = $data->login;
    $pw = hash("sha256", $data->password);

    $userStatement = $mysqlConnection->prepare('SELECT id, login, password, email, lichess_name FROM user WHERE login = :login AND password = :password');
    $userStatement->execute([
        'login' => $pseudo,
        'password' => $pw,
    ]) or die(print_r($mysqlConnection->errorInfo()));
    $user = $userStatement->fetch();
    if ($user) {
        $loggedUser = [
            'login' => $user['login'],
        ];
        $_SESSION['LOGGED_USER'] = $pseudo;
        $_SESSION['ID'] = $user['id'];
        http_response_code(200);
        $response = [
            'status' => 'success',
            'message' => 'Vous vous etes connecte a votre compte',
            'user' => $pseudo,
            'email' => $user['email'],
            'iduser' => $user['id'],
            'lichess_name' => $user['lichess_name'],
        ];
        echo json_encode($response);
    } else {
        $errorMessage = sprintf('Les informations envoyées ne permettent pas de vous identifier : (%s/%s)',
            $data->login,
            $data->password
        );
        http_response_code(401);
        $response = [
            'status' => 'error',
            'message' => $errorMessage,
        ];
        echo json_encode($response);
    }
} catch (Exception $e) {
    die('Erreur : ' . $e->getMessage());
}
?>
