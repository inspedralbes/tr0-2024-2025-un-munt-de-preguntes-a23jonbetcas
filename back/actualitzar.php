<?php
include 'connexio.php';
$data = json_decode(file_get_contents("php://input"), true);

error_log(print_r($data, true));

if (isset($data['id'], $data['pregunta'], $data['imatge'], $data['respostes'])) {
    //guardem les dades
    $idPregunta = $data['id'];
    $pregunta = $data['pregunta'];
    $imatge = $data['imatge'];
    $respostes = $data['respostes'];

    //Primer actualitzem la taula preguntes
    $stmt = $conn->prepare("UPDATE preguntes SET pregunta = ?, imatge = ? WHERE id = ?");
    $stmt->bind_param("ssi", $pregunta, $imatge, $idPregunta);

    //Si ha actualitzat la pregunta, passem a les respostes
    if ($stmt->execute()) {
        foreach ($respostes as $resposta) {
            $idResposta = $resposta['id'];
            $respostaText = $resposta['resposta'];
            $correcta = $resposta['correcta'] ? 1 : 0;

            $stmt_resposta = $conn->prepare("UPDATE respostes SET resposta = ?, correcta = ? WHERE id = ? AND pregunta_id = ?");
            $stmt_resposta->bind_param("siii", $respostaText, $correcta, $idResposta, $idPregunta);

            if (!$stmt_resposta->execute()) {
                echo json_encode(['status' => 'error', 'message' => 'Error al actualizar la respuesta con ID: ' . $idResposta]);
                exit;
            }
        }
        $stmt->close();
        $stmt_resposta->close();
        $conn->close();
        echo json_encode(['status' => 'success', 'message' => 'Preguntes i respostes actualitzats correctament.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error al actualitzar la pregunta.']);
    }
} else {
    // Si faltan datos en la solicitud, devolver un mensaje de error
    error_log('Falten dades a la solicitud: ' . print_r($data, true));
    echo json_encode(['status' => 'error', 'message' => 'Falten dades a la solicitud.']);
}

?>