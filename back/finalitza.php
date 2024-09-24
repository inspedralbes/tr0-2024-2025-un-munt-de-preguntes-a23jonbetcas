<?php
session_start();

$respostesCorrectes = 0;
$totalRespostes = count($_SESSION['preguntes']);

foreach($_POST['respostes'] as $index => $respostaID) {
if($_SESSION['preguntes'][$index]['respostes'][$respostaID]['correcta']) {
    $respostesCorrectes++;
    }
}

echo json_encode([
    'totalResp' => $totalRespostes,
    'totalCorrectes' => $respostesCorrectes
    ]);
?>