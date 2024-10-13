<?php
session_start();
header('Content-Type: application/json');

include 'connexio.php';
$preguntes = [];

/*
https://www.php.net/manual/es/book.mysqli.php
https://es.stackoverflow.com/questions/436644/como-guardar-todos-los-datos-de-una-consulta-de-mysql-en-un-array-de-php
https://programacionymas.com/blog/como-funciona-inner-left-right-full-join */

/*
Assignem el ID de la pregunta a pregunta_id, llavors seleccionem la pregunta, imatge i respostes associades.Assignem el ID de la resposta a resposta_id, 
llavors seleccionem la resposta. Amb el left join podem unir les taules preguntes i respostes,
aixo vol dir que es seleccionen tots els elements de la taula preguntes i registres que estiguin units per l'id de la taula respostes.
el p.id = r.pregunta_id especifica la condicio de la unio, on la id de la pregunta a la taula preguntes ha de coincidir amb el pregunta_id a respostes
Aixi t'estalvies d'haver de fer dos selects per a les preguntes i les respostes*/

$consulta = "SELECT p.id AS pregunta_id, p.pregunta, p.imatge, r.id AS resposta_id, r.resposta
        FROM preguntes p
        LEFT JOIN respostes r ON p.id = r.pregunta_id";

//executar la consulta
$resultat = mysqli_query($conn, $consulta);

/*
Comprovem si la pregunta ja ha estat afegida a l'array $preguntes fent us del seu id,
si no existeix es crea un array per a la pregunta amb els seus respectius camps
*/
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

shuffle($preguntes); //Barrejem aleatoriament l'ordre de preguntes de l'array

//https://www.php.net/manual/es/function.array-values.php
$preguntes = array_values($preguntes);
$conn->close();

echo json_encode($preguntes);
?>