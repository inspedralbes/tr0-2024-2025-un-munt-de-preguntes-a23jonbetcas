<?php
session_start();
header('Content-Type: application/json');

include "connexio.php";
//Cargar el JSON
$data = file_get_contents("./data.json");
$arrayPreguntes = json_decode($data, true); //Converteix l'objecte JSON en array amb les preguntes i respostes

//Insertar preguntes
foreach ($data['preguntes'] as $pregunta) {
    $pregunta_id = $pregunta['id'];
    $textPregunta = mysqli_real_escape_string($conn, $pregunta['pregunta']);
    $imatge = $pregunta['imatge'];

    $sql = "INSERT INTO preguntes (id, pregunta, imatge) VALUES ('$pregunta_id', '$textPregunta', '$imatge')";

    if (mysqli_query($conn, $sql)) {
        //Insertar respostes
        foreach ($pregunta['respostes'] as $resposta) {
            $resposta_id = $resposta['id'];
            //https://www.php.net/manual/en/mysqli.real-escape-string.php
            $textResposta = mysqli_real_escape_string($conn, $resposta['resposta']);
            $correcta = $resposta['correcta'] ? 1 : 0;

            $sql_resposta = "INSERT INTO respostes (id, pregunta_id, resposta, correcta) VALUES ('$resposta_id', '$pregunta_id', '$textResposta', '$correcta')";
            mysqli_query($conn, $sql_resposta);
        }
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }
}

echo "Importat correctament.";
mysqli_close($conn);
?>
