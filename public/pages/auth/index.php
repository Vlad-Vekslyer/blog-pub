<?php
  namespace Blog;
  require_once '../../../src/Initializer.php';
  initialize();
  $auth = new \Blog\Database\Authentication();

  print_r($_POST);
  print_r($_GET);
  print_r($_SERVER);

  if(isset($_POST['username']) && isset($_POST['password'])){
    echo 'hi';
    $result = $auth->login($_POST['username'], $_POST['password']);
    $encodedResult = json_encode($result) or die('unable to encode json');
    echo $encodedResult;
  }

  $auth->closeConnection();
?>
