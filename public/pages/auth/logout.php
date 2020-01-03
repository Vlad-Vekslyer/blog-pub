<?php
  namespace Blog;
  session_start();
  require_once '../../../src/Initializer.php';
  initialize();
  $auth = new \Blog\Database\Authentication();

  $auth->logout($_SESSION['username']);
  $auth->closeConnection();
?>
