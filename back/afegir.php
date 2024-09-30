<?php
include 'connexio.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['Pregunta'], $data['Imatge'], $data['respostes'])) {
    $pregunta = $data['Pregunta'];
    $imatge = $data['Imatge'];

    $sql = "INSERT INTO preguntes (pregunta, imatge) VALUES ('$pregunta', '$imatge')";
    
    if (mysqli_query($conn, $sql)) {
        $pregunta_id = mysqli_insert_id($conn);
        foreach ($data['respostes'] as $resposta) {
            $respostaPregunta = $resposta['resposta'];
            $sql_resposta = "INSERT INTO respostes (pregunta_id, resposta) VALUES ('$pregunta_id', '$respostaPregunta')";
            mysqli_query($conn, $sql_resposta);
        }
    }
}
$conn->close();
?>
