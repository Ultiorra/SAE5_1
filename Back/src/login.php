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

// Validation du formulaire
if (!isset($data->login) || !isset($data->password) && !empty($data->login) || !empty($data->password)) {
    $pseudo = $data->login;
    $pw = hash("sha256", $data->password);
    try
    {
        $userStatement = $mysqlConnection->prepare('SELECT id, login, password FROM user');
        $userStatement->execute() or die(print_r($mysqlConnection->errorInfo()));
        $utilisateurs = $userStatement->fetchAll();
        foreach ($utilisateurs as $user) {
            if ($user['login'] === $pseudo && $user['password'] === $pw)
            {
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
                ];
                //print_r("\nConnexion réussie\n");
                echo json_encode($response);
                break;
            }
            else {
                $errorMessage = sprintf('<h1>Les informations envoyées ne permettent pas de vous identifier : (%s/%s)</h1>',
                    $data->login,
                    $data->password
                );
                http_response_code(404);
            }
        }
        if (!isset($loggedUser)) {
            http_response_code(401);
            print_r($errorMessage);
        }
    }
    catch (Exception $e)
    {
        die('Erreur : ' . $e->getMessage());
    }
}
else{
    http_response_code(400);
    echo "Not a POST request...";
    exit;
}
?>