<?php
  namespace Blog;
  require_once '../../src/Initializer.php';
  initialize();

  if(isset($_POST['username']) && isset($_POST['password'])){
    $auth = new \Blog\Database\Authentication();
    $result = $auth->register($_POST['username'], $_POST['password']);
    $auth->closeConnection();

    if($result['code'] == 'success'){
      session_start();
      $_SESSION['username'] = $_POST['username'];
      http_response_code(201);
    } else {
      http_response_code(401);
    }

    $flash = new \Blog\Session\Flash($result['code'], $result['msg']);
    $flash->serialize();
  }
 ?>
