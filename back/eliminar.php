<?php
include 'connexio.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'])) {
    $pregunta_id = $data['id'];

    //eliminem primer les respostes associades a la pregunta
    $sql_respostes = "DELETE FROM respostes WHERE pregunta_id = '$pregunta_id'";
    
    if (mysqli_query($conn, $sql_respostes)) {
        //i despres la pregunta
        $sql_pregunta = "DELETE FROM preguntes WHERE id = '$pregunta_id'";
        mysqli_query($conn, $sql_pregunta);
    }
}

$conn->close();
?>
