<?php
// filepath: c:\Users\asyad\Documents\GitHub\Software-Engineering-Project-Organising-The-Comunity-Fridge\.git\WEB SPRINT 3\New folder (3)\sendNotificationProcess.php

// Enable CORS if needed (for cross-origin requests)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["success" => false, "error" => "Invalid request method."]);
    exit;
}

// Get the raw POST data
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Validate the input
if (!isset($data['subject'], $data['message'], $data['audience']) || 
    empty($data['subject']) || 
    empty($data['message']) || 
    empty($data['audience'])) {
    http_response_code(400); // Bad Request
    echo json_encode(["success" => false, "error" => "All fields are required."]);
    exit;
}

// Sanitize input
$subject = htmlspecialchars($data['subject'], ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($data['message'], ENT_QUOTES, 'UTF-8');
$audience = htmlspecialchars($data['audience'], ENT_QUOTES, 'UTF-8');

// Example: Database connection (update with your credentials)
$host = "localhost";
$dbname = "community_fridge";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Insert the notification into the database
    $stmt = $pdo->prepare("INSERT INTO notifications (subject, message, audience, created_at) VALUES (:subject, :message, :audience, NOW())");
    $stmt->bindParam(':subject', $subject);
    $stmt->bindParam(':message', $message);
    $stmt->bindParam(':audience', $audience);
    $stmt->execute();

    // Respond with success
    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    // Handle database errors
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
?>