<?php
session_start();

include_once('menu.php');
include_once('popup.php');
$postData = $_POST;

if (!isset($postData['password']) || !isset($postData['login']) || !isset($postData['confirmPassword']
    || !isset($postData['email'] || !empty($postData['login']) || !empty($postData['email'])
    || !empty($postData['confirmPassword']) || !empty($postData['password'])) {
	echo('Remplissez correctement.');
    return;
}

$pseudo = $postData['login'];
$email = $postData['email'];
$confirmPassword = hash("sha256", $postData['confirmPassword']);
$pw = hash("sha256", $postData['password']);

try
{
    $userStatement = $mysqlConnection->prepare('SELECT login FROM user');
    $userStatement->execute();
    $utilisateurs = $userStatement->fetchAll();
    $continue = true;
    $pwsize = true;

    if (strlen($pw) < 8){
        $pwsize = false;
        $continue = false;
    }

    foreach ($utilisateurs as $user) {
        if ($user['login'] === $pseudo){
            $continue = false;
        }
    }

    if ($continue === true){
        $newuserStatement = $mysqlConnection->prepare('INSERT INTO user (login, password, email) VALUES (:ps, :pw, :em)');
        $newuserStatement->execute([
            'ps' => $pseudo,
            'pw' => $pw,
            'em' => $email,
        ]);
    }
}
catch (Exception $e)
{
    die('Erreur : ' . $e->getMessage());
}
?>