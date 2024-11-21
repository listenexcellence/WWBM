<?php
include("../includes/conn.php");
$query = "SELECT * FROM questions";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    echo '<table>
        <thead>
        <tr>
            <th>Question</th>
            <th>Option A</th>
            <th>Option B</th>
            <th>Option C</th>
            <th>Option D</th>
            <th>Correct Answer</th>
            <th>Difficulty Level</th>
            <th>Session</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>';
    
    // Loop through each row in the result set
    while ($row = $result->fetch_assoc()) {
        echo '<tr>
            <td>' . htmlspecialchars($row['question']) . '</td>
            <td>' . htmlspecialchars($row['option_a']) . '</td>
            <td>' . htmlspecialchars($row['option_b']) . '</td>
            <td>' . htmlspecialchars($row['option_c']) . '</td>
            <td>' . htmlspecialchars($row['option_d']) . '</td>
            <td>' . htmlspecialchars($row['correct_answer']) . '</td>
            <td>' . htmlspecialchars($row['difficulty_level']) . '</td>
            <td>' . htmlspecialchars($row['session']) . '</td>
            <td>
                <a href="edit_question.php?id=' . $row['id'] . '">Edit</a>
            </td>
        </tr>';
    }

    echo '</tbody></table>';
} else {
    echo '<p>No questions found in the database.</p>';
}

$conn->close();
?>
