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

    /*Agafem la taula preguntes per a actualitzarla i especifiquem que volem canviar els valors
     pregunta i imatge amb la fila on coincideixi el id que li hem passat*/
    $stmt = $conn->prepare("UPDATE preguntes SET pregunta = ?, imatge = ? WHERE id = ?");
    $stmt->bind_param("ssi", $pregunta, $imatge, $idPregunta);

    //Si ha actualitzat la pregunta, passem a les respostes
    if ($stmt->execute()) {
        foreach ($respostes as $resposta) {
            $idResposta = $resposta['id'];
            $respostaText = $resposta['resposta'];
            $correcta = $resposta['correcta'] ? 1 : 0;

            /*Volem canviar els valors de les columnes resposta i correcta, especifiquem quina fila de la taula respostes
            volem actualitzar i actualitzara la columna id que coincideixi amb el id de la taula preguntes (pregunta_id)             
             */
            $stmt_resposta = $conn->prepare("UPDATE respostes SET resposta = ?, correcta = ? WHERE id = ? AND pregunta_id = ?");
            $stmt_resposta->bind_param("siii", $respostaText, $correcta, $idResposta, $idPregunta);
        }
        $stmt->close();
        $stmt_resposta->close();
        $conn->close();
    }
} else {
    error_log('Falten dades a la solicitud: ' . print_r($data, true));
    echo json_encode(['status' => 'error', 'message' => 'Falten dades a la solicitud.']);
}

?>