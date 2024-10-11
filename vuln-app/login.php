<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH");
header("Access-Control-Allow-Headers: *");

session_start();
$conn = mysqli_connect("localhost", "root", "root", "webappsec");
if (!$conn) {
    echo json_encode(['success' => false, 'message' => "Connection failed: " . mysqli_connect_error()]);
    die("Connection failed: " . mysqli_connect_error());
}

if (!isset($_SESSION['users_table'])) {
    $_SESSION['users_table'] = [];
}

$email = '';
$password = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email']; 
    $password = md5($_POST['password']); 

    try {
        $query = "SELECT * FROM users WHERE password = '$password' AND email = '$email'";
        $result = mysqli_query($conn, $query);

        if (mysqli_num_rows($result) > 0) {
            $_SESSION['email'] = $email;
            while ($row = mysqli_fetch_assoc($result)) {
                $_SESSION['users_table'][] = $row;
            }
            echo json_encode(['success' => true, 'message' => 'Login successful']);
            header("Location: dashboard.php");
            exit(); 
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
            echo "<script>
                alert('Invalid email or password. Entered Email: " . $email . "Entered Password: " . $_POST['password'] . "');
            </script>";
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'An error occurred: ' . addslashes($e->getMessage())]);
        echo "<script>
            alert('An error occurred: " . addslashes($e->getMessage()) . "Entered Email: " . $email . "Entered Password: " . $_POST['password'] . "');
        </script>";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Login to Web Application</h1>
        <div class="form-container">
            <h2>Login</h2>
            <form method="POST">
                <div class="form-group">
                    <label>Email</label>
                    <input type="text" name="email">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password">
                </div>
                <button type="submit" name="login" class="btn">Login</button>
            </form>
            <p>Don't have an account? <a href="register.php">Register here</a></p>
        </div>
    </div>
</body>
</html>
