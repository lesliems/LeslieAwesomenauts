<?php

require_once (__DIR__ . "/../model/config.php");

$array = array(
    'exp'=>'',
    'exp1'=>'', 
    'exp2'=>'',
    'exp3'=>'',
    'exp4'=>'',
    
);


$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING);
$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_STRING);
$query = $_SESSION["connection"]->query("SELECT * FROM users WHERE username = '$username'");

//num_rows checks how many rows were retrieved from the database
if ($query->num_rows == 1) {
    $row = $query->fetch_array();

    if ($row["password"] === crypt($password, $row["salt"])) {
        $_SESSION["authenticated"] = true;
        $array["exp"] = $row["exp"];
        $array["exp1"] = $row["exp1"];
        $array["exp2"] = $row["exp2"];
        $array["exp3"] = $row["exp3"];
        $array["exp4"] = $row["exp4"];
        
        echo json_encode($array);
    }
    else{
        echo "<p>Invalid username and password</p>";
    }
}
    else {
        echo"<p>Invalid username and password</p>";
    }