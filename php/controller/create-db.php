<?php
//.. means step out 
require_once(__DIR__ . "/../model/config.php");
 require_once (__DIR__ . "/../controller/login-verify.php");

    if(!authenticateUser()){
        //send a header to the actual web browser
        header("Location: " . $path . "index.php");
        die();
    }
//making the table users
$query = $_SESSION["connection"]->query("CREATE TABLE users ("
        . "id int(11) NOT NULL AUTO_INCREMENT,"
        . "username varchar(30) NOT NULL,"
        . "email varchar(50) NOT NULL,"
        . "password char(128) NOT NULL, "
        //salt is security
        . "salt char(128) NOT NULL,"
        . "exp int(4),"
        . "exp1 int(4),"
        . "exp2 int(4),"
        . "exp3 int(4),"
        . "exp4 int(4),"
        . "PRIMARY KEY (id))");

if ($query) {
    //makes a table for users
    echo "<p>Successfully created table: users </p>";
 } 
 else {
    echo "<p>" . $_SESSION["connection"]->error ."</p>";
}