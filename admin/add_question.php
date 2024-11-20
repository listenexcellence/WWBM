<?php
include("../includes/conn.php");


if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $question = $_POST['question'];
    $option_a = $_POST['option_a'];
    $option_b = $_POST['option_b'];
    $option_c = $_POST['option_c'];
    $option_d = $_POST['option_d'];
    $correct_answer = $_POST['correct_answer'];
    $difficulty_level = $_POST['difficulty_level'];


    $session = $_POST['session'];

    $stmt = $conn->prepare("INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer, difficulty_level, session) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssii", $question, $option_a, $option_b, $option_c, $option_d, $correct_answer, $difficulty_level, $session);

    if ($stmt->execute()) {
        echo "<p>Question added successfully!</p>";
    } else {
        echo "<p>Error adding question: " . $stmt->error . "</p>";
    }

    $stmt->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add New Question</title>
</head>
<body>
    <h2>Add a New Question</h2>
    <form action="#" method="POST">
        <label for="question">Question:</label><br>
        <textarea id="question" name="question" required></textarea><br><br>
        
        <label for="option_a">Option A:</label><br>
        <input type="text" id="option_a" name="option_a" required><br><br>
        
        <label for="option_b">Option B:</label><br>
        <input type="text" id="option_b" name="option_b" required><br><br>
        
        <label for="option_c">Option C:</label><br>
        <input type="text" id="option_c" name="option_c" required><br><br>
        
        <label for="option_d">Option D:</label><br>
        <input type="text" id="option_d" name="option_d" required><br><br>
        
        <label for="correct_answer">Correct Answer:</label><br>
        <select id="correct_answer" name="correct_answer" required>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
        </select><br><br>
        
        <label for="difficulty_level">Difficulty Level:</label><br>
        <input type="number" id="difficulty_level" name="difficulty_level" min="1" max="15" value="1" required><br><br>
        <label for="session">Session:</label><br>
<select id="session" name="session" required>
    <option value="1">Session 1</option>
    <option value="2">Session 2</option>
    <option value="3">Session 3</option>
    <option value="4">Session 4</option>
</select><br><br>

        
        <input type="submit" value="Add Question">
    </form>


</body>
</html>
