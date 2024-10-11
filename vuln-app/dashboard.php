<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH");
header("Access-Control-Allow-Headers: *");

session_start();
if (!isset($_SESSION['email'])) {
    header("Location: index.php");
    exit;
}

// Vulnerable database connection
$conn = mysqli_connect("localhost", "root", "root", "webappsec");
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$email = $_SESSION['email'];

// Handle adding tasks (SQL Injection Vulnerability)
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['addTask'])) {
    $taskName = mysqli_real_escape_string($conn, $_POST['task_name']); // Escape for SQL
    $description = mysqli_real_escape_string($conn, $_POST['description']); // Escape for SQL
    $priority = mysqli_real_escape_string($conn, $_POST['priority']); // Escape for SQL

    // This query is still vulnerable to SQL Injection
    $query = "INSERT INTO tasks (user_email, name, description, priority) VALUES ('$email', '$taskName', '$description', '$priority')";
    mysqli_query($conn, $query);
}

// Handle deleting tasks (SQL Injection Vulnerability)
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['deleteTask'])) {
    $taskId = mysqli_real_escape_string($conn, $_POST['task_id']); // Escape for SQL

    // This query is still vulnerable to SQL Injection
    $query = "DELETE FROM tasks WHERE id = $taskId";
    mysqli_query($conn, $query);
}

// Retrieve existing tasks for the user (SQL Injection Vulnerability)
$query = "SELECT * FROM tasks WHERE user_email = '$email'";
$result = mysqli_query($conn, $query);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Vulnerable WebApp</title>
    <!-- Link to external CSS file -->
    <link rel="stylesheet" href="style2.css">
</head>

<body>
    <div class="container">
        <h1>Welcome, <?php echo $email; ?>!</h1> <!-- Vulnerable to XSS, email is not sanitized -->

        <div class="form-container">
            <h2>Add Task</h2>
            <form method="POST">
                <div class="form-group">
                    <label>Task Name</label>
                    <input type="text" name="task_name" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" required></textarea>
                </div>
                <div class="form-group">
                    <label>Priority</label>
                    <select name="priority">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                </div>
                <button type="submit" name="addTask" class="btn">Add Task</button>
            </form>
        </div>

        <h2>Your Tasks</h2>
        <table>
            <tr>
                <th>ID</th>
                <th>Task Name</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Action</th>
            </tr>
            <?php
            while ($row = mysqli_fetch_assoc($result)) {
                echo "<tr>";
                echo "<td>{$row['id']}</td>";
                echo "<td>{$row['name']}</td>";
                echo "<td>{$row['description']}</td>";
                echo "<td>{$row['priority']}</td>";
                echo "<td>
                        <form method='POST' style='display:inline;'>
                            <input type='hidden' name='task_id' value='{$row['id']}'>
                            <button type='submit' name='deleteTask' class='btn'>Delete</button>
                        </form>
                      </td>";
                echo "</tr>";
            }
            ?>
        </table>
    </div>
</body>

</html>
