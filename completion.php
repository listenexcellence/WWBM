<?php
session_start();
if (!isset($_SESSION['quiz_completed']) || !$_SESSION['quiz_completed']) {
    header('Location: quiz.html'); // Redirect to quiz page if quiz isn't complete
    exit();
}

// Reset the session after displaying the completion page
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['restart_quiz'])) {
    session_unset();
    session_destroy();
    header('Location: quiz.html
');
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="assets/css/winner.css" />
  <title>Quiz Completion</title>
</head>
<body>
  <div class="fireworks-container"></div>

  <div class="congratulations-message">
    <h1>🎉 Congratulations! 🎉</h1>
    <p>Your score: <?php echo $_SESSION['correct_answers']; ?> out of 15</p>
    <form method="POST">
      <button name="restart_quiz">Restart Quiz</button>
    </form>
  </div>

  <script src="assets/js/confetti.min.js"></script>
  <script src="assets/js/fireworks.js"></script>
  <script>
    // Initialize Confetti
    const startConfetti = () => {
      const duration = 5 * 1000; // 5 seconds
      const end = Date.now() + duration;

      const colors = ['#bb0000', '#ffffff'];

      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    };

    // Start Fireworks and Confetti
    window.onload = startConfetti;
  </script>
</body>
</html>
