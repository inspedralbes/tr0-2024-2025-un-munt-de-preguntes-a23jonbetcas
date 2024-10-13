<?php
$servidor = "localhost";
$usuari = "a23jonbetcas_a";
$contrasenya = "123456aB";
$base_datos = "a23jonbetcas_a";//BBDD

//creem la connexio
$conn = new mysqli($servidor, $usuari, $contrasenya, $base_datos);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

if (!$conn) {
    die("Conexión fallida: " . mysqli_connect_error());
}

?>
