<?php
  namespace Blog;
  require_once '../../../src/Initializer.php';
  initialize();
  $auth = new \Blog\Database\Authentication();

  if(isset($_POST['username']) && isset($_POST['password'])){
    $result = $auth->login($_POST['username'], $_POST['password']);
    $encodedResult = json_encode($result) or die('unable to encode json');
    echo $encodedResult;
  }

  $auth->closeConnection();
?>
