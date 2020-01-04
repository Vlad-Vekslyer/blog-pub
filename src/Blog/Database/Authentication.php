<?php
  namespace Blog\Database;
  require_once 'Database.php';

  class Authentication extends Database {
    public function __construct(){
      parent::__construct();
    }

    public function register($username, $password){
      $hash = password_hash($password, PASSWORD_DEFAULT);
      $statement = $this->connection->prepare('INSERT INTO users VALUES(NULL, ?, ?, "regular")');
      $statement->bind_param('ss', $username, $hash);
      $statement->execute() or die($this->connection->error);
      $statement->close();
      return ['code' => 'success','msg' => 'Successfully Registered'];
    }

    public function login($username, $password) {
      $dbPasswordStm = $this->connection->prepare('SELECT password from users WHERE username = ?');
      $dbPasswordStm->bind_param('s', $username);
      $dbPasswordStm->execute() or die($this->connection->error);
      $dbPasswordStm->bind_result($dbPassword);
      $dbPasswordStm->fetch();
      if (password_verify($password, $dbPassword))
        return ['code' => 'success', 'msg' => 'Successfully logged in'];
      else
        return ['code' => 'failure', 'msg' => 'Invalid Password'];
    }
  }
?>
