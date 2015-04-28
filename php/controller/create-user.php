<?php

require_once (__DIR__ . "/../model/config.php");

$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_EMAIL);
$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_EMAIL);

$salt = "$$$" . "round=5000$" . uniqid(mt_rand(), true) . "$";

$hashedPassword = crypt($password, $salt);

$query = $_SESSION["connection"]->query("INSERT INTO users SET "
        . "email = '',"
        . "username = '$username',"
        . "password = '$hashedPassword',"
        . "salt = '$salt',"
        . "exp = 0, "
        . "exp1 = 0, "
        . "exp2 = 0, "
        . "exp3 = 0, "
        . "exp4 = 0");

$_SESSION["name"] = $username;

        if($query){
            //Head this for Ajax on index.php
            echo "True";
        }
        else{
            echo "<p>" . $_SESSION["connection"]->error . "</p>";
        }