<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH");
header("Access-Control-Allow-Headers: *");
session_start();

if (isset($_SESSION['users_table'])) {
    // Output session data in JSON format
    header('Content-Type: application/json');
    echo json_encode($_SESSION['users_table']);
} else {
    echo json_encode(["message" => "No user data in session."]);
}
?>
