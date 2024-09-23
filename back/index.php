<?php
session_start();


// Càrrega del fitxer JSON només si no hi ha preguntes guardades a la sessió
if (!isset($_SESSION['preguntes'])) {
    $data = file_get_contents("./data.json");
    $preguntas = json_decode($data, true);
    
    $preguntas = $preguntas['preguntes'];
    shuffle($preguntas); //Barrejar les preguntes
    $deuPreguntes = array_slice($preguntas, 0, 10); //agafem 

    if(!isset($_SESSION['preguntes'])){
        $_SESSION['preguntes']= $deuPreguntes;
        $_SESSION['index'] = 0; //Iniciem l'index
        $_SESSION['puntuacio'] = 0; //Iniciem la puntuació
    }
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
    echo '<p>Has encertat ' .$_SESSION['puntuacio'].' preguntes de '.count($preguntes).'.</p>';
    echo '<form method="post"> <button type="submit" name="reiniciar"> Tornar a jugar </button></form>';
    session_destroy(); //Destruim la sessio
    exit(); //Sense aquesta merda el questionari no para
}
  
if (isset($_POST['respostaUser'])) {
$respostaUser = $_POST['respostaUser']; //Agafem la resposta de l'usuari
$respostaCorrecte = false; //Inicialitzem la variable

//Comprovem si la resposta es correcta
for ($i = 0; $i < count($preguntaActual['respostes']); $i++) {  
    if ($preguntaActual['respostes'][$i]['id'] == $respostaUser) {
        $respostaCorrecte = $preguntaActual['respostes'][$i]['correcta'];
    }
}

//Comprovem si la resposta es correcta o incorrecta
if ($respostaCorrecte) {
    $_SESSION['puntuacio']++; //Afegim +1 a la puntuació
    $missatge = "<p style='color: green;'> Correcte </p>";
} else {
    $missatge = "<p style='color: red;'> Incorrecte </p>";        
}
$_SESSION['index']++; //Passem a la seguent pregunta
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
            <strong>
                <?php echo htmlspecialchars($preguntaActual['pregunta']); //Imprimim la pregunta ?>
            <br><br>
            </strong>
            <?php foreach ($preguntaActual['respostes'] as $respuesta) { 
                //Imprimim les respostes
                echo '<div>';
                echo '<input type="radio" name="respostaUser" value="' .htmlspecialchars($respuesta['id']). '">';
                echo htmlspecialchars($respuesta['resposta']);
                echo '</div><br>';
            } 
            ?>
            <?php echo $missatge; ?>
        </div>
        <button type="submit"> Enviar Resposta </button>
    </form>
<?php endif;echo $index; ?>

</body>
</html>
