<?php
session_start();

// Càrrega del fitxer JSON només si no hi ha preguntes guardades a la sessió
if (!isset($_SESSION['preguntes'])) {
    // Carregar l'arxiu JSON
    $data = file_get_contents("./data.json");
    $preguntas = json_decode($data, true);
    
    $preguntas = $preguntas['preguntes'];
    shuffle($preguntas); //Barregem les preguntes
    $_SESSION['preguntes'] = array_slice($preguntas, 0, 10); //Guardem 10 preguntes a la sessió

    //Inicialitzem l'índex i la puntuació
    $_SESSION['index'] = 0;
    $_SESSION['puntuacio'] = 0;
}

//Agafem l'index i la pregunta actual
$index = $_SESSION['index'];
$preguntes = $_SESSION['preguntes'];

//Verifiquem si queden preguntes
if ($index < count($preguntes)) {
    $preguntaActual = $preguntes[$index]; // Assignem la pregunta actual segons l'índex
} else {
    //Mostrem el resultat
    echo '<p>Has acabat el qüestionari. Has encertat ' . $_SESSION['puntuacio'] . ' preguntes de ' . count($preguntes) . '.</p>';
    session_destroy(); // Destruim la sessio
    exit(); //Sense aquesta merda el questionari no para
}

//Verifiquem si l'usuari ha enviat una resposta
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['respostaUser'])) {
    //Resposta de l'usuari
    $respostaUser = $_POST['respostaUser']; 

    //Comprovem si la resposta enviada és correcta
    $respostaCorrecte = false;
    foreach ($preguntaActual['respostes'] as $respuesta) {
        if ($respuesta['id'] == $respostaUser) {
            //La resposta es correcta
            $respostaCorrecte = $respuesta['correcta'];
            break;
        }
    }
    //Incrementem la puntuacio si es correcte
    if ($respostaCorrecte) {
        $_SESSION['puntuacio']++; // Incrementem la puntuació
    }
    //Incrementem l'índex per mostrar la següent pregunta
    $_SESSION['index']++;

}
?>

<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz</title>
</head>
<body>
<h1>Quiz</h1>

<?php if (isset($preguntaActual)): ?>
    <form method="post">
        <div class="pregunta">
            <?php echo htmlspecialchars($preguntaActual['pregunta']); ?><br>
            <?php foreach ($preguntaActual['respostes'] as $respuesta): ?>
                <label>
                    <input type="radio" name="respostaUser" value="<?php echo htmlspecialchars($respuesta['id']); ?>">
                    <?php echo htmlspecialchars($respuesta['resposta']); ?>
                </label><br>
            <?php endforeach; ?>
        </div>
        <button type="submit">Enviar Resposta</button>
    </form>
<?php endif; ?>

</body>
</html>
