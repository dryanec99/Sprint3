<?php
include'db.php';
session_start();
if(!isset($_SESSION['manager_id'])) {
    exit("Unauthorized access");

}
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $order_id = $_POST['order_id'];
    $manager_id = $_SESSION['manager_id'];
    //to approve the donation
    $stmt = $conn->prepare("UPDATE orders SET status ='Completed',approved_by = ? WHERE id = ?");
    $stmt->execute([$manager_id, $order_id]);

    echo "Donation Approved!";
}
?>