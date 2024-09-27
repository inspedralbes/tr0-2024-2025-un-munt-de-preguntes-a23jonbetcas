<?php
session_start();

$data = file_get_contents("./data.json");
$arrayPreguntes = json_decode($data, true); //Array amb les preguntes i respostes

$respostesRebudes = json_decode(file_get_contents('php://input'));

$validacio= new stdClass();
$totalResp =count($respostesRebudes);
$respostaCorrecte = 0;

foreach($respostesRebudes as $actual) { 
    
    $idPreg = $actual['id_pregunta'];
    $opcioTriada = $actual['resposta'];
    
    foreach($arrayPreguntes['preguntes']as $pregunta){
        if($pregunta['id'] == $preguntaId){
            foreach($pregunta['respostes'] as $resp){
                if($resp['resposta']==$opcioTriada && $opcioTriada['correcta']){
                    $respostaCorrecte++;
                }
            }
        }
        echo "Pregunta ID: " . $idPreg . "<br>";
    echo "Resposta donada: " . $opcioTriada . "<br>";
    }
    
    //ITERNAT I VAIG MIRANT PER CADA RESPOSTA REBUDA SI ES CORRECTA
   /* echo($actual->pregunta);
    echo("<br>diu  que es <br>");
    echo($actual->resposta);
    */
  }

  $validacio -> correcte = $respostaCorrecte;
  $validacio -> totalResp = $totalResp;
  


echo json_encode($validacio); 

/*
finalitza.php
Paràmetre d'entrada: un array d'enters amb els índexs de les respostes.
Paràmetre de sortida: un objecte amb dos elements. Nombre total de respostes, i nombre de respostes correctes.
*/

?>

