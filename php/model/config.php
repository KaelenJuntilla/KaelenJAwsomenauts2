<?php

require_once(__DIR__ . "/database.php");
session_start();
//when the session is started an id is generated and used when the session is active but when the session is restarted another id is generated. this "session_regenerate stops hackers from hacking the blog//
session_regenerate_id(true);

$path = "/AwsomenautsKaelenJ/php";

$host = "localhost";
$username = "root";
$password = "root";
$database = "awsomenauts_db";
//The session or this line of code lets the connection variable be used throughout the code//
if (!isset($_SESSION["connection"])) {
    $connection = new Database($host, $username, $password, $database);
    $_SESSION["connection"] = $connection;
}
    
    