<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Disposition, Content-Type, Content-Length, Accept-Encoding");
header("Content-type:application/json");
session_start();

$data = json_decode(file_get_contents("php://input"));
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

if (!isset($data->action)){
    //http_response_code(400);
    die("Remplissez correctement. action n\'est pas set\n");
}

$action = $data->action;
$continue = 0;

switch ($action){
    case 1:
        //echo "cas 1";
        if (!isset($data->nom) || !isset($data->ouverture) || !isset($data->couleur) || !isset($data->userid)) {
            //http_response_code(400);
            die("Remplissez correctement. Un ou plusieurs champs n\'est pas set\n");
        }
        $nom = $data->nom;
        $ouverture = $data->ouverture;
        $couleur = $data->couleur;
        $userid = $data->userid;
        try{
            //check repo doesn't already exists
            $getRepo = $mysqlConnection->prepare('SELECT id FROM repertoires WHERE nom = :nom AND couleur = :couleur');
            $getRepo->execute([
                'nom' => $nom,
                'couleur' => $couleur,
            ]) or die(print_r($mysqlConnection->errorInfo()));
            $result = $getRepo->fetchAll();
            $exist = sizeof($result) > 0 ? 1 : 0;
            if ($exist == 1){
                http_response_code(400);
                die("Ce repertoire existe deja\n");
            }
            else{
                $continue = 1;
            }
            //create repo
            if ($continue == 1){
                $createRepo = $mysqlConnection->prepare('INSERT INTO repertoires (nom, ouverture, nb_tests, nb_reussites, couleur) VALUES (:nom, :ouverture, :nb_tests, :nb_reussites, :couleur)');
                $createRepo->execute([
                    'nom' => $nom,
                    'ouverture' => $ouverture,
                    'nb_tests' => 0,
                    'nb_reussites' => 0,
                    'couleur' => $couleur,
                ]) or die(print_r($mysqlConnection->errorInfo()));
                //echo "repo cree\n";
                $id = $mysqlConnection->lastInsertId();
                $createLink = $mysqlConnection->prepare('INSERT INTO user_repertoires (id_user, id_repertoire) VALUES (:id_user, :id_repertoire)');
                $createLink->execute([
                    'id_user' => $userid,
                    'id_repertoire' => $id,
                ]) or die(print_r($mysqlConnection->errorInfo()));
                //echo $id;
                //echo "lien cree\n";
                $response = [
                    'status' => 'success',
                    'message' => 'Vous avez creer votre repertoire',
                    'nom' => $nom,
                    'id' => $id,
                ];
                http_response_code(200);
                echo json_encode($response);
            }
        }
        catch (Exception $e)
        {
            die('Erreur : ' . $e->getMessage());
        }
        break;
    case 2:
        //echo "cas 2";
        try{
            if (!isset($data->userid)) {
                //http_response_code(400);
                die("Remplissez correctement. Un ou plusieurs champs n\'est pas set\n");
            }
            $userid = $data->userid;
            $getAllRepo = $mysqlConnection->prepare('SELECT * FROM repertoires JOIN user_repertoires ON repertoires.id = user_repertoires.id_repertoire WHERE id_user = :userid');
            $getAllRepo->execute([
                'userid' => $userid,
            ]) or die(print_r($mysqlConnection->errorInfo()));
            $result = $getAllRepo->fetchAll();
            $response = [
                'status' => 'success',
                'message' => 'Vous avez recupere vos repertoires',
                'repertoires' => $result,
            ];
            http_response_code(200);
            echo json_encode($response);
        }
        catch (Exception $e)
        {
            die('Erreur : ' . $e->getMessage());
        }
        break;
    case 3:
        //echo "cas 3, suppresion de repertoire\n";
        try{
            if (!isset($data->idrep)) {
                //http_response_code(400);
                die("Remplissez correctement. Un ou plusieurs champs n\'est pas set\n");
            }
            $id = $data->idrep;
            //check if current user is owner of repo
            if (isset($data->userid)) {
                $id = $data->idrep;
                $getRepo = $mysqlConnection->prepare('SELECT id_user FROM user_repertoires WHERE id_user = :id AND id_repertoire = :idrep');
                $getRepo->execute([
                    'id' =>$data->userid,
                    'idrep' => $data->idrep,
                ]) or die(print_r($mysqlConnection->errorInfo()));
                $result = $getRepo->fetchAll();
                $exist = sizeof($result) > 0 ? 1 : 0;
                if ($exist == 0){
                    http_response_code(400);
                    die("ce repo ne vous appartient pas, ou à déjà été supprimé\n");
                }
            }
            else{
                http_response_code(400);
                die("Vous n'etes pas connecte\n");
            }
            if ($exist == 1){
                //echo "ce repo vous appartient\n";
                //delete repo
                $deleteRepo = $mysqlConnection->prepare('DELETE FROM repertoires WHERE id = :id');
                $deleteRepo->execute([
                    'id' => $id,
                ]) or die(print_r($mysqlConnection->errorInfo()));
                $response = [
                    'status' => 'success',
                    'message' => 'Vous avez supprime votre repertoire',
                ];
                http_response_code(200);
                echo json_encode($response);
            }
        }
        catch (Exception $e)
        {
            die('Erreur : ' . $e->getMessage());
        }
        break;
    case 4:
        //echo "cas 4";
        //echo "modification de repo\n";
        try{
            if (!isset($data->idrep) || !isset($data->nom) || !isset($data->ouverture) || !isset($data->couleur) || !isset($data->userid)) {
                //http_response_code(400);
                die("Remplissez correctement. Un ou plusieurs champs n\'est pas set\n");
            }
            $idrep = $data->idrep;
            $iduser = $data->userid;
            $nom = $data->nom;
            $ouverture = $data->ouverture;
            $couleur = $data->couleur;
            //check if current user is owner of received repo
            if (isset($_SESSION['ID']) && $_SESSION['ID'] == $iduser){
                $getRepo = $mysqlConnection->prepare('SELECT id_user FROM user_repertoires WHERE id_user = :id AND id_repertoire = :idrep');
                $getRepo->execute([
                    'id' => $_SESSION['ID'],
                    'idrep' => $data->idrep,
                ]) or die(print_r($mysqlConnection->errorInfo()));
                $result = $getRepo->fetchAll();
                $exist = sizeof($result) > 0 ? 1 : 0;
                if ($exist == 0){
                    http_response_code(400);
                    die("Vous n'etes pas connecte, ou ce repo ne vous appartient pas\n");
                }
            }
            else{
                http_response_code(400);
                die("Vous n'etes pas connecte, ou ce repo ne vous appartient pas\n");
            }
            if ($exist == 1){
                //echo "ce repo vous appartient\n";
                //update repo
                $updateRepo = $mysqlConnection->prepare('UPDATE repertoires SET nom = :nom, ouverture = :ouverture, couleur = :couleur WHERE id = :id');
                $updateRepo->execute([
                    'id' => $idrep,
                    'nom' => $nom,
                    'ouverture' => $ouverture,
                    'couleur' => $couleur,
                ]) or die(print_r($mysqlConnection->errorInfo()));
                $response = [
                    'status' => 'success',
                    'message' => 'Vous avez modifie votre repertoire',
                ];
                http_response_code(200);
                echo json_encode($response);
            }
        }
        catch (Exception $e)
        {
            die('Erreur : ' . $e->getMessage());
        }
        break;
    case 5:
        //echo update repo stats +1 test +1 reussite si reussi
        try{
            if (!isset($data->idrep) || !isset($data->reussi)){
                //http_response_code(400);
                die("Remplissez correctement. Un ou plusieurs champs n\'est pas set\n");
            }
            $idrep = $data->idrep;
            $getStats = $mysqlConnection->prepare('SELECT nb_tests, nb_reussites FROM repertoires WHERE id = :idrep');
            $getStats->execute([
                'idrep' => $idrep,
            ]) or die(print_r($mysqlConnection->errorInfo()));
            $result = $getStats->fetchAll();
            $nb_tests = $result[0]['nb_tests'] + 1;
            $nb_reussites = $result[0]['nb_reussites'];
            if ($data->reussi == 1){
                $nb_reussites = $result[0]['nb_reussites'] + 1;
            }
            $updateStats = $mysqlConnection->prepare('UPDATE repertoires SET nb_tests = :nb_tests, nb_reussites = :nb_reussites WHERE id = :idrep');
            $updateStats->execute([
                'idrep' => $idrep,
                'nb_tests' => $nb_tests,
                'nb_reussites' => $nb_reussites,
            ]) or die(print_r($mysqlConnection->errorInfo()));
            $response = [
                'status' => 'success',
                'message' => 'Vous avez mis a jour les stats de votre repertoire',
            ];
            http_response_code(200);
            echo json_encode($response);
        }
        catch (Exception $e)
        {
            die('Erreur : ' . $e->getMessage());
        }
        break;
    case 6:
        //echo update repo stats from values
        try{
            if (!isset($data->idrep) || !isset($data->nb_tests) || !isset($data->nb_reussites)){
                //http_response_code(400);
                die("Remplissez correctement. Un ou plusieurs champs n\'est pas set\n");
            }
            $idrep = $data->idrep;
            $getStats = $mysqlConnection->prepare('SELECT nb_tests, nb_reussites FROM repertoires WHERE id = :idrep');
            $getStats->execute([
                'idrep' => $idrep,
            ]) or die(print_r($mysqlConnection->errorInfo()));
            $result = $getStats->fetchAll();
            $nb_tests = $result[0]['nb_tests'];
            $nb_reussites = $result[0]['nb_reussites'];
            $new_nb_tests = $data->nb_tests + $nb_tests;
            $new_nb_reussites = $data->nb_reussites + $nb_reussites;
            $updateStats = $mysqlConnection->prepare('UPDATE repertoires SET nb_tests = :nb_tests, nb_reussites = :nb_reussites WHERE id = :idrep');
            $updateStats->execute([
                'idrep' => $idrep,
                'nb_tests' => $new_nb_tests,
                'nb_reussites' => $new_nb_reussites,
            ]) or die(print_r($mysqlConnection->errorInfo()));
            $response = [
                'status' => 'success',
                'message' => 'Vous avez mis a jour les stats de votre repertoire',
            ];
            http_response_code(200);
            echo json_encode($response);
        }
        catch (Exception $e)
        {
            die('Erreur : ' . $e->getMessage());
        }
}

?>