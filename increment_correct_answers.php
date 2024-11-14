<?php
session_start();


if (!isset($_SESSION['correct_answers'])) {
    $_SESSION['correct_answers'] = 0;
}

$_SESSION['correct_answers'] += 1;


header('Content-Type: application/json');
echo json_encode(['correct_answers' => $_SESSION['correct_answers']]);
?>
