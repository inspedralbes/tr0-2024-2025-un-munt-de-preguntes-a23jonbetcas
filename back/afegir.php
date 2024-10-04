<?php
include 'connexio.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents("php://input"), true);

//Insertar la pregunta

//'i' per a enter i 's' per a string
//Preparem la consulta SQL
$stmt = $conn->prepare("INSERT INTO preguntes (pregunta, imatge) VALUES (?, ?)"); //Associem parametres
$stmt->bind_param("ss", $data['Pregunta'], $data['Imatge']);
$stmt->execute();
$pregunta_id = $stmt->insert_id; //guardem el id generat per a la pregunta insertada

//Insertar respostes
foreach ($data['respostes'] as $resposta) {
    $stmt_resposta = $conn->prepare("INSERT INTO respostes (pregunta_id, resposta, correcta) VALUES (?, ?,?)");
    $stmt_resposta->bind_param("isi", $pregunta_id, $resposta['resposta'],$resposta['correcta']);
    $stmt_resposta->execute();
    $stmt_resposta->close();
}

$stmt->close();
$conn->close();
echo json_encode(["success" => true, "id" => $pregunta_id]);
?>