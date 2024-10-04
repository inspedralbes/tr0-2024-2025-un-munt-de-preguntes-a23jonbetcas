<?php
session_start();

include("connexio.php");
$respostesRebudes = json_decode(file_get_contents('php://input'), true);


/*
Creem un objecte buit per guardar el resultat, calculem el nombre total de respostes rebudes 
i un comptador de respostes correctes.
*/
$validacio = new stdClass();
$totalResp = count($respostesRebudes);
$respostaCorrecte = 0;
$consulta = "
    SELECT p.id AS pregunta_id, r.resposta, r.correcta 
    FROM preguntes p
    LEFT JOIN respostes r ON p.id = r.pregunta_id";

$resultat = mysqli_query($conn, $consulta);

//Verificar la consulta
if (!$resultat) {
    die("Error en la consulta: " . mysqli_error($conn));
}
//Creem l'array per a les respostes correctes
$arrayRespostes = [];

//Iterem sobre els resultats de la consulta
while ($row = mysqli_fetch_assoc($resultat)) {
    //Guardem cada resposta junta amb si es correcta o no
    $arrayRespostes[$row['pregunta_id']][] = [
        'resposta' => $row['resposta'],
        'correcta' => $row['correcta'] //Amb el bool asegurem que es boolean
    ];
}
//validem les respostes rebudes
foreach ($respostesRebudes as $actual) {
    $idPreg =  $actual['pregunta']; //id de la pregunta
    $indexRes = $actual['resposta']; //id de la resposta
    //verifiquem si la resposta triada coincideix amb la correcta
    $respostaCorrecte += $arrayRespostes[$idPreg][$indexRes]['correcta'] ?? 0;
}

$validacio->correcte = $respostaCorrecte;
$validacio->totalResp = $totalResp;

// Devolver la respuesta como JSON
echo json_encode($validacio);
?>