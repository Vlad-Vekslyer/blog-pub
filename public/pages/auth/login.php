<?php
  namespace Blog;
  require_once '../../../src/Initializer.php';
  initialize();

  if(isset($_POST['username']) && isset($_POST['password'])){
    $auth = new \Blog\Database\Authentication();
    $result = $auth->login($_POST['username'], $_POST['password']);
    $auth->closeConnection();
    $encodedResult = json_encode($result) or die('unable to encode json');
    echo $encodedResult;
  }

?>
