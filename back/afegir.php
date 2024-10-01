<?php
include 'connexio.php';
$data = json_decode(file_get_contents("php://input"), true);

//Insertar la pregunta

//Preparem la consulta SQL
$stmt = $conn->prepare("INSERT INTO preguntes (pregunta, imatge) VALUES (?, ?)"); //Associem parametres
$stmt->bind_param("ss", $data['Pregunta'], $data['Imatge']);// ss es per a string
$stmt->execute();
$pregunta_id = $stmt->insert_id; //guardem el id generat per a la pregunta insertada

//Insertar respostes
foreach ($data['respostes'] as $resposta) {
    $stmt_resposta = $conn->prepare("INSERT INTO respostes (pregunta_id, resposta, correcta) VALUES (?, ?,?)");
    $stmt_resposta->bind_param("isi", $pregunta_id, $resposta['resposta']); //is es per a enter i string
    $stmt_resposta->execute();
    $stmt_resposta->close();
}

$stmt->close();
$conn->close();
echo json_encode(["success" => true, "id" => $pregunta_id]);
?>