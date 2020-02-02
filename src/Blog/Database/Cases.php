<?php
  namespace Blog\Database;
  require_once 'Database.php';

  class Cases extends Database {
    public function __construct(){
      parent::__construct();
    }

    public function insert($contId){
      $statement = $this->connection->prepare('INSERT INTO cases (contribution) VALUES(?)');
      $statement->bind_param('i', $contId);
      $statement->execute() or die($this->connection->error);
      $statement->close();
    }
  }

 ?>
