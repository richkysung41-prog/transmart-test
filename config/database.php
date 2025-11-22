<?php
// config/database.php

class Database {
    private $host = "127.0.0.1";
    private $port = 3306;
    private $db_name = "transmart_db";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name, 
                $this->username, 
                $this->password
            );
            $this->conn->exec("set names utf8mb4");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            error_log("Connection error: " . $exception->getMessage());
            return null;
        }
        return $this->conn;
    }
}

// Helper functions
function executeQuery($sql, $params = []) {
    $database = new Database();
    $db = $database->getConnection();
    
    try {
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    } catch(PDOException $exception) {
        return ["error" => $exception->getMessage()];
    }
}

function getSingleResult($sql, $params = []) {
    $stmt = executeQuery($sql, $params);
    if (is_array($stmt) && isset($stmt['error'])) {
        return $stmt;
    }
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function getAllResults($sql, $params = []) {
    $stmt = executeQuery($sql, $params);
    if (is_array($stmt) && isset($stmt['error'])) {
        return $stmt;
    }
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function insertRecord($table, $data) {
    $columns = implode(", ", array_keys($data));
    $placeholders = ":" . implode(", :", array_keys($data));
    
    $sql = "INSERT INTO $table ($columns) VALUES ($placeholders)";
    
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db === null) {
        return ['error' => 'Database connection failed'];
    }
    
    try {
        $stmt = $db->prepare($sql);
        $stmt->execute($data);
        return $db->lastInsertId();
    } catch (PDOException $e) {
        error_log("Insert error: " . $e->getMessage());
        return ['error' => $e->getMessage()];
    }
}

function updateRecord($table, $data, $where) {
    $set = "";
    foreach($data as $key => $value) {
        $set .= "$key = :$key, ";
    }
    $set = rtrim($set, ", ");
    
    $sql = "UPDATE $table SET $set WHERE $where";
    $stmt = executeQuery($sql, $data);
    
    if (is_array($stmt) && isset($stmt['error'])) {
        return $stmt;
    }
    
    return $stmt->rowCount();
}

function deleteRecord($table, $where, $params = []) {
    $sql = "DELETE FROM $table WHERE $where";
    $stmt = executeQuery($sql, $params);
    
    if (is_array($stmt) && isset($stmt['error'])) {
        return $stmt;
    }
    
    return $stmt->rowCount();
}
?>