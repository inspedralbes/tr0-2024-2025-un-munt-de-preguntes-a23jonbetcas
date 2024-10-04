<?php
session_start();

$data = file_get_contents("./data.json");
$arrayPreguntes = json_decode($data, true); //Converteix l'objecte JSON en array amb les preguntes i respostes
$respostesRebudes = json_decode(file_get_contents('php://input'), true); //obtenim i decodifiquem les respostes enviades per l'usuari

$validacio = new stdClass(); //Creem un objecte per guardar els resultats
$totalResp = count($respostesRebudes); //Comptem les respostes rebudes
$respostaCorrecte = 0;

//iterem sobre les respostes rebudes
foreach ($respostesRebudes as $actual) {
    $idPreg = $actual['pregunta']; //id de la pregunta
    $opcioTriada = $actual['resposta']; //resposta de l'usuari

    //iterem sobre l'array de preguntes
    foreach ($arrayPreguntes['preguntes'] as $pregunta) {
        //Verifica si el id de la pregunta coincideix amb el id de la resposta actual
        if ($pregunta['id'] == $idPreg) {
            //Verifica si la resposta triada coincideix amb la correcta
            if ($pregunta['respostes'][$opcioTriada]['correcta']) {
                $respostaCorrecte++;
            }
        }
    }
}

//Assignem resultats a la validacio
$validacio->correcte = $respostaCorrecte;//guardem el total de respostes correctes
$validacio->totalResp = $totalResp; //guardem el total de respostes

echo json_encode($validacio);
?>