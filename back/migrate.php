<?php
include("connexio.php");    


//Cargar el JSON
$data = file_get_contents("./data.json");
$arrayPreguntes = json_decode($data, true); //Converteix l'objecte JSON en array amb les preguntes i respostes
print_r($arrayPreguntes);

//Insertar preguntes
foreach ($arrayPreguntes['preguntes'] as $pregunta) {
    $textPregunta = mysqli_real_escape_string($conn, $pregunta['pregunta']);
    $imatge = $pregunta['imatge'];

    $sql = "INSERT INTO preguntes (pregunta, imatge) VALUES ('$textPregunta', '$imatge')";

    if (mysqli_query($conn, $sql)) {
        $pregunta_id = mysqli_insert_id($conn);
        //Insertar respostes
        foreach ($pregunta['respostes'] as $resposta) {
            //https://www.php.net/manual/en/mysqli.real-escape-string.php
            $textResposta = mysqli_real_escape_string($conn, $resposta['resposta']);
            $correcta = $resposta['correcta'] ? 1 : 0;

            $sql_resposta = "INSERT INTO respostes (pregunta_id, resposta, correcta) VALUES ('$pregunta_id', '$textResposta', '$correcta')";
            mysqli_query($conn, $sql_resposta);
        }
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }
}

echo "Importat correctament.";
mysqli_close($conn);
                                                                                                                                                                                                                               
?>
