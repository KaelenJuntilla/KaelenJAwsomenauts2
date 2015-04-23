<?php

class Database {

    //these files are only accesed through this file, public files can access that specific variable's information// 
    private $connection;
    private $host;
    private $username;
    private $password;
    private $database;
    public $error;

    //this passes the host,username,password,and database that lets us establish a connection and assigns this information to the global varibales// 
    public function __construct($host, $username, $password, $database) {
        $this->host = $host;
        $this->username = $username;
        $this->password = $password;
        $this->database = $database;

        $this->connection = new mysqli($host, $username, $password);
        //if there was no connection then the program would die//
        if ($this->connection->connect_error) {
            die("<p>Error: " . $this->connection->connect_error . "</p>");
        }

        $exists = $this->connection->select_db($database);
        //this says if the database was created then echo "Database already exists//
        if (!$exists) {
            $query = $this->connection->query("CREATE DATABASE $database");
            if ($query) {
                echo "<p>Successfully created database:" . $database . "</p>";
            }
        } else {
            echo "<p>Database already exists</p>";
        }
    }

    public function openConnection() {
        $this->connection = new mysqli($this->host, $this->username, $this->password, $this->database);
        //this says if there is an error the program will die//
        if ($this->connection->connect_error) {
            die("<p>Error: " . $this->connection->connect_error . "</p>");
        }
    }

    public function closeConnection() {
        if (isset($this->connection)) {
            $this->connection->close();
        }
    }

    public function query($string) {
        $this->openConnection();

        $query = $this->connection->query($string);
        
        if (!$query) {
            $this->error = $this->connection->error;
        }

        $this->closeConnection();

        return $query;
    }

}
