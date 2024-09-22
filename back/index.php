<?php
session_start();

// Càrrega del fitxer JSON només si no hi ha preguntes guardades a la sessió
if (!isset($_SESSION['preguntes'])) {
    $data = file_get_contents("./data.json");
    $preguntas = json_decode($data, true);
    
    $preguntas = $preguntas['preguntes'];
    shuffle($preguntas); //Barrejar les preguntes
    $_SESSION['preguntes'] = array_slice($preguntas, 0, 10); //Guardem 10 preguntes a la sessió

    //Inicialitzem l'índex i la puntuació
    $_SESSION['index'] = 0;
    $_SESSION['puntuacio'] = 0;
}

//Agafem l'index i la pregunta actual
$index = $_SESSION['index'];
$preguntes = $_SESSION['preguntes'];
$missatge='';

//Verifiquem si queden preguntes
if ($index < count($preguntes)) {
    $preguntaActual = $preguntes[$index]; //Assignem la pregunta actual segons l'índex
} else {
    //Mostrem el resultat
    echo '<p>Has acabat el qüestionari. Has encertat ' . $_SESSION['puntuacio'] . ' preguntes de ' . count($preguntes) . '.</p>';
    session_destroy(); //Destruim la sessio
    exit(); //Sense aquesta merda el questionari no para
}

//Verifiquem si l'usuari ha enviat una resposta
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['respostaUser'])) {

    $respostaUser = (int)$_POST['respostaUser']; //Resposta de l'usuari
    $respostaCorrecte = false;//Comprovem si la resposta enviada és correcta

    
    foreach ($preguntaActual['respostes'] as $respuesta) {
        if ($respuesta['id'] == $respostaUser) {
            $respostaCorrecte = $respuesta['correcta'];//La resposta es correcta
        }
    }

    if ($respostaCorrecte) {
        $_SESSION['puntuacio']++; //Incrementem la puntuació
        $missatge =  "<p style='color: green;'> Correcte </p>";
    } else {
        $missatge =  "<p style='color: red;'> Incorrecte </p>";        
    }
    $_SESSION['index']++; //Incrementem l'índex per mostrar la següent pregunta
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

<?php 
//Mostrem el missatge si l'usuari ha enviat el formulari
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    echo $missatge; 
}
?>

<?php if (isset($preguntaActual)): ?>
    <form method="post">
        <div class="pregunta">
            <strong>
                <?php echo htmlspecialchars($preguntaActual['pregunta']); //Imprimim la pregunta ?>
            <br><br>
            </strong>
            <?php foreach ($preguntaActual['respostes'] as $respuesta) { 
                //Imprimim les respostes
                echo '<div>';
                echo '<input type="radio" name="respostaUser" value="' . htmlspecialchars($respuesta['id']) . '">';
                echo htmlspecialchars($respuesta['resposta']);
                echo '</div><br>';
            } 
            ?>
        </div>
        <button type="submit"> Enviar Resposta </button>
    </form>
<?php endif; ?>

</body>
</html>
