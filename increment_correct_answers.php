<?php
session_start();


if (!isset($_SESSION['correct_answers'])) {
    $_SESSION['correct_answers'] = 0;
}

$_SESSION['correct_answers'] += 1;

// Check if the quiz is completed (15 correct answers)
if ($_SESSION['correct_answers'] >= 15) {
    $_SESSION['quiz_completed'] = true;
} else {
    $_SESSION['quiz_completed'] = false;
}

header('Content-Type: application/json');
echo json_encode(['correct_answers' => $_SESSION['correct_answers']]);
?>
