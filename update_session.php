<?php
session_start();

$data = json_decode(file_get_contents('php://input'), true);
if (isset($data['session'])) {
    // Update the session number
    $_SESSION['session_number'] = $data['session'];
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Session number not provided.']);
}
?>
