<?php
include("includes/conn.php");
session_start();

if (isset($_SESSION['quiz_completed']) && $_SESSION['quiz_completed']) {
    echo json_encode(['error' => 'Quiz completed!']);
    exit;
}

if (!isset($_SESSION['session_number'])) {
    $_SESSION['session_number'] = 1; // Start with Session 1
}

if (!isset($_SESSION['difficulty_level'])) {
    $_SESSION['difficulty_level'] = 1; // Start at difficulty level 1
}

$sessionNumber = $_SESSION['session_number'];
$difficultyLevel = $_SESSION['difficulty_level'];

// Retrieve the question for the current session and difficulty level
$query = $conn->prepare("
    SELECT id, question, option_a, option_b, option_c, option_d, correct_answer 
    FROM questions 
    WHERE session = ? AND difficulty_level = ? 
    LIMIT 1
");
$query->bind_param("ii", $sessionNumber, $difficultyLevel);
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
        'correct_answer' => $correctAnswer,
        'difficulty_level' => $difficultyLevel,
        'session' => $sessionNumber
    ]);

    // Increment difficulty level for the next question
    $_SESSION['difficulty_level']++;
} else {
    // No more questions for the current difficulty level
    echo json_encode(['error' => 'No more questions in this session.']);
}

$query->close();
?>
