<?php
include("includes/conn.php");

session_start();
if (!isset($_SESSION['correct_answers'])) {
    $_SESSION['correct_answers'] = 0;
}

$correctAnswers = $_SESSION['correct_answers'];
$query = $conn->prepare("SELECT id, question, option_a, option_b, option_c, option_d, correct_answer FROM questions ORDER BY RAND() LIMIT 1");
$query->execute();
$query->store_result();

if ($query->num_rows > 0) {

    $query->bind_result($id, $question, $optionA, $optionB, $optionC, $optionD, $correctAnswer);
    $query->fetch();

    echo json_encode([
        'id' => $id,
        'question' => $question,
        'option_a' => $optionA,
        'option_b' => $optionB,
        'option_c' => $optionC,
        'option_d' => $optionD,
        'correct_answer' => $correctAnswer
    ]);
} else {

    echo json_encode(['error' => 'No question found.']);
}

$query->close();
?>
