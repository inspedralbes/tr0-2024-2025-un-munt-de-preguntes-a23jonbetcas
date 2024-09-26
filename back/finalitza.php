<?php
session_start();

$data = json_decode(file_get_contents('php://input'));

$totalRespostes = count($data);
$correctes = 0;


<?php
session_start();

$data = json_decode(file_get_contents('php://input'));

$totalRespostes = count($data);
$correctes = 0;
$validacio= new stdClass();

foreach($preguntes as $pregunta){
    foreach($pregunta['respostes'] as $resposta){
    if($resposta['correcta'] == true){
        $validacio->{$pregunta['id']} = $resposta['id'];
        }
    }
}

foreach ($data as $resp) {
    $idPregunta = $resp['pregunta']; //idPregunta
    $idResposta = $resp['resposta']; //idResposta
}


$validacio->totalRespostes = $totalRespostes;
$validacio->correctes = $correctes;



$validacio->iddelapregunta = "pepe";
$validacio->iddelaporonga = "pepo";
$enelarray = $validacio

un objecte amb dos elements. Nombre total de respostes, i nombre de respostes correctes.



?>