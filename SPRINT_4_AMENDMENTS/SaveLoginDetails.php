<?php
header("Content-Type: application/json");
//Database connexion
$host = "localhost";
$dbname = "community_fridge";
$username = "root";
$password = "";

try {
    
    $pdo = new PDO("mysql:host=$host;dbname=$dbname",$username,$password);
    $pdo->setAttribute(PDO::ATTER_ERRMODE,PDO::ERRMODE_EXEPTION);
    //example of user input
    $inputUsername = $_POST['username'] ?? '';
    $inputPassword = $_POST['password'] ?? '';

    // validating the input
    if(empty($inputUsername) || empty($inputPassword)) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Username and password are required."]);
        exit;
    }
    // Hash the password for security
    $hashedPassword =password_hash($inputPassword,PASSWORD_DEFAULT);
    // Prepare sql statement to prevent SQL injection attack and save to the database
    $stmt = $pdo ->prepare("INSERT INTO users(username,password) VALUES(:username,:password)");
    $stmt->bindParam(':username',$inputUsername);
    $stmt->bindParam(':password',$hashedPassword);
    $stmt->execute();    // Check if the user was created password successfully

    echo json_encode(["success" => true,"message" => "User Registered Successfully"]);
}
catch (PDOExeption $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error:". $e->getMessage()]);
    exit;
}
?>