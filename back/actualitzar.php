<?php

include 'connexio.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'], $data['pregunta'], $data['imatge'], $data['respostes'], $data['correcta'])) {

    $id = $data['id'];
    $pregunta = $data['pregunta'];
    $imatge = $data['imatge'];

    $stmt = $conn->prepare("UPDATE preguntes SET pregunta = ?, imatge = ? WHERE id = ?");
    $stmt->bind_param("ssi", $pregunta, $imatge, $id);
    $stmt->execute();

    foreach ($data['respostes'] as $resposta) {

        $correcta = $resposta['correcta'] ? 1 : 0; //convertim la correcta en un enter
        $stmt_resposta = $conn->prepare("UPDATE respostes SET resposta = ?, correcta = ? WHERE id = ?");
        $stmt_resposta->bind_param("sii", $resposta['resposta'], $correcta, $resposta['id']);
        $stmt_resposta->execute();
    }

    $stmt->close();
    $conn->close();

    echo json_encode(['status' => 'success', 'message' => 'Pregunta y respuestas actualizadas correctamente.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Faltan datos en la solicitud.']);
}
