<?php
  namespace Blog;
  require_once '../../../src/Initializer.php';
  initialize();

  if(isset($_POST['username']) && isset($_POST['password'])){
    session_start();
    $auth = new \Blog\Database\Authentication();
    $result = $auth->login($_POST['username'], $_POST['password']);
    $auth->closeConnection();

    if($result['code'] == 'success'){
      $_SESSION['username'] = $_POST['username'];
    } else {
      http_response_code(401);
    }

    $flash = new \Blog\Session\Flash($result['code'], $result['msg']);
    $flash->serialize();
  }

?>
