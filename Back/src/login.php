<?php
session_start();
$postData = $_POST;

try
{
  $mysqlConnection = new PDO('mysql:host=localhost;dbname=prochess;charset=utf8', 'root', 'mdp', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
}
catch (Exception $e)
{
    die('Erreur : ' . $e->getMessage());
}

// Validation du formulaire
if (isset($_POST['login']) &&  isset($_POST['password']) && !empty($_POST['login']) && !empty($_POST['password'])) {
    $pseudo = $_POST['login'];
    $pw = hash("sha256", $_POST['password']);
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
                    'message' => 'Vous êtes connecté',
                    'user' => $loggedUser
                ];
                echo json_encode($response);
            } else {
                $errorMessage = sprintf('<h1>Les informations envoyées ne permettent pas de vous identifier : (%s/%s)</h1>',
                    $_POST['login'],
                    $_POST['password']
                );
            }
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