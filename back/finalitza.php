<?php
session_start();

$data = file_get_contents("./data.json");
$arrayPreguntes = json_decode($data, true); // Array amb les preguntes i respostes

$respostesRebudes = json_decode(file_get_contents('php://input'),true);

$validacio = new stdClass();
$totalResp = count($respostesRebudes);
$respostaCorrecte = 0;

foreach ($respostesRebudes as $actual) {
    $idPreg = $actual['pregunta']; //id de la pregunta
    $opcioTriada = $actual['resposta']; //resposta de l'usuari

    foreach ($arrayPreguntes['preguntes'] as $pregunta) {
        if ($pregunta['id'] == $idPreg) {            
            if ($pregunta['respostes'][$opcioTriada]['correcta']) {
                $respostaCorrecte++;
            }
        }
    }
}

//Assignem resultats a la validacio
$validacio->correcte = $respostaCorrecte;
$validacio->totalResp = $totalResp;

echo json_encode($validacio);
?>
