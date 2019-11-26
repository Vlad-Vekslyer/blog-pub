<?php
  namespace Blog\Database;
  require_once 'Database.php';

  class Article extends Database {
    public function __construct(){
      parent::__construct();
    }

    public function commit($body, $title = null){
      $statement = $this->connection->prepare("INSERT INTO contributions VALUES(NULL, ?, 0, 0)");
      $statement->bind_param('s', $body);
      $statement->execute() or die($this->connection->error);
    }
  }
?>
