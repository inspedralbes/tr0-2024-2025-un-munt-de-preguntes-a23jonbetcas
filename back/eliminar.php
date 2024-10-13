<?php
include 'connexio.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'])) {
    $pregunta_id = $data['id'];

    //Eliminem les respostes que te cada pregunta primer
    $sql_respostes = "DELETE FROM respostes WHERE pregunta_id = '$pregunta_id'";

    if (mysqli_query($conn, $sql_respostes)) {
        //Si s'han eliminat les respostes, esborrem la pregunta
        $sql_pregunta = "DELETE FROM preguntes WHERE id = '$pregunta_id'";

        if (mysqli_query($conn, $sql_pregunta)) {
            echo json_encode(["success" => true, "message" => "Pregunta eliminada correctament."]);
        } else {
            echo json_encode(["success" => false, "message" => "No s'ha pogut eliminar la pregunta."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "No s'han trobat respostes per eliminar."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "ID de pregunta no especificat."]);
}

$conn->close();
?>