<?php
  namespace Blog;
  session_start();
  require_once '../../src/Initializer.php';
  initialize();

  session_unset();
  session_destroy();
?>
