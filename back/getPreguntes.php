<?php
session_start();

header('Content-Type: application/json');

/*
https://www.php.net/manual/es/function.define.php
provar a fer servir el define en el $numPreguntes
*/


//Carreguem el JSON
$data = file_get_contents("./data.json");
$arrayPreguntes = json_decode($data, true); //Array amb les preguntes i respostes

$numPreguntes = json_decode(file_get_contents('php://input'), true)['count'] ?? 10; //Quantitat de preguntes que volem agafar. Per defecte agafem 10 preguntes
shuffle($arrayPreguntes['preguntes']); //Barrejar les preguntes

//Agafem les preguntes seleccionades
$preguntesEscollides = array_slice($arrayPreguntes['preguntes'], 0, $numPreguntes);
$preguntes = []; //Array per guardar les preguntes

//Iterem sobre les preguntes
foreach ($preguntesEscollides as $pregunta) {
    $respostesPregunta = []; //Array per guardar les respostes de la pregunta
    foreach ($pregunta['respostes'] as $resposta) {
        //Creem un array amb el id de la resposta, la resposta i si es correcta o no
        $respostesPregunta[] = array(
            'id' => $resposta['id'], //id de la resposta
            'resposta' => $resposta['resposta'], //resposta
            'correcta' => $resposta['correcta'], //si és correcta o no
        );
    }
    //despres de tenir totes les respostes de la pregunta iterada, construim un array que representa el total de la pregunta i les seves respostes
    $preguntes[] = array(
        'id' => $pregunta['id'], //Id de la pregunta
        'pregunta' => $pregunta['pregunta'], //Pregunta
        'respostes' => $respostesPregunta, //Respostes
        'imatge' => isset($pregunta['imatge']) ? $pregunta['imatge'] : null, //Imatge, si existeix, no tenia ni idea de com fer-ho
    );
}

//Aquest fitxer recull l'array i les envia al fitxer de js (front)
echo json_encode($preguntes);
?>
