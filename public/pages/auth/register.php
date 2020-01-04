<?php
  namespace Blog;
  require_once '../../../src/Initializer.php';
  initialize();

  if(isset($_POST['username']) && isset($_POST['password'])){
    $auth = new \Blog\Database\Authentication();
    $result = $auth->register($_POST['username'], $_POST['password']);
    $auth->closeConnection();
    $encodedResult = json_encode($result);
    echo $encodedResult;
  }
 ?>
