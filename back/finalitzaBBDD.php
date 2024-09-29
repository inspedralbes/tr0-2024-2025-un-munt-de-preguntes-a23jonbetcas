<?php
session_start();

include("connexio.php");
$respostesRebudes = json_decode(file_get_contents('php://input'), true); //obtenim i decodifiquem les respostes enviades per l'usuari

$validacio = new stdClass(); //Creem un objecte per guardar els resultats
$totalResp = count($respostesRebudes); //Comptem les respostes rebudes
$respostaCorrecte = 0;

//Consultem les preguntes i respostes desde la bbdd
$consulta = "SELECT id, pregunta, resposta FROM preguntes";
$resultat = mysqli_query($con, $consulta);

$arrayPreguntes = [];

//iterem a traves dels resultats
while ($row = mysqli_fetch_array($resultat)) {
    $arrayPreguntes[$row['id']] = [
        'respostes' => $row['respostes'], //Guardem les respostes
        'resposta_correcta' => $row['resposta_correcta'] //Guardem la correcta
    ];   
}

//validem si es correcta o no
foreach ($respostesRebudes as $actual) {
    $idPreg = $actual['pregunta']; //id de la pregunta
    $opcioTriada = $actual['resposta']; //resposta de l'usuari

    if ($arrayPreguntes[$idPreg]['resposta_correcta'] == $opcioTriada) {
        $respostaCorrecte++; // Incrementa el contador si la respuesta es correcta
    }
}

//Assignem resultats a la validacio
$validacio->correcte = $respostaCorrecte;//guardem el total de respostes correctes
$validacio->totalResp = $totalResp; //guardem el total de respostes

echo json_encode($validacio);
?>