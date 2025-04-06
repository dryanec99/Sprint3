<?php
// filepath: c:\Users\asyad\Documents\GitHub\Software-Engineering-Project-Organising-The-Comunity-Fridge\.git\WEB SPRINT 3\New folder (3)\SaveLoginDetails.php

// Database connection (update with your credentials)
$host = "localhost";
$dbname = "community_fridge";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Example user input (replace with actual form input)
    $inputUsername = "exampleUser";
    $inputPassword = "examplePassword123";

    // Validate input
    if (empty($inputUsername) || empty($inputPassword)) {
        die("Username and password are required.");
    }

    // Hash the password
    $hashedPassword = password_hash($inputPassword, PASSWORD_DEFAULT);

    // Save to database
    $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (:username, :password)");
    $stmt->bindParam(':username', $inputUsername);
    $stmt->bindParam(':password', $hashedPassword);
    $stmt->execute();

    echo "User registered successfully!";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>