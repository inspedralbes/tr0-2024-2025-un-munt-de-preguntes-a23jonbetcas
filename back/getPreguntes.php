<?php
session_start();

//chuminada per a que quan fem f5 reinicii la sessio
if (isset($_SESSION['preguntes'])) {
    session_unset();
    session_destroy();
    session_start();
}

header('Content-Type: application/json');

//Carreguem el JSON
$data = file_get_contents("./data.json");
$arrayPreguntes = json_decode($data, true); //Array amb les preguntes i respostes

$_SESSION['preguntes'] = generarPreguntes($arrayPreguntes); //generem les preguntes en una sessio nova

function generarPreguntes($arrayPreguntes)
{
    shuffle($arrayPreguntes['preguntes']); //barrejem totes les preguntes del JSON
    $preguntes = []; //array per guardar-les

    //Iterem sobre les preguntes
    foreach ($arrayPreguntes['preguntes'] as $pregunta) {
        $respostesPregunta = []; //Array per guardar les respostes de la pregunta
        foreach ($pregunta['respostes'] as $resposta) {
            //Creem un array amb el id de la resposta i la resposta
            $respostesPregunta[] = array(
                'id' => $resposta['id'], //id de la resposta
                'resposta' => $resposta['resposta'], //resposta
            );
        }
        //Després de tenir totes les respostes de la pregunta iterada, construim un array que representa el total de la pregunta i les seves respostes
        $preguntes[] = array(
            'id' => $pregunta['id'], //Id de la pregunta
            'pregunta' => $pregunta['pregunta'], //Pregunta
            'respostes' => $respostesPregunta, //Respostes
            //'imatge' => isset($pregunta['imatge']) ? $pregunta['imatge'] : null, // Imatge, si existeix
        );
    }

    return $preguntes; //Retorna totes les preguntes generades
}

// Aquest fitxer recull l'array i les envia al fitxer de js (front)
echo json_encode($_SESSION['preguntes']);
?>