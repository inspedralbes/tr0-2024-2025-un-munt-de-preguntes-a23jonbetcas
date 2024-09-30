<?php
$servidor = "localhost";
$usuari = "root";
$contrasenya = "";
$base_datos = "muntPreguntes";//BBDD

//creem la connexio
$conn = new mysqli($servidor, $usuari, $contrasenya, $base_datos);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>
