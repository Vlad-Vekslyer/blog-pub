<?php
  namespace Blog;
  require_once "../../src/Initializer.php";
  initialize();

  // flash messages testing block
  session_start();
  $_SESSION['flash'] = [
      'code' => 'success',
      'msg' => 'Successfully logged in'
  ];
  //

  $landing = new \Blog\Template\Template('landing.html.twig', [
    'flash' => isset($_SESSION['flash']) ? $_SESSION['flash'] : NULL,
    'username' => isset($_SESSION['username']) ? $_SESSION['username'] : NULL
  ]);
  $landing->output();
?>
