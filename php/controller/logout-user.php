<?php

require_once(__DIR__ . "/../model/config.php");

unset($_SESSION["authenticated"]);

//when the user is logged out or not logged in the program will be destroyed//
session_destroy();
header("Location: " . $path . "index.php");

