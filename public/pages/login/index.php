<?php
  namespace Blog;
  require_once '../../../src/Initializer.php';
  initialize();
  $auth = new \Blog\Database\Authentication();
  $auth->login('homer', '1q2w3e4r');
?>
