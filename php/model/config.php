<?php
    require_once (__DIR__ . "/database.php");
    session_start();
    //everytime the file is called upon its going to regenerate the id;
    // going to delete the old session and creat a new one
    session_regenerate_id(true);
    
     $path = "/LesliesAwesomenauts/php/";

    $host = "localhost";
    $username = "root";
    $password = "root";
    $database = "awesomenauts_db";
    
    
    if(!isset($_SESSION ["connection"])) {
        $connection = new Database($host, $username, $password, $database);
        $_SESSION["connection"] = $connection;
    }