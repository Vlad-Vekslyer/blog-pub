<?php
  namespace Blog;
  require_once '../../../src/Initializer.php';
  initialize();

  if(isset($_POST['username']) && isset($_POST['password'])){
    $auth = new \Blog\Database\Authentication();
    $result = $auth->register($_POST['username'], $_POST['password']);
    $auth->closeConnection();

    if($result['code'] == 'success'){
      session_start();
      $_SESSION['username'] = $_POST['username'];
    }

    $flash = new \Blog\Session\Flash($result['code'], $result['msg']);
    $flash->serialize();
  }
 ?>
