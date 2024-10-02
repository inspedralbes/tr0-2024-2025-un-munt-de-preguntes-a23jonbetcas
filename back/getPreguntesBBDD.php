<?php
session_start();
header('Content-Type: application/json');

include 'connexio.php';
$preguntes = [];

/*
https://www.php.net/manual/es/book.mysqli.php
https://es.stackoverflow.com/questions/436644/como-guardar-todos-los-datos-de-una-consulta-de-mysql-en-un-array-de-php
https://programacionymas.com/blog/como-funciona-inner-left-right-full-join

Escollim les columnes que volem de la taula, obtenim l'id i text de cada pregunta,
i els id i text de les respostes associades, amb el LEFT JOIN unim les taules que estan unides per el id de la pregunta
 */
$consulta = "SELECT p.id AS pregunta_id, p.pregunta, p.imatge, r.id AS resposta_id, r.resposta
        FROM preguntes p
        LEFT JOIN respostes r ON p.id = r.pregunta_id";

//executar la consulta
$resultat = mysqli_query($conn, $consulta);

if ($resultat) {
    //iterem a traves dels resultats
    while ($row = $resultat->fetch_assoc()) {
        //Comprovem primer si la pregunta es repeteix
        if (!isset($preguntes[$row['pregunta_id']])) {
            //Creem un objecte per a cada pregunta
            $preguntes[$row['pregunta_id']] = [
                'id' => $row['pregunta_id'], //id de la pregunta
                'pregunta' => $row['pregunta'], //text de la pregunta
                'imatge' => $row['imatge'],
                'respostes' => [] //Fem el array de les respostes com al getPreguntes
            ];
        }
        //Afegim la resposta a l'array
        if ($row['resposta_id']) {
            $preguntes[$row['pregunta_id']]['respostes'][] = [
                'id' => $row['resposta_id'], //id de la resposta
                'resposta' => $row['resposta'] //text de la resposta
            ];
        }
    }
}

//https://www.php.net/manual/es/function.array-values.php
$preguntes = array_values($preguntes);
$conn->close();

echo json_encode($preguntes);
?>