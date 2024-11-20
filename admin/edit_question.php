<?php
include("../includes/conn.php");

// Check if a question ID is provided for editing
if (isset($_GET['id'])) {
    $question_id = $_GET['id'];

    // Fetch the question details
    $stmt = $conn->prepare("SELECT * FROM questions WHERE id = ?");
    $stmt->bind_param("i", $question_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $question_data = $result->fetch_assoc();
    $stmt->close();

    if (!$question_data) {
        die("<p>Question not found!</p>");
    }
} else {
    die("<p>No question ID provided!</p>");
}

// Handle form submission for updating the question
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $question = $_POST['question'];
    $option_a = $_POST['option_a'];
    $option_b = $_POST['option_b'];
    $option_c = $_POST['option_c'];
    $option_d = $_POST['option_d'];
    $correct_answer = $_POST['correct_answer'];
    $difficulty_level = $_POST['difficulty_level'];
    $session = $_POST['session'];

    // Update the question in the database
    $stmt = $conn->prepare("UPDATE questions SET question = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_answer = ?, difficulty_level = ?, session = ? WHERE id = ?");
    $stmt->bind_param("ssssssiii", $question, $option_a, $option_b, $option_c, $option_d, $correct_answer, $difficulty_level, $session, $question_id);

    if ($stmt->execute()) {
        echo "<p>Question updated successfully!</p>";
    } else {
        echo "<p>Error updating question: " . $stmt->error . "</p>";
    }

    header("Location: view_questions.php");
    $stmt->close();
}
$conn->close();
?>



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Question</title>
</head>
<body>
    <h2>Edit Question</h2>
    <form action="#" method="POST">
        <label for="question">Question:</label><br>
        <textarea id="question" name="question" required><?= htmlspecialchars($question_data['question']); ?></textarea><br><br>
        
        <label for="option_a">Option A:</label><br>
        <input type="text" id="option_a" name="option_a" value="<?= htmlspecialchars($question_data['option_a']); ?>" required><br><br>
        
        <label for="option_b">Option B:</label><br>
        <input type="text" id="option_b" name="option_b" value="<?= htmlspecialchars($question_data['option_b']); ?>" required><br><br>
        
        <label for="option_c">Option C:</label><br>
        <input type="text" id="option_c" name="option_c" value="<?= htmlspecialchars($question_data['option_c']); ?>" required><br><br>
        
        <label for="option_d">Option D:</label><br>
        <input type="text" id="option_d" name="option_d" value="<?= htmlspecialchars($question_data['option_d']); ?>" required><br><br>
        
        <label for="correct_answer">Correct Answer:</label><br>
        <select id="correct_answer" name="correct_answer" required>
            <option value="A" <?= $question_data['correct_answer'] === 'A' ? 'selected' : ''; ?>>A</option>
            <option value="B" <?= $question_data['correct_answer'] === 'B' ? 'selected' : ''; ?>>B</option>
            <option value="C" <?= $question_data['correct_answer'] === 'C' ? 'selected' : ''; ?>>C</option>
            <option value="D" <?= $question_data['correct_answer'] === 'D' ? 'selected' : ''; ?>>D</option>
        </select><br><br>
        
        <label for="difficulty_level">Difficulty Level:</label><br>
        <input type="number" id="difficulty_level" name="difficulty_level" min="1" max="15" value="<?= $question_data['difficulty_level']; ?>" required><br><br>
        <label for="session">Session:</label><br>
        <select id="session" name="session" required>
            <option value="1" <?php if ($question_data['session'] == 1) echo 'selected'; ?>>Session 1</option>
            <option value="2" <?php if ($question_data['session'] == 2) echo 'selected'; ?>>Session 2</option>
            <option value="3" <?php if ($question_data['session'] == 3) echo 'selected'; ?>>Session 3</option>
            <option value="4" <?php if ($question_data['session'] == 4) echo 'selected'; ?>>Session 4</option>
        </select><br><br>
        
        <input type="submit" value="Update Question">
    </form>
</body>
</html>
